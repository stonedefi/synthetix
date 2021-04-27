const STUSDC = '0xbD40Ec2839FD401b87320E0324Ff419BfcC56308';
const STN = '0xE1DD75d6e0B8dFdfa7712e0653F60E86592f7646';

async function main() {
	const accounts = await web3.eth.getAccounts();
	const owner = accounts[0];
	console.log('Using the account: ', owner);

	// We get the contract to deploy
	const StakingRewards = artifacts.require('StakingRewards');
	const stakingRewards = await StakingRewards.new(owner, owner, STN, STUSDC);

	console.log('StakingRewards deployed to:', stakingRewards.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
