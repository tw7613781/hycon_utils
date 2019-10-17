const { extractTxFromBlock } = require('../libs/utils')

// the forked block height
const height = 1579813;
const block = 'new_block';
const tx = 'new_tx';

extractTxFromBlock(height, block, tx)
