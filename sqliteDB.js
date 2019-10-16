'use strict';

const sqlite3 = require('sqlite3').verbose();
const log4js = require('./utils');

const logger = log4js.getLogger('sqliteDB')

class SQLiteDB {
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
            difficulty text,
            fee text,
            length text,
            volume text,
            stateRoot text,
            merkleRoot text,
            txs text,
            height text,
            timeStamp text,
            prevBlock text,
            nonce text,
            miner text,
            resultHash
        )`

        this.db.exec(tableSchema, (e) => {
            if (e) {
                logger.error(`init table error: ${e}`);
            }
            logger.info(`went to table ${this.table}`);
        });
    }

    insert(block) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT OR REPLACE INTO ${this.table} (
                hash, amount, difficulty, fee, length, volume,
                stateRoot, merkleRoot, txs, height, timeStamp,
                prevBlock, nonce, miner, resultHash
            ) VALUES ( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`
            const params = [block.hash, block.amount, block.difficulty,
                block.fee, block.length, block.volume,
                block.stateRoot, block.merkleRoot, JSON.stringify(block.txs),
                block.height, block.timeStamp, block.prevBlock,
                block.nonce, block.miner, block.resultHash];
            this.db.run(sql, params, (e)=> {
                if (e) {
                    logger.error(`insert table ${this.table} error`);
                    reject(e);
                }
                logger.info(`${block.height}-${block.hash} saved`)
                resolve();
            });
        })
    }

    findBlockByHeight(height) {
        return new Promise((resolve, reject)=>{
            const sql = `SELECT hash FROM ${this.table} WHERE height = $height`;
            const params = {
                $height: height
            }
            this.db.all(sql, params, (e, rows)=>{
                if (rows.length > 1) {
                    reject(`same height found: ${height}`);
                }
                if (e) {
                    reject(e)
                }
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

module.exports = SQLiteDB