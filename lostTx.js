const SQLiteDB = require('./sqliteDB')
const TxTable = require('./txTable')
const log4js = require('./utils')

const logger = log4js.getLogger('lostTx')

async function lostTx(){
    // const height = 1579813;
    const height = 1579813;
    const db = new SQLiteDB('old_block');
    const table = new TxTable('lost_tx');

    const rets = await db.findTxHigher(height);
    for(let i=0; i<rets.length; i++){
        let txs = rets[i].txs;
        txs = JSON.parse(txs)
        for (let j=0; j<txs.length; j++){
            await table.insert(txs[j]); 
        }
    }
}

lostTx()
