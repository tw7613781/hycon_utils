import { log4js } from './utils'
const request = require('request')
const logger = log4js.getLogger(__filename)
const host = 'http://network.hycon.io/api/v1'

const hostVer3 = 'http://54.213.228.14:2442/api/v3'

const txs = [
    'EpiwfUbhRQqzFqBg2HxpEmtn52FgbeaJtnnxHQeuzheN',
    '67F3acJNNatdauTDyVS1wzfDZAgLMGpik1RQcg4uEvPa',
    'A7JQyTunSanxHspYDQ5gfYR9XPLr48985zpwNY5CaFEV',
    '7N2TWGboysYCH4HW3EuGGbAeqkK2zq3SZPoXovNk5JiZ',
    '4jE9WmHb9BnZFQhSW6Q8Csa51hnYDYzH7grX1SdZNNqU',
    'FPy63yz1rhzJT37DD2WxLDqBiFLQmGqYe8a7TN6SW58f',
    'CH2ia44VvwSLyLB11Aj8mjZBobygzMPUPWv3ijM8PrRx',
]

interface TX {
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

interface SignedTX {
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

interface ADDRESS {
    balance: string
    nonce: number
    txs: [TX]
    pendings: [TX]
    minedBlocks: [BLOCK],
    pendingAmount: string
}

interface BLOCK {
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

interface ITxRet {
    txhash: string
}

function getTx(hash: string): Promise<TX> {
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

function getBlock(hash: string): Promise<BLOCK> {
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

function getAddress(address: string): Promise<ADDRESS> {
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

async function sendingTx(tx1) {
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

async function main() {
    for (const tx of txs) {
        logger.debug('-----------------')
        logger.info(tx)
        const txInfo = await getTx(tx)
        logger.info(`tx nonce is: ${txInfo.nonce}`)
        logger.info(`from address is: ${txInfo.from}`)
        const addrInfo = await getAddress(txInfo.from)
        logger.info(`address nonce is : ${addrInfo.nonce}`)
        const blockInfo = await getBlock(txInfo.blockHash)
        if (txInfo.nonce - addrInfo.nonce === 1) {
            for (const tx1 of blockInfo.txs) {
                if ( tx1.from === txInfo.from) {
                    await new Promise( (resolve, reject) => {
                        setTimeout(async () => {
                            await sendingTx(tx1)
                            resolve()
                        }, 1000 * 10)
                    })
                }
            }
        }
    }
}

main().catch((e) => {
    logger.error(e)
})
