'use strict';
require('dotenv').config();

const path = require('path');

require('./hardhat');
require('@nomiclabs/hardhat-truffle5');
require('solidity-coverage');
require('hardhat-gas-reporter');

const {
	constants: { inflationStartTimestampInSecs, AST_FILENAME, AST_FOLDER, BUILD_FOLDER },
} = require('.');

const GAS_PRICE = 20e9; // 20 GWEI
const CACHE_FOLDER = 'cache';

module.exports = {
	GAS_PRICE,
	solidity: {
		compilers: [
			{
				version: '0.4.25',
			},
			{
				version: '0.5.16',
			},
		],
	},
	paths: {
		sources: './contracts',
		tests: './test/contracts',
		artifacts: path.join(BUILD_FOLDER, 'artifacts'),
		cache: path.join(BUILD_FOLDER, CACHE_FOLDER),
	},
	astdocs: {
		path: path.join(BUILD_FOLDER, AST_FOLDER),
		file: AST_FILENAME,
		ignores: 'test-helpers',
	},
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {
			gas: 12e6,
			blockGasLimit: 12e6,
			allowUnlimitedContractSize: true,
			gasPrice: GAS_PRICE,
			initialDate: new Date(inflationStartTimestampInSecs * 1000).toISOString(),
			// Note: forking settings are injected at runtime by hardhat/tasks/task-node.js
		},
		localhost: {
			gas: 12e6,
			blockGasLimit: 12e6,
			url: 'http://localhost:8545',
		},
		kovan: {
			url: `https://kovan.infura.io/v3/${process.env.WEB3_INFURA_PROJECT_ID}`,
			accounts: [
				process.env.ROCKX_PRIVATE_KEY_TEST_1, // gov account
				process.env.ROCKX_PRIVATE_KEY_TEST_2, // reward account
				process.env.ROCKX_PRIVATE_KEY_TEST_3, // user account
			],
		},
	},
	gasReporter: {
		enabled: false,
		showTimeSpent: true,
		currency: 'USD',
		maxMethodDiff: 25, // CI will fail if gas usage is > than this %
		outputFile: 'test-gas-used.log',
	},
};
