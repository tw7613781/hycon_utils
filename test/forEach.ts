import { log4js } from '../src/utils'
const logger = log4js.getLogger(__filename)

const tx1 = {
    id: 'afdsf',
    name: 'adfdf',
    length: 4
}

const tx2 = {
    id: 'dsfafdsf',
    name: 'adfdfdf',
    length: 2
}

const mapTx = new Map([[1, tx1], [2, tx2]])
let index = 0
mapTx.forEach( (tx) => {
    index ++
    logger.info(`${index}: ${tx.length}`)
})
