const getBlockFromJson = require('./blockFromJson')

const path = '../fork_issue_20191012/newChain/';

const tableName = 'new_block'

getBlockFromJson(1588431, path, tableName);
