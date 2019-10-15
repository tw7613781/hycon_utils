'use strict';

const https = require('https');
const http = require('http')
const SQLiteDB = require('./sqliteDB')
const log4js = require('./utils')

const logger = log4js.getLogger('blockCrawler')

class BlockCrawler {
    constructor(tip, number, url, tableName) {
        this.tip = tip;
        this.number = number;
        this.count = 0
        this.url = url;
        this.db = new SQLiteDB(tableName);
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

module.exports = BlockCrawler