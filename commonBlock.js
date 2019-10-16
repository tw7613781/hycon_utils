const SQLiteDB = require('./sqliteDB')
const log4js = require('./utils')

const logger = log4js.getLogger('commonBlock')

const table_old = new SQLiteDB('old_block');
const table_new = new SQLiteDB('new_block');
const height = 1579786 // the known common block, before fork

async function findCommonBlock() {
    for (let i =0; i < 100000; i++){
        const block_old = await table_old.findBlockByHeight(height + i);
        const block_new = await table_new.findBlockByHeight(height + i);
        if (block_old.hash != block_new.hash) {
            logger.fatal(`Found the block: ${height + i}`)
            return 
        }
        logger.info(`${height + i} has same block`)
    }
}

findCommonBlock();
