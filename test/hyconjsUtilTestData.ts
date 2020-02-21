import * as util from '@glosfer/hyconjs-util'

const input = 'test black2b hash function'
const inputBuf = Buffer.from(input)
let output

console.log('====================')
console.log('blake2bHash')
output = util.blake2bHash(input)
console.log(output.length)
console.log(Buffer.from(output).toString('hex'))

console.log('====================')
console.log('publicKeyToAddress')
output = util.publicKeyToAddress(inputBuf)
console.log(Buffer.from(output).toString('hex'))

console.log('====================')
console.log('addressCheckSum')
output = util.addressCheckSum(inputBuf)
console.log(output)

console.log('====================')
console.log('addressToString')
output = util.addressToString(inputBuf)
console.log(output)
