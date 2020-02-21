import * as util from '@glosfer/hyconjs-util'
import { expect } from 'chai'
import 'mocha'

// test hyconjs util all functions

describe('hycon util functions test', () => {

    const input = 'test black2b hash function'
    const inputBuf = Buffer.from(input)
    let output

    it('blake2bHash test with string input', () => {
        output = 'b0f260dae1f5a49fdf7e5236b972d63d1e71525cac478bfb92261dcce722efb2'
        const hash = util.blake2bHash(input)
        expect(hash.length).to.equal(32)
        expect(Buffer.from(hash).toString('hex')).to.equal(output)
    })

    it('blake2bHash test with uint8 array input', () => {
        output = 'b0f260dae1f5a49fdf7e5236b972d63d1e71525cac478bfb92261dcce722efb2'
        const hash = util.blake2bHash(inputBuf)
        expect(hash.length).to.equal(32)
        expect(Buffer.from(hash).toString('hex')).to.equal(output)
    })

    it('publicKeyToAddress test', () => {
        output = 'b972d63d1e71525cac478bfb92261dcce722efb2'
        const res = util.publicKeyToAddress(inputBuf)
        expect(Buffer.from(res).toString('hex')).to.equal(output)
    })

    it('addressCheckSum test', () => {
        output = 'Cuj7'
        const res = util.addressCheckSum(inputBuf)
        expect(res).to.equal(output)
    })

    it('addressToString test', () => {
        output = 'H4ZisVWsFYsBsXcgq8XYBLyvNFuarDEjqKuHoCuj7'
        const res = util.addressToString(inputBuf)
        expect(res).to.equal(output)
    })
})
