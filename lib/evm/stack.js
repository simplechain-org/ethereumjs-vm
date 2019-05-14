const BN = require('bn.js')
const ethUtil = require('simplechainjs-util')
const { ERROR, VmError } = require('../exceptions')

/**
 * Implementation of the stack used in evm.
 */
module.exports = class Stack {
  constructor () {
    this._store = []
  }

  get length () {
    return this._store.length
  }

  push (value) {
    if (this._store.length > 1023) {
      throw new VmError(ERROR.STACK_OVERFLOW)
    }

    if (!this._isValidValue(value)) {
      throw new VmError(ERROR.OUT_OF_RANGE)
    }

    this._store.push(value)
  }

  pop () {
    if (this._store.length < 1) {
      throw new VmError(ERROR.STACK_UNDERFLOW)
    }

    return this._store.pop()
  }

  /**
   * Pop multiple items from stack. Top of stack is first item
   * in returned array.
   * @param {Number} num - Number of items to pop
   * @returns {Array}
   */
  popN (num = 1) {
    if (this._store.length < num) {
      throw new VmError(ERROR.STACK_UNDERFLOW)
    }

    if (num === 0) {
      return []
    }

    return this._store.splice(-1 * num).reverse()
  }

  /**
   * Swap top of stack with an item in the stack.
   * @param {Number} position - Index of item from top of the stack (0-indexed)
   */
  swap (position) {
    if (this._store.length <= position) {
      throw new VmError(ERROR.STACK_UNDERFLOW)
    }

    const head = this._store.length - 1
    const i = this._store.length - position - 1

    const tmp = this._store[head]
    this._store[head] = this._store[i]
    this._store[i] = tmp
  }

  /**
   * Pushes a copy of an item in the stack.
   * @param {Number} position - Index of item to be copied (1-indexed)
   */
  dup (position) {
    if (this._store.length < position) {
      throw new VmError(ERROR.STACK_UNDERFLOW)
    }

    const i = this._store.length - position
    this.push(this._store[i])
  }

  _isValidValue (value) {
    if (BN.isBN(value)) {
      if (value.lte(ethUtil.MAX_INTEGER)) {
        return true
      }
    } else if (Buffer.isBuffer(value)) {
      if (value.length <= 32) {
        return true
      }
    }

    return false
  }
}
