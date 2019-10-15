'use strict';

const https = require('https');
const http = require('http')
const fs = require('fs');
const log4js = require('./utils')

const logger = log4js.getLogger('blockCrawler')

class BlockCrawler {
    constructor(tip, number, url, saveFolder) {
        this.tip = tip;
        this.number = number;
        this.count = 0
        this.url = url;
        this.saveFolder = saveFolder;
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
                    try {
                        const block = JSON.parse(body);
                        this.writeToFile(block)
                        this.count += 1
                        if (this.count === this.number) return;
                        else {
                            const prevBlock = block.prevBlock.split(',')[0];
                            setTimeout(()=>{
                                this.getBlock(prevBlock)
                            }, 100)
                        }
                    } catch(e){
                        logger.error(e)
                        throw e
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

    writeToFile(block) {
        const blockHash = block.hash;
        const blockHeight = block.height;
        const title = blockHeight + '_' + blockHash;
        const data = JSON.stringify(block)
        fs.writeFile(`${this.saveFolder}/${title}.json`, data, (e)=>{
            if (e) throw e;
            logger.info(`${title} has been saved`)
        })
    }
}

module.exports = BlockCrawler