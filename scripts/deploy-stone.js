const KOVAN_STN = '0xe14cccC1abe7a4a17f11C68ff18f7945D022D133';
const KOVAN_LP_STN_ETH = '0xb572da900c00d25cf4e63d4ce1186eee1f4f27cf';
const KOVAN_USER='0xDF7B28E6371c932dB986b8E1BfE852304F2bE2a1'

const MAINNET_STN = '0xe63d6b308bce0f6193aec6b7e6eba005f41e36ab';
const MAINNET_LP_STN_ETH = '0x00d76633a1071e9aed6158ae1a5e1c4c5dc75e54';
const MAINNET_USER='0xc59598f681e66E6728bAAD05C2C7Ac2abFFC4113'

async function main() {
	const accounts = await web3.eth.getAccounts();
	const owner = accounts[0];
	console.log('Using the account: ', owner);

	if (owner == KOVAN_USER){
		// We get the contract to deploy
		const StakingRewards = artifacts.require('StakingRewards');
		const stnStaking = await StakingRewards.new(owner, owner, KOVAN_STN, KOVAN_STN);
		console.log('kovan stnStaking deployed to:', stnStaking.address);

		const lpStaking = await StakingRewards.new(owner, owner, KOVAN_STN, KOVAN_LP_STN_ETH);
		console.log('kovan lpStaking deployed to:', lpStaking.address);
	}

	if (owner == MAINNET_USER){
		// We get the contract to deploy
		const StakingRewards = artifacts.require('StakingRewards');
		const stnStaking = await StakingRewards.new(owner, owner, MAINNET_STN, MAINNET_STN);
		console.log('mainnet stnStaking deployed to:', stnStaking.address);

		const lpStaking = await StakingRewards.new(owner, owner, MAINNET_STN, MAINNET_LP_STN_ETH);
		console.log('mainnet lpStaking deployed to:', lpStaking.address);
	}
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1);
	});
