const BN = web3.utils.BN;

const StakingRewards = artifacts.require('StakingRewards');
const IERC20 = artifacts.require('contracts/interfaces/IERC20.sol:IERC20');

const KOVAN_STN = '0xe14cccC1abe7a4a17f11C68ff18f7945D022D133';
const KOVAN_LP_STN_ETH = '0xb572da900c00d25cf4e63d4ce1186eee1f4f27cf';
const KOVAN_DEPLOYED_STAKING_STN = '0x0DE5FBf95f1a1f289Db6Bc2F9f976Cc6E8506FFF';
const KOVAN_DEPLOYED_STAKING_LP = '0xcad81D9680Ca96BD5e3C28104160f190a2FE8226';
const KOVAN_USER ='0xDF7B28E6371c932dB986b8E1BfE852304F2bE2a1'


const MAINNET_STN = '0xe63d6b308bce0f6193aec6b7e6eba005f41e36ab';
const MAINNET_LP_STN_ETH = '0x00d76633a1071e9aed6158ae1a5e1c4c5dc75e54';
const MAINNET_DEPLOYED_STAKING_STN = '';
const MAINNET_DEPLOYED_STAKING_LP = '';
const MAINNET_USER ='0xc59598f681e66E6728bAAD05C2C7Ac2abFFC4113'

const StnRewardsDuration = 604800; // 7 days
const StnRewardAmount = 2000; // 2000 STN

const LpRewardsDuration = 604800; // 7 days
const LpRewardAmount = 2000; // 2000 STN

async function main() {
    // const accounts = await web3.eth.getAccounts();
    // const owner = accounts[0];
    // console.log('Using the account: ', owner);

    const accounts = await web3.eth.getAccounts();
	const owner = accounts[0];
	console.log('Using the account: ', owner);


	if (owner == KOVAN_USER){
        var rewardToken = await IERC20.at(KOVAN_STN);
        const decimals = new BN(10).pow(await rewardToken.decimals());
        console.log('Kovan stakingStnRewards decimals:', decimals);

        const stnRewardAmountBN = new BN(StnRewardAmount).mul(decimals);
        console.log('Kovan stakingStnRewards stnRewardAmountBN:', stnRewardAmountBN);

        var stakingStnRewards = await StakingRewards.at(KOVAN_DEPLOYED_STAKING_STN);
        console.log('Kovan stakingStnRewards transfer reward token...');
        tx = await rewardToken.transfer(stakingStnRewards.address, stnRewardAmountBN);
        console.log('Kovan transfer tx:', tx.tx);
        console.log('Kovan stakingStnRewards setRewardsDuration token...');
        tx = await stakingStnRewards.setRewardsDuration(StnRewardsDuration)
        console.log('Kovan setRewardsDuration tx:', tx.tx);
        console.log('Kovan stakingStnRewards snotifyRewardAmount token...');
        tx = await stakingStnRewards.notifyRewardAmount(stnRewardAmountBN)
        console.log('Kovan notifyRewardAmount tx:', tx.tx);

        const lpRewardAmountBN = new BN(LpRewardAmount).mul(decimals);
        console.log('Kovan stakingStnRewards lpRewardAmountBN:', lpRewardAmountBN);

        var stakingLpRewards = await StakingRewards.at(KOVAN_DEPLOYED_STAKING_LP);
        console.log('Kovan stakingLpRewards transfer reward token...');
        tx = await rewardToken.transfer(stakingLpRewards.address, lpRewardAmountBN)
        console.log('Kovan transfer tx:', tx.tx);
        console.log('Kovan stakingLpRewards setRewardsDuration token...');
        tx = await stakingLpRewards.setRewardsDuration(LpRewardsDuration)
        console.log('Kovan setRewardsDuration tx:', tx.tx);
        console.log('Kovan stakingLpRewards notifyRewardAmount token...');
        tx = await stakingLpRewards.notifyRewardAmount(lpRewardAmountBN)
        console.log('Kovan notifyRewardAmount tx:', tx.tx);
	}

	if (owner == MAINNET_USER){
        var rewardToken = await IERC20.at(MAINNET_STN);
        const decimals = new BN(10).pow(await rewardToken.decimals());
        console.log('Mainnet stakingStnRewards decimals:', decimals);

        const stnRewardAmountBN = new BN(StnRewardAmount).mul(decimals);
        console.log('Mainnet stakingStnRewards stnRewardAmountBN:', stnRewardAmountBN);

        var stakingStnRewards = await StakingRewards.at(MAINNET_DEPLOYED_STAKING_STN);
        console.log('Mainnet stakingStnRewards transfer reward token...');
        // await rewardToken.transfer(stakingStnRewards.address, stnRewardAmountBN)
        console.log('Mainnet stakingStnRewards setRewardsDuration token...');
        tx = await stakingStnRewards.setRewardsDuration(StnRewardsDuration)
        console.log('Mainnet setRewardsDuration tx:', tx.tx);
        console.log('Mainnet stakingStnRewards notifyRewardAmount token...');
        tx = await stakingStnRewards.notifyRewardAmount(stnRewardAmountBN) 
        console.log('Mainnet notifyRewardAmount tx:', tx.tx);

        const lpRewardAmountBN = new BN(LpRewardAmount).mul(decimals);
        console.log('Mainnet stakingLpRewards lpRewardAmountBN:', lpRewardAmountBN);

        var stakingLpRewards = await StakingRewards.at(MAINNET_DEPLOYED_STAKING_LP);
        console.log('Mainnet stakingLpRewards transfer reward token...');
        // await rewardToken.transfer(stakingLpRewards.address, lpRewardAmountBN)
        console.log('Mainnet stakingLpRewards setRewardsDuration token...');
        tx = await stakingLpRewards.setRewardsDuration(RewardsDuration)
        console.log('Mainnet setRewardsDuration tx:', tx.tx);
        console.log('Mainnet stakingLpRewards notifyRewardAmount token...');
        tx = await stakingLpRewards.notifyRewardAmount(lpRewardAmountBN)
        console.log('Mainnet notifyRewardAmount tx:', tx.tx);
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
