import * as util from '@glosfer/hyconjs-util'

const input = 'test black2b hash function'
const output = util.blake2bHash(input)
console.log(output.length)
console.log(Buffer.from(output).toString('hex'))
