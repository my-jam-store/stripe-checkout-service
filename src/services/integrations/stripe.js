const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY, stripeOptions)
const crypto = rootRequire('services/crypto')

async function createCheckoutSession(lineItems) {
  return stripe.checkout.sessions.create({
    payment_method_types: process.env.PAYMENT_METHOD_TYPES.split(','),
    line_items: await processedLineItems(lineItems),
    payment_intent_data: {
      capture_method: 'manual',
    },
    success_url: `${process.env.DOMAIN}/${process.env.SUCCESS_URL_PATH}`,
    cancel_url: `${process.env.DOMAIN}/${process.env.CANCEL_URL_PATH}`
  })
}

function checkoutSession(sessionId) {
  return stripe.checkout.sessions.retrieve(sessionId)
}

async function processedLineItems(lineItems) {
  const fieldsMapping = customFieldsMapping()
  const processedItems = []
  let processedItem
  let amount
  let item

  for (const lineItem in lineItems) {
    item = lineItems[lineItem]
    processedItem = { "currency": process.env.CURRENCY }

    for (const fieldMapping in fieldsMapping) {
      switch (fieldMapping) {
        case 'id':
          break
        case 'code':
        case 'amount':
          amount = await lineItemAmount(
            item,
            fieldsMapping,
            fieldMapping
          )

          if (amount) {
            processedItem.amount = amount
          }

          break
        case 'images':
          if (typeof item[fieldsMapping[fieldMapping]] === 'string') {
            processedItem[fieldMapping] = [item[fieldsMapping[fieldMapping]]]
          }

          break
        case 'quantity':
          if (!item[fieldsMapping[fieldMapping]]) {
            processedItem[fieldMapping] = 1
          }

          break
        default:
          processedItem[fieldMapping] = item[fieldsMapping[fieldMapping]]
      }
    }

    validateRequiredLineItemFields(processedItem)
    processedItems.push(processedItem)
  }

  return processedItems
}

async function lineItemAmount(lineItem, fieldsMapping, field) {
  let amount = null

  switch (process.env.AMOUNT_MANIPULATION_PROTECTION_TYPE) {
    case 'encryption':
      if (field === 'code') {
        amount = await encryptedLineItemAmount(lineItem, fieldsMapping)
      }

      break
    default:
      amount = lineItem[fieldsMapping.amount]
  }

  return amount * 100
}

async function encryptedLineItemAmount(lineItem, fieldsMapping) {
  validateIdField(lineItem, fieldsMapping.id)

  if (!lineItem[fieldsMapping.code]) {
    throw new Error(
      `Field "${fieldsMapping.code}" is missing in one of the items.`
    )
  }

  const code = JSON.parse(await crypto.decrypt(lineItem[fieldsMapping.code]))

  if (code[fieldsMapping.id] !== lineItem[fieldsMapping.id]) {
    throw new Error(`Item "${lineItem[fieldsMapping.id]}" code is invalid.`)
  }

  return code[fieldsMapping.amount]
}

function validateRequiredLineItemFields(lineItem) {
  requiredLineItemFields().forEach(requiredField => {
    if (!lineItem[requiredField]) {
      throw new Error(
        `Field "${requiredField}" is missing in one of the items.`
      )
    }
  })
}

function validateIdField(lineItem, idField) {
  if (!lineItem[idField]) {
    throw new Error(
      `Field "${idField}" is missing in one of the items.`
    )
  }
}

function customFieldsMapping() {
  return {
    "id": "id",
    "code": "code",
    "name": "name",
    "description": "description",
    "images": "image",
    "quantity": "quantity",
    "amount": "price"
  }
}

function requiredLineItemFields() {
  return [
    'name',
    'amount'
  ]
}

function stripeOptions() {
  const options = {}

  if (process.env.STRIPE_MAX_NETWORK_RETRIES) {
    options.maxNetworkRetries = process.env.STRIPE_MAX_NETWORK_RETRIES
  }

  if (process.env.STRIPE_TIMEOUT) {
    options.timeout = process.env.STRIPE_TIMEOUT
  }

  return options
}

module.exports = {
  createCheckoutSession,
  checkoutSession
}
