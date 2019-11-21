import { getAddress, getBlock, getTx, log4js, sendingTx } from './utils'

const logger = log4js.getLogger(__filename)
const txHash = 'CcfWaVHWFoYTdZPjcJYaDHNCwRwFpwiHK7E6RDc4pbmH'

async function main() {
    const txInfo = await getTx(txHash)
    const blockHash = txInfo.blockHash
    // logger.info(txInfo)
    const blockInfo = await getBlock(blockHash)
    // logger.info(blockInfo)
    for (const tx of blockInfo.txs) {
        if (tx.from === txInfo.from && tx.nonce === 3235) {
            logger.info(tx)
            logger.info('============>')
            logger.info('===========Sending')
            await sendingTx(tx)
        }
    }
}

main().catch( (err) => {
    logger.error(err)
})
