const ShippingProduct = rootRequire('models/checkout/line-item/fee/shipping')

function amount(subtotal) {
  return !isFreeShipping(subtotal) ? process.env.SHIPPING_FEE * 100 : 0
}

function isEnabled() {
  return process.env.SHIPPING_ENABLED === 'true' && process.env.SHIPPING_FEE
}

function isShippingProduct(productType) {
  return productType === this.feeProduct.type
}

function isFreeShipping(subtotal) {
  return subtotal >= process.env.FREE_SHIPPING_SUBTOTAL
}

module.exports = {
  amount,
  isEnabled,
  isShippingProduct,
  feeProduct: ShippingProduct
}
