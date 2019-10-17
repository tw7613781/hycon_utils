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

    insert(tx, fromDB) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT OR REPLACE INTO ${this.table} (
                hash, amount, toAddress, signature, estimated, receiveTime,
                fee, fromAddress, nonce) VALUES (?,?,?,?,?,?,?,?,?);`
            let toAddress, fromAddress;
            if (fromDB) {
                toAddress = tx.toAddress;
                fromAddress = tx.fromAddress;
            } else {
                toAddress = tx.to;
                fromAddress = tx.from;
            }
            const params = [tx.hash, tx.amount, toAddress,
                tx.signature, tx.estimated, tx.receiveTime,
                tx.fee, fromAddress, tx.nonce];
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

    findAllTx() {
        return new Promise((resolve, reject)=>{
            const sql = `SELECT hash, amount, toAddress, signature, estimated, receiveTime,
            fee, fromAddress, nonce FROM ${this.table}`;
            this.db.all(sql, (e, rows)=>{
                if (e) {
                    reject(e)
                }
                resolve(rows)
            })
        })
    }

    findTxByHash(hash) {
        return new Promise((resolve, reject)=>{
            const sql = `SELECT hash, amount, toAddress, signature, estimated, receiveTime,
            fee, fromAddress, nonce FROM ${this.table} WHERE hash = $hash`;
            const params = {
                $hash: hash
            }
            this.db.all(sql, params, (e, rows)=>{
                if (e) {
                    reject(e)
                }
                if (rows.length == 0) reject(`notFound error: ${hash}`)
                resolve(rows[0])
            })
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