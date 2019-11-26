import { getAddress, getBlock, getTx, log4js, sendingTx } from './utils'

const logger = log4js.getLogger(__filename)
const address = 'H2zF9ZrneniGejpGSs7dpafiU7vJACFTW'

async function main() {
    const addrInfo = await getAddress(address)
    logger.info(addrInfo)
    for (const tx of addrInfo.pendings) {
        logger.info(tx)
        logger.info('============>')
        logger.info('===========Sending')
        await new Promise((resolve, reject) => {
            setTimeout( async () => {
                await sendingTx(tx)
                resolve()
            }, 1000 * 10)
        })
    }
}

main().catch( (err) => {
    logger.error(err)
})
