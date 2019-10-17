'use strict';

const https = require('https');
const http = require('http')
const BlockTable = require('./blockTable')
const TxTable = require('./txTable')
const log4js = require('./logger')

const logger = log4js.getLogger('utils')

async function extractTxFromBlock(height, blockTableName, txTableName){
    // const height = 1579813;
    const blockTable = new BlockTable(blockTableName);
    const txTable = new TxTable(txTableName);
    const rets = await blockTable.findTxHigher(height);
    for(let i=0; i<rets.length; i++){
        let txs = rets[i].txs;
        txs = JSON.parse(txs)
        for (let j=0; j<txs.length; j++){
            await txTable.insert(txs[j]); 
        }
    }
}

async function getBlockFromJson(baseHeight, jsonFilePath, blockTableName) {
    const blockTable = new BlockTable(blockTableName);
    const files = fs.readdirSync(jsonFilePath);
    for (let i = 0; i<files.length; i++){
        const [ filename, extension ] = files[i].split('.')
        if (extension === 'json') {
            const height = filename.split('_')[0];  
            logger.info(`read block ${height}`);        
            if (Number(height) < baseHeight) {
                const fullFile = jsonFilePath + files[i];
                const data = fs.readFileSync(fullFile, 'utf8');
                const block = JSON.parse(data);
                await blockTable.insert(block);
            }
        }
    }
}

class GetBlockFromAPI {
    constructor(tip, number, url, tableName) {
        this.tip = tip;
        this.number = number;
        this.count = 0
        this.url = url;
        this.db = new BlockTable(tableName);
        setTimeout(() => {
            this.getBlock(this.tip);
        }, 100);
    }

    getBlock(hash) {
        const reqURL = this.url + hash;
        const service = reqURL.indexOf('https') === 0 ? https : http;
        try {
            const req = service.get(reqURL, (res)=>{
                let body = '';
        
                res.on('data', (chunk)=>{
                    body += chunk
                })
        
                res.on('end', ()=>{
                    const block = JSON.parse(body);
                    this.db.insert(block).catch((e)=>{
                        logger.error(e);
                        throw e;
                    })
                    this.count += 1
                    if (this.count === this.number) return;
                    else {
                        const prevBlock = block.prevBlock.split(',')[0];
                        setTimeout(()=>{
                            this.getBlock(prevBlock)
                        }, 100)
                    }
                })
            })

            req.on('error', (e)=>{
                logger.error(e)
                setTimeout(()=>{
                    this.getBlock(hash)
                }, 100)
            })
        
        } catch (e) {
            logger.error(e)
            throw e
        }
    }
}

module.exports = { 
    extractTxFromBlock,
    getBlockFromJson,
    GetBlockFromAPI 
}