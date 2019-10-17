const { GetBlockFromAPI } = require('../libs/utils')

const tip = '69w7irJnFEQsiHcE9HRWZEkDmERgBZk5yDrZXkzhztdr'
const number = 90000;
const url = 'http://hplorer.com:2441/api/v1/block/'
const tableName = 'old_block'

new GetBlockFromAPI(tip, number, url, tableName);
