const BlockCrawler = require('./blockCrawler')

const tip = '69w7irJnFEQsiHcE9HRWZEkDmERgBZk5yDrZXkzhztdr'
const number = 90000;
const url = 'http://hplorer.com:2441/api/v1/block/'
const tableName = 'old_block'

new BlockCrawler(tip, number, url, tableName);
