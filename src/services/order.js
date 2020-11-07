const airtable = rootRequire('services/integrations/airtable')
const checkoutSession = rootRequire('services/checkout/session')
const shipping = rootRequire('services/checkout/shipping')

async function create(checkoutSessionId) {
  if (process.env.ORDER_CREATE_ENABLED !== 'true') {
    return
  }

  const checkout = await checkoutSession.get(checkoutSessionId)

  const promotionCodePromise = checkout.promotionCode()
  const items = lineItems(checkout.line_items.data)
  const promotionCode = await promotionCodePromise

  const data = orderData(checkout.payment_intent, checkout.charges, promotionCode, checkout.phone)
  const order = await airtable.createRecord(process.env.AIRTABLE_ORDER_VIEW, data)

  await addItems(items, order.id)
}

function orderData(paymentIntent, charges, promotionCode = null, phone = null) {
  const billing = paymentIntent.shipping || charges.billing_details

  return data = {
    payment_intent_id: paymentIntent.id,
    customer_name: billing.name,
    email: charges.billing_details.email,
    coupon_code: promotionCode || '',
    total: parseFloat((paymentIntent.amount / 100).toFixed(2)),
    date: new Date(charges.created * 1000).toISOString(),
    address: [billing.address.line1, billing.address.line2].filter(Boolean).join(' - '),
    post_code: billing.address.postal_code,
    city: billing.address.city,
    phone_number: phone || billing.phone
  }
}

function lineItems(items) {
  const lineItems = []
  let product

  items.forEach(item => {
    product = item.price.product

    if (shipping.isShippingProduct(product.metadata.type)) {
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

module.exports = {
  create
}
