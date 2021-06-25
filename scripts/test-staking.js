const BN = web3.utils.BN;
const { assert } = require('../test/contracts/common');

const STUSDC = '0xbD40Ec2839FD401b87320E0324Ff419BfcC56308';
const STN = '0xE1DD75d6e0B8dFdfa7712e0653F60E86592f7646';
const DEPLOYED_STAKING_STUSDC = '0x916B52D1C8EC7e0B54afbcB87fC25B625BDab3c0';
const DEPLOYED_STAKING_STN = '0x1920569883C17aF87B3575E2387E94D24934c099';

const StakingRewards = artifacts.require('StakingRewards');
const IERC20 = artifacts.require('contracts/interfaces/IERC20.sol:IERC20');

function sleep(seconds) {
	return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function runTest(stakingContract, tokenContract, depositAmount) {
	var accounts = await web3.eth.getAccounts();
	console.log("accounts:", accounts)
	var admin = accounts[0];
	console.log("admin:", admin)
	var user = accounts[2];
	console.log("user:", user)
	var stakingRewards = await StakingRewards.at(stakingContract);
	var stakingToken = await IERC20.at(tokenContract);
	var stnToken = await IERC20.at(STN);
	const decimals = new BN(10).pow(await stnToken.decimals());
	const addRewardAmount = new BN(10).mul(decimals);

	async function print_balances(address) {
		console.log(
			'User token balance: %s, staked: %s, STN: %s',
			await stakingToken.balanceOf(address),
			await stakingRewards.balanceOf(address),
			await stnToken.balanceOf(address)
		);
	}

	async function print_staking_state() {
		var rewardRate = await stakingRewards.rewardRate();
		var rewardsDuration = await stakingRewards.rewardsDuration();
		var periodFinish = await stakingRewards.periodFinish();
		var rewardPerToken = await stakingRewards.rewardPerToken();
		var rewardTokenBalance = await stnToken.balanceOf(stakingContract);
		console.log(
			'Staking contract state - rewardRate: %s, rewardsDuration: %s, rewardAmount: %s, ' +
				'periodFinish: %s, rewardPerToken: %s, rewardTokenBalance: %s',
			rewardRate,
			rewardsDuration,
			rewardRate * rewardsDuration,
			periodFinish,
			rewardPerToken,
			rewardTokenBalance
		);
	}

	tx = await stakingToken.approve(stakingContract, '1000000000000000000000000000000', {
		from: user,
	});

	// clean up unclaimed rewards
	console.log('Unclaimed rewards: %s', await stakingRewards.earned(user));
	if ((await stakingRewards.balanceOf(user)) > 0) {
		console.log('Cleaning up deposit and rewards...');
		tx = await stakingRewards.exit({ from: user });
	}
	await print_balances(user);
	await print_staking_state();

	// stake
	console.log('Staking %s...', depositAmount);
	tx = await stakingRewards.stake(depositAmount, { from: user });
	await print_balances(user);

	// add rewards
	console.log('Remaining STN of admin: %s', (await stnToken.balanceOf(admin)).div(decimals));
	console.log('Adding rewards...');
	tx = await stnToken.transfer(stakingContract, addRewardAmount, { from: admin });
	tx = await stakingRewards.setRewardsDuration(60, { from: admin }); // 1 minute
	err = null;
	try {
		tx = await stakingRewards.notifyRewardAmount(addRewardAmount.mul(new BN(2)), { from: admin });
	} catch (error) {
		err = error;
	}
	assert.isNotNull(err, 'Tx should be failed and throw.');
	tx = await stakingRewards.notifyRewardAmount(addRewardAmount, { from: admin });
	console.log('Remaining STN of admin: %s', (await stnToken.balanceOf(admin)).div(decimals));
	await print_staking_state();

	// wait for mining blocks
	console.log('Waiting for 10s...');
	await sleep(10);
	console.log('Unclaimed rewards: %s', await stakingRewards.earned(user));

	// unstake partially
	console.log('Unstaking %s...', depositAmount.div(new BN(3)));
	tx = await stakingRewards.withdraw(depositAmount.div(new BN(3)), { from: user });
	await print_balances(user);

	// claim reward
	console.log('Claiming rewards...');
	tx = await stakingRewards.getReward({ from: user });
	await print_balances(user);

	// wait for mining blocks
	console.log('Waiting for 60s...');
	await sleep(60);
	console.log('Unclaimed rewards: %s', await stakingRewards.earned(user));

	// exit
	console.log('Unstaking all...');
	tx = await stakingRewards.exit({ from: user });
	await print_balances(user);

	await print_staking_state();
}

async function main() {
	await runTest(DEPLOYED_STAKING_STUSDC, STUSDC, new BN(1e5));
	// await runTest(DEPLOYED_STAKING_STN, STN, new BN('100000000000000000000'));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
