const log4js = require('log4js')
const request = require('request')

log4js.configure({
    appenders: {
        console: {
            type: 'stdout',
        },
        file: {
            filename: `./logs/${new Date().getFullYear()}-${(new Date().getMonth()) + 1}-${new Date().getDate()}/logFile.log`,
            keepFileExt: true,
            maxLogSize: 16777216,
            pattern: '.yyyy-MM-dd',
            type: 'dateFile',
        },
    },
    categories: {
        default: { appenders: ['console', 'file'], level: 'debug' },
    },
})

export { log4js }

const logger = log4js.getLogger(__filename)

const host = 'http://network.hycon.io/api/v1'

const hostVer3 = 'http://18.163.121.239:2442/api/v3'

export interface TX {
    hash: string
    amount: string
    fee: string
    from: string
    to: string
    blockHash: string
    estimated: string
    receiveTime: string
    nonce: number
    confirmation: number,
}

export interface SignedTX {
    hash: string,
    amount: string,
    to: string,
    signature: string,
    estimated: string,
    receiveTime: number,
    fee: string,
    from: string,
    nonce: number
}

export interface ADDRESS {
    balance: string
    nonce: number
    txs: [TX]
    pendings: [TX]
    minedBlocks: [BLOCK],
    pendingAmount: string
}

export interface BLOCK {
    hash: string
    amount: string
    difficulty: string
    fee: string
    length: number
    volume: string
    stateRoot: string
    merkleRoot: string
    txs: [SignedTX]
    height: number
    timeStamp: number
    privBlock: string
    nonce: string
    miner: string
    resultHash: string
}

export interface ITxRet {
    txhash: string
}

export function getTx(hash: string): Promise<TX> {
    return new Promise( (resolve, reject) => {
        const endpoint = `/tx/${hash}`
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

export function getBlock(hash: string): Promise<BLOCK> {
    return new Promise( (resolve, reject) => {
        const endpoint = `/block/${hash}`
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

export function getAddress(address: string): Promise<ADDRESS> {
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

export function outgoingTx(tx): Promise<ITxRet> {
    return new Promise( (resolve, reject) => {
        const endpoint = `/tx`
        const url = hostVer3 + endpoint
        const options = {
            body: JSON.stringify(tx),
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
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

export async function sendingTx(tx1) {
    const signedTx = {
        amount: tx1.amount,
        fee: tx1.fee,
        from: tx1.from,
        nonce: tx1.nonce,
        recovery: 0,
        signature: tx1.signature,
        to: tx1.to,
    }
    logger.info(signedTx)
    const ret = await outgoingTx(signedTx)
    logger.debug('Result ==>')
    logger.debug(ret)
    if (!('txhash' in ret) || (typeof ret.txhash) !== 'string') {
        signedTx.recovery = 1
        logger.info(signedTx)
        const ret1 = await outgoingTx(signedTx)
        logger.debug(ret1)
        if (!('txhash' in ret1) || (typeof ret1.txhash) !== 'string') {
            console.error('Fail to transfer hycon.')
        } else {
            logger.debug(`Sent successful: ${ret1.txhash}`)
        }
    } else {
        logger.debug(`Sent successful: ${ret.txhash}`)
    }
}
