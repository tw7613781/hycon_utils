const https = require('https')
const http = require('http')
const sleep = require('sleep')
const log4js = require('../libs/logger')
const TxTable = require('../libs/txTable')

const logger = log4js.getLogger('sendTx')

function getTx(hash) {
    return new Promise((resolve, reject)=>{
        const reqURL = `https://api.hycon.io/api/v2/tx/${hash}`;
        try {
            const req = https.get(reqURL, (res)=>{
                let body = '';
        
                res.on('data', (chunk)=>{
                    body += chunk
                })
        
                res.on('end', ()=>{
                    const tx = JSON.parse(body);
                    resolve(tx);
                })
            });
            req.on('error', (e)=>{
                logger.error(e);
                reject(e);
            });
        } catch (e) {
            logger.error(e);
            reject(e);
        }
    })
}

function getBlock(hash) {
    return new Promise((resolve, reject)=>{
        const reqURL = `https://api.hycon.io/api/v2/block/${hash}`;
        try {
            const req = https.get(reqURL, (res)=>{
                let body = '';
        
                res.on('data', (chunk)=>{
                    body += chunk
                })
        
                res.on('end', ()=>{
                    const block = JSON.parse(body);
                    resolve(block);
                })
            });
            req.on('error', (e)=>{
                logger.error(e);
                reject(e);
            });
        } catch (e) {
            logger.error(e);
            reject(e);
        }
    })
}

function sendTx(tx){
    return new Promise((resolve, reject)=>{
        const reqURL = 'http://network.hycon.io/api/v1/tx'
        const options = {
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: tx,
            method: 'POST'
        }
        try {
            const req = http.request(reqURL, options, (res)=>{
                let body = '';
        
                res.on('data', (chunk)=>{
                    body += chunk
                })
        
                res.on('end', ()=>{
                    const ret = JSON.parse(body);
                    resolve(ret);
                })
            });
            req.on('error', (e)=>{
                logger.error(e);
                reject(e);
            });      
        } catch (e) {
            logger.error(e);
            reject(e);
        }
    })
}

async function main(){
    const txTable = new TxTable('lost_tx');
    const missedTx = await txTable.selectLargeTx(1);
    for(let i =0; i<missedTx.length; i++) {
        const tx = missedTx[i];
        logger.info('====tx in DB====')
        logger.info(tx);
        const ret = await getTx(tx.hash);
        logger.info('====tx in API====')
        logger.info(ret);
        if (ret.error) {
            logger.error(`getting tx error: ${ret.error}`)
            return
        } else {
            logger.info(`Found a TX for ${tx.hash}`);
            const newTx = ret;
            const newBlock = await getBlock(newTx.blockhash)
            if (newBlock.error) {
                logger.error('Not found block')
                logger.info('Start to sending the Tx')
                const x = {
                        'from': tx.fromAddress,
                        'to': tx.toAddress,
                        'amount': tx.amount,
                        'fee': tx.fee,
                        'signature': tx.signature,
                        'recovery': 0,
                        'nonce': tx.nonce
                    };
                const ret = await sendTx(x);
                if (ret.txhash) {
                    logger.warn(`Tx sent with hash: ${ret.txHash}`);
                    sleep.sleep(15);
                } else {
                    logger.error(`sending t error: ${ret}`);
                    return;
                }
            } else {
                logger.info('Found the block');
                logger.info(newBlock);
            }
        }
    }
}

main().catch((err)=>{
    logger.error(err)
})
