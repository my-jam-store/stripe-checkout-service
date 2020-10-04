function amount(subtotal) {
  return !isFreeShipping(subtotal) ? process.env.SHIPPING_FEE * 100 : 0
}

function isFreeShipping(subtotal) {
  return subtotal >= process.env.FREE_SHIPPING_SUBTOTAL
}

module.exports = {
  amount
}
