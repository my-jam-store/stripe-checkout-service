const airtable = rootRequire('services/integrations/airtable')
const checkoutSession = rootRequire('services/checkout/session')
const shipping = rootRequire('services/checkout/shipping')
const tip = rootRequire('services/checkout/tip')
const Order = rootRequire('models/order')
const OrderItem = rootRequire('models/order/item')

async function create(checkoutSessionId) {
  if (process.env.ORDER_CREATE_ENABLED !== 'true') {
    return
  }

  const checkout = await checkoutSession.get(checkoutSessionId)

  const promotionCodePromise = checkout.promotionCode()
  const items = lineItems(checkout.line_items.data)
  const promotionCode = await promotionCodePromise

  const orderData = new Order(checkout, promotionCode).data
  const completedOrder = await airtable.createRecord(process.env.AIRTABLE_ORDER_VIEW, orderData)

  await addItems(items, completedOrder.id)
}

function lineItems(items) {
  const lineItems = []

  items.forEach(item => {
    if (!shipping.isShippingProduct(item.price.product.metadata.type)
      && !tip.isTipProduct(item.price.product.metadata.type)) {
      lineItems.push({ fields: new OrderItem(item).data })
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
