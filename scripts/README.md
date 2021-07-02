
// deploy for testcases
npx hardhat run scripts/deploy.js  --network kovan
npx hardhat run scripts/test-staking.js  --network kovan
npx hardhat run scripts/test-staking-emergency.js  --network kovan
npx hardhat run scripts/test-staking-periodFinish-emergency.js --network kovan


// deploy for stone kovan
npx hardhat run scripts/deploy-stone.js  --network kovan

// deploy for stone mainnet
npx hardhat run scripts/deploy-stone.js  --network mainnet

// add reward for stone kovan
npx hardhat run scripts/add-rewards-stone.js  --network kovan

// add reward for stone mainnet
npx hardhat run scripts/add-rewards-stone.js  --network mainnet



// get periodFinish for stone kovan
npx hardhat run scripts/get-period-stone.js  --network kovan

// get periodFinish for stone mainnet
npx hardhat run scripts/get-period-stone.js  --network mainnet