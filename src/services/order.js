const airtable = rootRequire('services/integrations/airtable')
const checkoutSession = rootRequire('services/checkout/session')
const shipping = rootRequire('services/checkout/shipping')
const order = rootRequire('models/order')
const orderItem = rootRequire('models/order/item')

async function create(checkoutSessionId) {
  if (process.env.ORDER_CREATE_ENABLED !== 'true') {
    return
  }

  const checkout = await checkoutSession.get(checkoutSessionId)

  const promotionCodePromise = checkout.promotionCode()
  const items = lineItems(checkout.line_items.data)
  const promotionCode = await promotionCodePromise

  const orderData = new order(checkout, promotionCode).data
  const orderRecord = await airtable.createRecord(process.env.AIRTABLE_ORDER_VIEW, orderData)

  await addItems(items, orderRecord.id)
}

function lineItems(items) {
  const lineItems = []

  items.forEach(item => {
    if (!shipping.isShippingProduct(item.price.product.metadata.type)) {
      lineItems.push({ fields: new orderItem(item).data })
    }
  })

  return lineItems
}

async function addItems(items, orderId) {
  items.forEach(item => { item.fields['order_id'] = [ orderId ] })
  await airtable.createRecord(process.env.AIRTABLE_ORDER_ITEMS_VIEW, items)
}

module.exports = {
  create
}
