function isEnabled() {
  return process.env.SHIPPING_ENABLED === 'true' && process.env.SHIPPING_FEE
}

function isFreeShipping(subtotal) {
  return subtotal >= process.env.FREE_SHIPPING_SUBTOTAL
}

module.exports = {
  isEnabled
}
