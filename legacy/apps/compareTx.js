const TxTable = require('../libs/txTable')
const log4js = require('../libs/logger')

const logger = log4js.getLogger('compareTx')

const table_old = new TxTable('old_tx');
const table_new = new TxTable('new_tx');
const table_both = new TxTable('both_tx'); 
const table_lost = new TxTable('lost_tx'); 

async function compareTx(){
    const oldTxs = await table_old.findAllTx();
    const numberAll = oldTxs.length;
    let numberInNew = 0;
    for (let i=0; i<oldTxs.length; i++){
        const hash = oldTxs[i].hash
        try {
            const tx = await table_new.findTxByHash(hash);
            numberInNew += 1;
            await table_both.insert(tx, true);
        } catch(e){
            if (e === `notFound error: ${hash}`) {
                logger.info(`${hash} not found`)
                await table_lost.insert(oldTxs[i], true);
                continue;
            }
            logger.error(e);
            return
        }
    }
    logger.info(`${numberInNew} / ${numberAll} = ${ numberInNew/numberAll }`);
}

compareTx()