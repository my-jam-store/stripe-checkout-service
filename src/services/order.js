const stripe = rootRequire('services/integrations/stripe')
const airtable = rootRequire('services/integrations/airtable')

async function create(checkoutSessionId) {
  const checkoutSession = await stripe.checkoutSession(checkoutSessionId, checkoutSessionExpandedData())

  const promotionCode = checkoutSession.total_details.breakdown.discounts.length
    ? checkoutSession.total_details.breakdown.discounts[0].discount.promotion_code
    : null

  const data = await orderData(checkoutSession.payment_intent, promotionCode)
  const items = lineItems(checkoutSession.line_items.data)

  const order = await airtable.createRecord(process.env.AIRTABLE_ORDER_VIEW, data)
  await addItems(items, order.id)
}

async function orderData(paymentIntent, promotionCodeId = null) {
  const chargesData = paymentIntent.charges.data[0]
  const billing = paymentIntent.shipping || chargesData.billing_details
  const promotionCode = promotionCodeId ? await stripe.promotionCode(promotionCodeId) : null

  return data = {
    payment_intent_id: paymentIntent.id,
    customer_name: billing.name,
    email: chargesData.billing_details.email,
    coupon_code: promotionCode ? promotionCode.code : '',
    total: parseFloat((paymentIntent.amount / 100).toFixed(2)),
    date: new Date(chargesData.created * 1000).toISOString(),
    address: [billing.address.line1, billing.address.line2].filter(Boolean).join(' - '),
    post_code: billing.address.postal_code,
    city: billing.address.city,
    phone_number: billing.phone
  }
}

function lineItems(items) {
  const lineItems = []
  let product

  items.forEach(item => {
    product = item.price.product

    if (product.metadata.type === 'shipping_fee') {
      return
    }

    lineItems.push({
      fields: {
        name: product.name,
        sku: product.metadata.sku,
        image: product.images.length ? product.images[0] : '',
        price: item.price.unit_amount / 100,
        qty: item.quantity
      }
    })
  })

  return lineItems
}

async function addItems(items, orderId) {
  items.forEach(item => {
    item.fields['order_id'] = [ orderId ]
  })

  await airtable.createRecord(process.env.AIRTABLE_ORDER_ITEMS_VIEW, items)
}

function checkoutSessionExpandedData() {
  return [
    'line_items.data.price.product',
    'payment_intent',
    'total_details.breakdown.discounts'
  ]
}

module.exports = {
  create
}
