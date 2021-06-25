const BN = web3.utils.BN;
const { assert } = require('../test/contracts/common');

const STUSDC = '0xbD40Ec2839FD401b87320E0324Ff419BfcC56308';
const STN = '0xE1DD75d6e0B8dFdfa7712e0653F60E86592f7646';
const DEPLOYED_STAKING_STUSDC = '0x27838B2b0A2e15AA16c923b0a03a1B7EFa059291';
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

	async function print_staking_lock_state() {
		var rewardRate = await stakingRewards.rewardRate();
		var rewardsDuration = await stakingRewards.rewardsDuration();
		var periodFinish = await stakingRewards.periodFinish();
		var rewardTokenBalance = await stnToken.balanceOf(stakingContract);
		console.log(
			'Staking contract state - rewardRate: %s, rewardsDuration: %s, rewardAmount: %s, ' +
				'periodFinish: %s, rewardTokenBalance: %s',
			rewardRate,
			rewardsDuration,
			rewardRate * rewardsDuration,
			periodFinish,
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
	tx = await stakingRewards.setRewardsDuration(600, { from: admin }); // 10 minutes
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
	console.log('Unstaking %s...', depositAmount.div(new BN(5)));
	tx = await stakingRewards.withdraw(depositAmount.div(new BN(5)), { from: user });
	await print_balances(user);

	// claim reward
	console.log('Claiming rewards...');
	tx = await stakingRewards.getReward({ from: user });
	await print_balances(user);
	await print_staking_state();

	// shorter periodFinish
	console.log('shorter periodFinish...');
	ts = Math.floor(Date.now()/1000);
	console.log('timestamp:', ts);
	setTS = ts + 300;
	console.log('timestamp setTS:', setTS);
	tx = await stakingRewards.updatePeriodFinish(setTS); // shorter about 5 minutes
	await print_balances(user);
	await print_staking_state();

	// wait for mining blocks
	console.log('Waiting for 10s...');
	await sleep(10);

    // contract still on normal, test withdraw
	// unstake partially
	console.log('Unstaking %s...', depositAmount.div(new BN(5)));
	tx = await stakingRewards.withdraw(depositAmount.div(new BN(5)), { from: user });
	await print_balances(user);

	// claim reward
	console.log('Claiming rewards...');
	tx = await stakingRewards.getReward({ from: user });
	await print_balances(user);

	// try update periodFinish to lock contract
	console.log('Try update periodFinish to lock contract...');
	err = null;
	try {
		tx = await stakingRewards.updatePeriodFinish(604800); // throw error
	} catch (error) {
		err = error;
	}
	console.log('Try periodFinish err:', err);
	assert.isNotNull(err, 'Tx should be failed and throw.');

	// wait for mining blocks
	console.log('Waiting for 10s...');
	await sleep(10);

	// contract still on normal, test withdraw
	// unstake partially
	console.log('Unstaking %s...', depositAmount.div(new BN(5)));
	tx = await stakingRewards.withdraw(depositAmount.div(new BN(5)), { from: user });
	await print_balances(user);

	// claim reward
	console.log('Claiming rewards...');
	tx = await stakingRewards.getReward({ from: user });
	await print_balances(user);

	// wait for mining blocks
	console.log('Waiting for 10s...');
	await sleep(10);

	// Try set periodFinish not on emergency to lock contract
	console.log('Try set periodFinish not on emergency to lock contract...');
	err = null;
	try {
		tx = await stakingRewards.setPeriodFinish(604800); 
	} catch (error) {
		err = error;
	}
	console.log('Try setPeriodFinish err:', err);
	assert.isNotNull(err, 'Tx should be failed and throw.');

	// try emergencyWithdraw not on emergency
	console.log('Waiting for 20s...');
	await sleep(20);
	emergency = await stakingRewards.emergency();
	console.log('get emergency:', emergency);

	console.log('Try emergencyWithdraw not on emergency...');
	err = null;
	try {
		tx = await stakingRewards.emergencyWithdraw(depositAmount.div(new BN(5)), { from: user });
	} catch (error) {
		err = error;
	}

	await print_balances(user);
	console.log('EmergencyWithdraw err:', err);
	assert.isNotNull(err, 'Tx should be failed and throw.');
	
	// set emergency
	emergency = await stakingRewards.emergency();
	console.log('emergency:', emergency);

	console.log('Waiting for 10s...');
	await sleep(10);
	console.log('Set Emergency...');
	tx = await stakingRewards.setEmergency(true);

	emergency = await stakingRewards.emergency();
	console.log('emergency:', emergency);

	// set periodFinish on emergency to lock contract
	console.log('Set periodFinish to lock contract...');
	err = null;
	try {
		tx = await stakingRewards.setPeriodFinish(604800); 
	} catch (error) {
		err = error;
	}
	await print_balances(user);
	await print_staking_lock_state();

	// Try to withdraw when contract is lock
	console.log('Try to withdraw when contract is lock %s...', depositAmount.div(new BN(5)));
	err = null;
	try {
		tx = await stakingRewards.withdraw(depositAmount.div(new BN(5)), { from: user });
	} catch (error) {
		err = error;
	}
	console.log('withdraw err:', err);
	assert.isNotNull(err, 'Tx should be failed and throw.');
	await print_balances(user);

	// Try to getReward when contract is lock
	console.log('Try to getReward when contract is lock...');
	err = null;
	try {
		tx = await stakingRewards.getReward({ from: user });
	} catch (error) {
		err = error;
	}
	console.log('getReward err:', err);
	assert.isNotNull(err, 'Tx should be failed and throw.');
	await print_balances(user);

	// emergencyWithdraw on emergency
	console.log('Waiting for 20s...');
	await sleep(20);
	console.log('Try emergencyWithdraw on emergency...');
	err = null;
	try {
		tx = await stakingRewards.emergencyWithdraw(depositAmount.div(new BN(5)), { from: user });
	} catch (error) {
		err = error;
	}
	assert.isNull(err, 'Tx should be success and no throw.');
	await print_balances(user);

	// wait for mining blocks
	console.log('Waiting for 60s...');
	await sleep(60);

	// exit
	console.log('Unstaking all...');
	err = null;
	try {
		tx = await stakingRewards.exit({ from: user });
	} catch (error) {
		err = error;
	}
	console.log('Unstaking all err:', err);
	assert.isNotNull(err, 'Tx should be failed and throw.');
	await print_balances(user);
	await print_staking_lock_state();

	// emergencyWithdraw withdraw all
	console.log('Waiting for 20s...');
	await sleep(20);
	console.log('Try emergencyWithdraw withdraw all...');
	stakedBalance = await stakingRewards.balanceOf(user);
	console.log('user staked balance:', stakedBalance);
	err = null;
	try {
		tx = await stakingRewards.emergencyWithdraw(stakedBalance, { from: user });
	} catch (error) {
		err = error;
	}
	assert.isNull(err, 'Tx should be success and no throw.');
	await print_balances(user);
	await print_staking_lock_state();
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
