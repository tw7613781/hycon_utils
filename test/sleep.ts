import { log4js } from '../src/utils'

const logger = log4js.getLogger(__filename)

async function main() {
    const txs = [1, 'car', 'apple', 4, 5]
    for (const tx of txs) {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                logger.info(tx)
                resolve()
            }, 1000 * 5)
        })
    }
}

main().catch((e) => {
    logger.error(e)
})
