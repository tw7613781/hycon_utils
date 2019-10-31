const https = require('https')
const log4js = require('../libs/logger')
const TxTable = require('../libs/txTable')

const logger = log4js.getLogger('sendTx')

const tx = {
    "from": "H3kdtJzMVVez6shzXWbnKtaduQ6kpGDUk",
    "to": "H3vGjZXyoZQD85t9Ho6PeiV29j7oq9hE9",
    "amount": "0.000000002",
    "fee": "0.000000001"
}

function getNonce(addr) {
    return new Promise((resolve, reject)=>{
        const reqURL = `https://api.hycon.io/api/v2/address/${addr}`;
        try {
            const req = https.get(reqURL, (res)=>{
                let body = '';
        
                res.on('data', (chunk)=>{
                    body += chunk
                })
        
                res.on('end', ()=>{
                    const addr = JSON.parse(body);
                    const nonce = addr.nonce;
                    resolve(nonce);
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
    for (let i = 0; i<missedTx.length; i++) {
        logger.info('---------------------------')
        const tx = missedTx[i];
        logger.info(`Tx Hash: ${tx.hash}`)
        if (i ==0 || tx.fromAddress != missedTx[i-1].fromAddress) {
            const currentNonce = await getNonce(tx.fromAddress);
            logger.info(`===> from address: ${tx.fromAddress}`);
            logger.error(`===> currentNonce: ${currentNonce}`);
        }
        logger.info(`===> txNonce: ${tx.nonce}`);
    }
}

main().catch((err)=>{
    logger.error(err)
})
