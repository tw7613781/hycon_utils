import { log4js } from '../src/utils'
const logger = log4js.getLogger(__filename)

const TXs = [1, 2, 'adgd', 'de', 'hycon', 34]

let index = 0
TXs.forEach( (tx) => {
    index ++
    logger.info(`${index}: ${tx}`)
})
