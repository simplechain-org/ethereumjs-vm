/*
 * Example - Running code on an ethereum-vm
 *
 *
 * To run this example in the browser, bundle this file
 * with browserify using `browserify index.js -o bundle.js`
 * and then load this folder onto a HTTP WebServer (e.g.
 * using node-static or `python -mSimpleHTTPServer`).
 */
var Buffer = require('safe-buffer').Buffer // use for Node.js <4.5.0
var VM = require('../../index.js')

// create a new VM instance
var vm = new VM()

var code = '60806040527fe86551f9a0bd3c29cd53575a36036341435d40f86cda6ba27ddfee968a0c615460001b6000557f29de8cf231dd9c0a90b516edf7305eb60de21887968dae6c4c8f1edf9d4cff4060001b60015534801561005e57600080fd5b5061013e8061006e6000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80630a63361c146100465780636b59084d14610064578063d56f211814610082575b600080fd5b61004e6100a0565b6040518082815260200191505060405180910390f35b61006c6100a6565b6040518082815260200191505060405180910390f35b61008a61010c565b6040518082815260200191505060405180910390f35b60005481565b600060096000546001546040518083815260200182815260200192505050602060405180830381855afa1580156100e1573d6000803e3d6000fd5b5050506040513d60208110156100f657600080fd5b8101908080519060200190929190505050905090565b6001548156fea165627a7a72305820863cc07f1f675cbfbd1ab9ac96b21f2c7ae2b063f865fe47faae4b5f61cb4e650029'

vm.on('step', function (data) {
  console.log(data.opcode.name)
})

vm.runCode({
  code: Buffer.from(code, 'hex'),
  gasLimit: Buffer.from('ffffffff', 'hex')
}, function (err, results) {
  console.log('returned: ' + results.return.toString('hex'))
  console.log('gasUsed: ' + results.gasUsed.toString())
  console.log(err)
})
