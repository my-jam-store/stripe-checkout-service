const crypto = rootRequire('services/crypto')

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
        case 'product_id':
          break
        case 'code':
        case 'amount':
          amount = await lineItemAmount(
            item[fieldsMapping[fieldMapping]].amount,
            item[fieldsMapping[fieldMapping]].product_id
          )

          if (amount) {
            processedItem.amount = amount
          }

          break
        case 'quantity':
          processedItem[fieldMapping] = item[fieldsMapping[fieldMapping]] || 1
          break
        case 'images':
          if (typeof item[fieldsMapping[fieldMapping]] === 'string') {
            processedItem[fieldMapping] = [item[fieldsMapping[fieldMapping]]]
            break
          }
        default:
          processedItem[fieldMapping] = item[fieldsMapping[fieldMapping]]
      }
    }

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

  if (amount[fieldsMapping.product_id] !== productId) {
    throw new Error(`Item "${productId}" amount is invalid.`)
  }

  return amount[fieldsMapping.amount]
}

function customFieldsMapping() {
  return {
    "product_id": "product_id",
    "code": "code",
    "name": "name",
    "description": "description",
    "images": "image",
    "quantity": "quantity",
    "amount": "price"
  }
}

module.exports = {
  processedLineItems
}
