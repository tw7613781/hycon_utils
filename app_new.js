const BlockCrawler = require('./blockCrawler')

const tip = 'D6pXQo6x64rtvhSsdWCtfuz7fiMUqVinEi1HdBpK1f95'
const number = 70000;
const url = 'https://network.hycon.io/api/v1/block/'
const tableName = 'new_block'

new BlockCrawler(tip, number, url, tableName);
