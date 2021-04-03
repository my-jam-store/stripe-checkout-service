const shipping = rootRequire('services/checkout/shipping')
const tip = rootRequire('services/checkout/tip')
const crypto = rootRequire('services/crypto')

async function processedLineItems(lineItems, tipAmount = null) {
  const processedItems = []
  let processedItem
  let subtotal = 0

  for (const lineItem in lineItems) {
    processedItem = lineItems[lineItem]
    processedItem.price_data.currency = process.env.CURRENCY

    processedItem.price_data.unit_amount = await lineItemAmount(
      processedItem.price_data.unit_amount,
      processedItem.product_id
    )

    subtotal += processedItem.price_data.unit_amount
    processedItem.price_data.unit_amount *= 100

    delete processedItem.product_id

    processedItems.push(processedItem)
  }

  if (shipping.isEnabled()) {
    processedItems.push(shippingLineItem(subtotal))
  }

  if (tip.isEnabled() && tipAmount) {
    processedItems.push(tipLineItem(tipAmount))
  }

  return processedItems
}

async function lineItemAmount(amount, productId = null) {
  switch (process.env.AMOUNT_MANIPULATION_PROTECTION_TYPE) {
    case 'encryption':
      if (!Number(amount)) {
        amount = await encryptedLineItemAmount(amount, productId)
      }

      break
  }

  return amount
}

async function encryptedLineItemAmount(amount, productId) {
  amount = JSON.parse(await crypto.decrypt(amount))

  if (amount['product_id'] !== productId) {
    throw new Error(`Item "${productId}" amount is invalid.`)
  }

  return amount['amount']
}

function shippingLineItem(subtotal) {
  return feeLineItem(shipping.feeProduct, shipping.amount(subtotal))
}

function tipLineItem(amount) {
  return feeLineItem(tip.product, tip.amount(amount))
}

function feeLineItem(feeProduct, amount) {
  return {
    price_data: {
      currency: process.env.CURRENCY,
      product_data: {
        name: feeProduct.name,
        metadata: { type: feeProduct.type }
      },
      unit_amount: amount
    },
    quantity: 1
  }
}

module.exports = {
  processedLineItems
}
