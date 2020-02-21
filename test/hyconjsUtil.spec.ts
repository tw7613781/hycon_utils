import * as util from '@glosfer/hyconjs-util'
import { expect } from 'chai'
import 'mocha'

// test hyconjs util all functions

describe('test black2bHash', () => {
    it('input a arbitray string should return a 32 Byte uint8 array as hash result', () => {
        const input = 'test black2b hash function'
        const output = 'b0f260dae1f5a49fdf7e5236b972d63d1e71525cac478bfb92261dcce722efb2'
        const hash = util.blake2bHash(input)
        expect(hash.length).to.equal(32)
        expect(Buffer.from(hash).toString('hex')).to.equal(output)
    })

    it('input a arbitray uint8 array should return a 32 Byte uint8 array as hash result', () => {
        const input = 'test black2b hash function'
        const inputBuffer = Buffer.from(input)
        const output = 'b0f260dae1f5a49fdf7e5236b972d63d1e71525cac478bfb92261dcce722efb2'
        const hash = util.blake2bHash(inputBuffer)
        expect(hash.length).to.equal(32)
        expect(Buffer.from(hash).toString('hex')).to.equal(output)
    })
})
