import * as util from '@glosfer/hyconjs-util'

const input = 'test black2b hash function'
const inputBuf = Buffer.from(input)

console.log('====================')
console.log('blake2bHash')
const hash = util.blake2bHash(input)
console.log(hash.length)
console.log(Buffer.from(hash).toString('hex'))

console.log('====================')
console.log('publicKeyToAddress')
const address = util.publicKeyToAddress(hash)
console.log(Buffer.from(address).toString('hex'))

console.log('====================')
console.log('addressCheckSum')
const addrCheck = util.addressCheckSum(address)
console.log(addrCheck)

console.log('====================')
console.log('addressToString')
const addrHycon = util.addressToString(address)
console.log(addrHycon)

console.log('====================')
console.log('addressToUint8Array')
const addr = 'HsskvzK6pzYiYnMoJkNhPGjc8fP92LmU'
const addrBack = util.addressToUint8Array(addr)
console.log(addrBack)
