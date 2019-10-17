const { extractTxFromBlock } = require('../libs/utils')

// the forked block height
const height = 1579813;
const block = 'old_block';
const tx = 'old_tx';

extractTxFromBlock(height, block, tx)
