const utils = require('simplechainjs-util')
const BN = utils.BN
const error = require('../exceptions.js').ERROR
const assert = require('assert')

module.exports = function (opts) {
  assert(opts.data)

  var results = {}

  // results.gasUsed = new BN(opts._common.param('gasPrices', 'x25519key'))
  results.gasUsed = new BN()

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0)
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  var data = utils.setLengthRight(opts.data, 64)

  var data1 = data.slice(0, 32)
  var data2 = data.slice(32, 64)

  results.return = utils.x25519key(data1, data2)
  results.exception = 1

  return results
}
