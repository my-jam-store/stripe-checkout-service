const shipping = rootRequire('services/checkout/shipping')
const crypto = rootRequire('services/crypto')

async function processedLineItems(lineItems) {
  const processedItems = []
  let processedItem
  let subtotal = 0

  for (const lineItem in lineItems) {
    processedItem = lineItems[lineItem]
    processedItem.currency = process.env.CURRENCY
    processedItem.amount = await lineItemAmount(processedItem.amount, processedItem.product_id)

    subtotal += processedItem.amount
    processedItem.amount *= 100

    delete processedItem.product_id

    processedItems.push(processedItem)
  }

  processedItems.push(shippingLineItem(subtotal))

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
  return {
    "name": "Shipping Fee",
    "currency": process.env.CURRENCY,
    "amount": shipping.amount(subtotal),
    "quantity": 1
  }
}

module.exports = {
  processedLineItems
}
