import * as util from '@glosfer/hyconjs-util'
import { expect } from 'chai'
import 'mocha'

// test hyconjs util all functions

describe('hycon util functions test', () => {

    const input = 'test black2b hash function'
    const inputBuf = Buffer.from(input)
    let output
    let hash
    let address
    let addrCheck
    let addrHycon
    let addrBack

    it('blake2bHash test with string input', () => {
        output = 'b0f260dae1f5a49fdf7e5236b972d63d1e71525cac478bfb92261dcce722efb2'
        hash = util.blake2bHash(input)
        expect(hash.length).to.equal(32)
        expect(Buffer.from(hash).toString('hex')).to.equal(output)
    })

    it('blake2bHash test with uint8 array input', () => {
        output = 'b0f260dae1f5a49fdf7e5236b972d63d1e71525cac478bfb92261dcce722efb2'
        hash = util.blake2bHash(inputBuf)
        expect(hash.length).to.equal(32)
        expect(Buffer.from(hash).toString('hex')).to.equal(output)
    })

    it('publicKeyToAddress test', () => {
        output = '3ef61acd9b8649563835252cb7068e34312ca7a4'
        address = util.publicKeyToAddress(hash)
        expect(Buffer.from(address).toString('hex')).to.equal(output)
    })

    it('addressCheckSum test', () => {
        output = '2LmU'
        addrCheck = util.addressCheckSum(address)
        expect(addrCheck).to.equal(output)
    })

    it('addressToString test', () => {
        output = 'HsskvzK6pzYiYnMoJkNhPGjc8fP92LmU'
        addrHycon = util.addressToString(address)
        expect(addrHycon).to.equal(output)
    })

    it('addressToUint8Array test', () => {
        output = Uint8Array.from([62,
            246,
            26,
            205,
            155,
            134,
            73,
            86,
            56,
            53,
            37,
            44,
            183,
            6,
            142,
            52,
            49,
            44,
            167,
            164])
        addrBack = util.addressToUint8Array(addrHycon)
        expect(addrBack).to.deep.equal(output)
    })

    it('addressToUint8Array test with incorrect checksum', () => {
        output = 'HsskvzK6pzYiYnMoJkNhPGjc8fP92LmA'
        expect(() => util.addressToUint8Array(output)).to.throw('Address hash invalid checksum \'2LmA\' expected \'2LmU\'')
    })

    it('addressToUint8Array test with incorrect starting alphabet', () => {
        output = 'AsskvzK6pzYiYnMoJkNhPGjc8fP92LmA'
        expect(() => util.addressToUint8Array(output)).to.throw('Address is invalid. Expected address to start with \'H\'')
    })

    it('addressToUint8Array test with incorrect length', () => {
        output = 'HsskvzK'
        expect(() => util.addressToUint8Array(output)).to.throw('Address must be 20 bytes long')
    })
})
