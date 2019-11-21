import { getAddress, getBlock, getTx, log4js, sendingTx } from './utils'

const logger = log4js.getLogger(__filename)

const txs = [
    'EpiwfUbhRQqzFqBg2HxpEmtn52FgbeaJtnnxHQeuzheN',
    '67F3acJNNatdauTDyVS1wzfDZAgLMGpik1RQcg4uEvPa',
    'A7JQyTunSanxHspYDQ5gfYR9XPLr48985zpwNY5CaFEV',
    '7N2TWGboysYCH4HW3EuGGbAeqkK2zq3SZPoXovNk5JiZ',
    '4jE9WmHb9BnZFQhSW6Q8Csa51hnYDYzH7grX1SdZNNqU',
    'FPy63yz1rhzJT37DD2WxLDqBiFLQmGqYe8a7TN6SW58f',
    'CH2ia44VvwSLyLB11Aj8mjZBobygzMPUPWv3ijM8PrRx',
]

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
