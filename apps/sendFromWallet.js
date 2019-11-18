const bip39 = require('bip39')
const HDKey = require("hdkey")
const blake2b = require("blake2b")
const Base58 = require("base-58")
const secp256k1 = require("secp256k1")
const request = require("request")
const proto = require("./proto")
const config = require("../config")

const mnemonic = config.mnemonic
const password = ''

const host = 'https://network.hycon.io/api/v3'

function checkSum(arr) {
    // Consensus Critical
    const hash = blake2b(32).update(arr).digest()
    let str = Base58.encode(hash)
    str = str.slice(0, 4)
    return str
}

function walletFromMnemonic(mnemonic, password) {
    const seed = bip39.mnemonicToSeed(mnemonic, password)
    const masterKey = HDKey.fromMasterSeed(seed)
    const hdkey = HDKey.fromExtendedKey(masterKey.privateExtendedKey)
    const wallet = hdkey.derive(`m/44'/1397'/0'/0/0`)
    return { publicKey: wallet.publicKey, privateKey: wallet.privateKey }
}

function addressFromPubkey(pubkey) {
    const pubHash = blake2b(32).update(pubkey).digest()
    const add = new Uint8Array(20)
    for (let i = 12; i < 32; i++) {
        add[i - 12] = pubHash[i]
    }
    return "H" + Base58.encode(add) + checkSum(add)
}

function getAddressInfo(address) {
    return new Promise( (resolve, reject) => {
        const endpoint = `/address/${address}`
        const url = host + endpoint
        request(url, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(JSON.parse(body))
            }
        })
    })
}

function outgoingTx(tx) {
    return new Promise( (resolve, reject) => {
        const endpoint = `/tx`
        const url = host + endpoint
        const options = {
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            method: "POST",
            body: JSON.stringify(tx),
            url,
        }
        request(options, (err, res, body) => {
            if (err) {
                reject(err)
            } else {
                resolve(JSON.parse(body))
            }
        })
    })
}

async function main(toAddr, amount, fee) {
    const { publicKey, privateKey} = walletFromMnemonic(mnemonic, password)
    const addr = addressFromPubkey(publicKey)
    console.log(`sending tx from ${addr} to ${toAddr} amount: ${amount.toString()} with fee ${fee.toString()}`)
    const addrInfo = await getAddressInfo(addr)
    const balance = Number(addrInfo.balance)
    if (balance < amount) {
        return console.error('balance insufficient')
    }
    const nonce = Number(addrInfo.nonce) + 1
    const tx = {
        from: addr,
        to: toAddr,
        amount,
        fee,
        nonce,
        networkid: "hycon",
    }
    const protoTx = proto.Tx.encode(tx).finish()
    const txHash = blake2b(32).update(protoTx).digest()
    const signature = secp256k1.sign(txHash, privateKey)
    const signedTx = Object.assign({ 
        signature: signature.signature.toString("hex"),
        recovery: signature.recovery,
    }, tx)
    console.log('Ready, sending....')
    console.log(signedTx)
    const ret = await outgoingTx(signedTx)
    console.log('Result ==>')
    console.log(ret)
    if (!("txHash" in ret) || (typeof ret.txHash) !== "string") {
        return console.error("Fail to transfer hycon.")
    } else {
        return console.log(`Sent successful: ${ret.txHash}`)
    }
}

main('H3ADKxdfQgHhiowuEyj2NkJF86XqT9vx3', 1, 0.1).catch((e) => {
    console.error(e)
})