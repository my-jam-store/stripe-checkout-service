const crypto = rootRequire('services/crypto')

async function processedLineItems(lineItems) {
  const processedItems = []
  let processedItem

  for (const lineItem in lineItems) {
    processedItem = lineItems[lineItem]
    processedItem.currency = process.env.CURRENCY
    processedItem.amount = await lineItemAmount(processedItem.amount, processedItem.product_id)

    delete processedItem.product_id

    processedItems.push(processedItem)
  }

  return processedItems
}

async function lineItemAmount(amount, productId = null) {
  switch (process.env.AMOUNT_MANIPULATION_PROTECTION_TYPE) {
    case 'encryption':
      if (typeOf(amount) === 'string' && !Number(amount)) {
        amount = await encryptedLineItemAmount(amount, productId)
      }

      break
  }

  return amount * 100
}

async function encryptedLineItemAmount(amount, productId) {
  amount = JSON.parse(await crypto.decrypt(amount))

  if (amount['product_id'] !== productId) {
    throw new Error(`Item "${productId}" amount is invalid.`)
  }

  return amount['amount']
}

module.exports = {
  processedLineItems
}
