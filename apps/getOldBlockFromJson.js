const { getBlockFromJson } = require('../libs/utils')

const path = '../fork_issue_20191012/oldChain/';

const tableName = 'old_block'

getBlockFromJson(1610571, path, tableName);
