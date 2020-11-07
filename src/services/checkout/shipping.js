function amount(subtotal) {
  return !isFreeShipping(subtotal) ? process.env.SHIPPING_FEE * 100 : 0
}

function isShippingProduct(productType) {
  return productType === 'shipping_fee'
}

function isFreeShipping(subtotal) {
  return subtotal >= process.env.FREE_SHIPPING_SUBTOTAL
}

module.exports = {
  amount,
  isShippingProduct
}
