const StakingRewards = artifacts.require('StakingRewards');
const IERC20 = artifacts.require('contracts/interfaces/IERC20.sol:IERC20');

const STUSDC = '0xbD40Ec2839FD401b87320E0324Ff419BfcC56308';
const STN = '0xe14cccC1abe7a4a17f11C68ff18f7945D022D133';
const STNETH_UNI_LP = '0xb572da900c00d25cf4e63d4ce1186eee1f4f27cf'
const DEPLOYED_STAKING_STN = '0x9Bd91732DAD9CAF0C2D17865553103Ff86f0d478';
const DEPLOYED_STAKING_STNETH_LP = '0xe0eD96b6efcB791cCB991570D0C4454A22b944fe';


async function main() {
    // const accounts = await web3.eth.getAccounts();
    // const owner = accounts[0];
    // console.log('Using the account: ', owner);

    // We get the contract to deploy
    var stakingRewards = await StakingRewards.at(DEPLOYED_STAKING_STN);
    var rewardToken = await IERC20.at(STN);
    
    await rewardToken.transfer(stakingRewards.address, '10000000000000000000000')  // 10000 STN
    await stakingRewards.setRewardsDuration(8640000)  // 100 days
    await stakingRewards.notifyRewardAmount('2000000000000000000000') // 2000 STN
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
