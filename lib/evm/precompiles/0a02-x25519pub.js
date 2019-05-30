const utils = require('simplechainjs-util')
const BN = utils.BN
const error = require('../exceptions.js').ERROR
const assert = require('assert')

module.exports = function (opts) {
  assert(opts.data)

  var results = {}

  // results.gasUsed = new BN(opts._common.param('gasPrices', 'ecdh25519computesecret'))
  results.gasUsed = new BN(1000)

  if (opts.gasLimit.lt(results.gasUsed)) {
    results.return = Buffer.alloc(0)
    results.gasUsed = opts.gasLimit
    results.exceptionError = error.OUT_OF_GAS
    results.exception = 0 // 0 means VM fail (in this case because of OOG)
    return results
  }

  var data = opts.data

  results.return = utils.x25519pub(data)
  results.exception = 1

  return results
}