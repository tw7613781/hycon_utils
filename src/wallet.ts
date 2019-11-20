import * as util from '@glosfer/hyconjs-util'
import { log4js } from './utils'

const request = require('request')
const config = require('../config')

const logger = log4js.getLogger(__filename)
const mnemonic = config.mnemonic
const password = ''
const host = 'https://network.hycon.io/api/v3'

interface IAddrInfo {
    balance: string
    nonce: number
    address: string
}

interface ITxRet {
    txhash: string
}

function getAddressInfo(address):Promise<IAddrInfo> {
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

function outgoingTx(tx): Promise<ITxRet> {
    return new Promise( (resolve, reject) => {
        const endpoint = `/tx`
        const url = host + endpoint
        const options = {
            body: JSON.stringify(tx),
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            method: 'POST',
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

async function main() {
    try {
        const wallet = util.createWallet(mnemonic, password)
        logger.debug('My Hycon address and private key')
        logger.debug(wallet.address, wallet.privateKey)
        logger.debug('--------------------------------')
        const info: IAddrInfo = await getAddressInfo(wallet.address)
        logger.debug(info)
        const nonce = info.nonce + 1
        const toAddr = 'H3ADKxdfQgHhiowuEyj2NkJF86XqT9vx3'
        const amount = '10'
        const fee = '0.000000001'
        const { signature, recovery} = util.signTx(wallet.address, toAddr, amount, fee, nonce, wallet.privateKey)
        logger.debug('-------------------------------')
        logger.debug('sign the tx with private key')
        logger.debug(signature, recovery)
        const signedTx = {
            amount,
            fee,
            from: wallet.address,
            nonce,
            recovery,
            signature,
            to: toAddr,

        }
        logger.debug(signedTx)
        logger.debug('Ready, sending....')
        const ret = await outgoingTx(signedTx)
        logger.debug('Result ==>')
        logger.debug(ret)
        if (!('txhash' in ret) || (typeof ret.txhash) !== 'string') {
            return console.error('Fail to transfer hycon.')
        } else {
            return logger.debug(`Sent successful: ${ret.txhash}`)
        }
    } catch (e) {
        logger.error(e)
    }
}

main().catch((e) => {
    logger.error(e)
})
