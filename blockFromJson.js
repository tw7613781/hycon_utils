const fs = require('fs');
const log4js = require('./utils');
const SQLiteDB = require('./sqliteDB')

const logger = log4js.getLogger('blockFromJson')

async function getBlockFromJson(baseHeight, path, tableName) {
    const db = new SQLiteDB(tableName);
    const files = fs.readdirSync(path);
    for (let i = 0; i<files.length; i++){
        const filename = files[i].split('.')[0];
        const extension = files[i].split('.')[1];
        if (extension === 'json') {
            const height = filename.split('_')[0];  
            logger.info(`read block ${height}`);        
            if (Number(height) < baseHeight) {
                const fullFile = path + files[i];
                const data = fs.readFileSync(fullFile, 'utf8');
                const block = JSON.parse(data);
                await db.insert(block);
            }
        }
    }
}

module.exports = getBlockFromJson
