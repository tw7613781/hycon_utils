'use strict';

const sqlite3 = require('sqlite3').verbose();
const log4js = require('./logger');

const logger = log4js.getLogger('txTable')

class TxTable {
    constructor(tableName) {
        this.db = new sqlite3.Database('./data/data.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE), (e) => {
            if (e) {
                logger.error(`init database error: ${e}`);
            }
            logger.info('connected to the data db');
        }

        this.table = tableName

        const tableSchema = `CREATE TABLE IF NOT EXISTS ${this.table} (
            hash text NOT NULL PRIMARY KEY,
            amount text,
            toAddress text,
            signature text,
            estimated text,
            receiveTime text,
            fee text,
            fromAddress text,
            nonce text
        )`

        this.db.exec(tableSchema, (e) => {
            if (e) {
                logger.error(`init table ${this.table} error: ${e}`);
            }
            logger.info(`went to table ${this.table}`);
        });
    }

    insert(tx) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT OR REPLACE INTO ${this.table} (
                hash, amount, toAddress, signature, estimated, receiveTime,
                fee, fromAddress, nonce) VALUES (?,?,?,?,?,?,?,?,?);`
            const params = [tx.hash, tx.amount, tx.to,
                tx.signature, tx.estimated, tx.receiveTime,
                tx.fee, tx.from, tx.nonce];
            this.db.run(sql, params, (e)=> {
                if (e) {
                    logger.error(`insert table ${this.table} error`);
                    reject(e);
                }
                logger.info(`${tx.hash}-${tx.amount} saved`)
                resolve();
            });
        })
    }

    closeDB () {
        return new Promise((resolve, reject) => {
            this.db.close((e) => {
                logger.error(`close db error: ${e}`);
                reject(e);
            })
            resolve();
        })
    }
}

module.exports = TxTable