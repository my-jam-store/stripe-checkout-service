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

async function lineItemAmount(lineItem, fieldsMapping, field) {
  let amount = null

  switch (process.env.AMOUNT_MANIPULATION_PROTECTION_TYPE) {
    case 'encryption':
      if (typeOf(lineItem[fieldsMapping.amount]) === 'string' && !Number(lineItem[fieldsMapping.amount])) {
        amount = await encryptedLineItemAmount(lineItem, fieldsMapping)
      }

      break
    default:
      amount = lineItem[fieldsMapping.amount]
  }

  return amount * 100
}

async function encryptedLineItemAmount(lineItem, fieldsMapping) {
  const amount = JSON.parse(await crypto.decrypt(lineItem[fieldsMapping.amount]))

  if (amount[fieldsMapping.id] !== lineItem[fieldsMapping.id]) {
    throw new Error(`Item "${lineItem[fieldsMapping.id]}" amount is invalid.`)
  }

  return amount[fieldsMapping.amount]
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

module.exports = {
  processedLineItems
}
