const TxTable = require('../libs/txTable')
const log4js = require('../libs/logger')
const fs = require('fs')

const logger = log4js.getLogger('lostAddressList')

const table_lost = new TxTable('lost_tx'); 

async function lostAddressList(){
    const Txs = await table_lost.findAllTx();
    let Addrs = new Map();
    let count = 0;
    for (let i=0; i<Txs.length; i++){
        const tx = Txs[i];
        let amount = Number(tx.amount)
        if (amount > 1) {
            count += 1
            logger.info(tx)
            const fromAddr = tx.fromAddress;
            const toAddr = tx.toAddress;
            if ( !Addrs.has(fromAddr) ) {
                Addrs.set(fromAddr, -amount)
            } else {
                const temp = Addrs.get(fromAddr)
                Addrs.set(fromAddr, temp - amount)
            }
            if ( !Addrs.has(toAddr) ) {
                Addrs.set(toAddr, amount)
            } else {
                const temp = Addrs.get(toAddr)
                Addrs.set(toAddr, temp + amount)
            }
        }
    }
    logger.info(`Number of Tx that it's amount > 1 is: ${count}`)
    logger.info('Original Map object is:');
    logger.info(Addrs)
    const AddrsSort = new Map([...Addrs.entries()].sort((a, b) => b[1] - a[1]));
    logger.info('Sorted Map object')
    logger.info(AddrsSort)
    const file = JSON.stringify(mapToObj(AddrsSort))
    logger.info(file)
    fs.writeFileSync('data/lostAddressList.json', file)
}

function mapToObj(inputMap) {
    let obj = {};
    inputMap.forEach( (value, key) => {
        obj[key] = value
    });
    return obj;
}

lostAddressList()


