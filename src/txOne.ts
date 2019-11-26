import { getAddress, getBlock, getTx, log4js, sendingTx } from './utils'

const logger = log4js.getLogger(__filename)
const txHash = '757BGW2xWWcuMQPuGGSwTr82RdWY6Y5vuVkpzj9ZHGK3'

async function main() {
    // const addrInfo = await getAddress('H2zF9ZrneniGejpGSs7dpafiU7vJACFTW')
    // logger.info(addrInfo)
    const txInfo = await getTx(txHash)
    const blockHash = txInfo.blockHash
    // logger.info(txInfo)
    const blockInfo = await getBlock(blockHash)
    // logger.info(blockInfo)
    for (const tx of blockInfo.txs) {
        if (tx.from === txInfo.from && tx.nonce === 3239) {
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
