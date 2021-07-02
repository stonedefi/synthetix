const BN = web3.utils.BN;

const StakingRewards = artifacts.require('StakingRewards');
const IERC20 = artifacts.require('contracts/interfaces/IERC20.sol:IERC20');

const KOVAN_STN = '0xe14cccC1abe7a4a17f11C68ff18f7945D022D133';
const KOVAN_LP_STN_ETH = '0xb572da900c00d25cf4e63d4ce1186eee1f4f27cf';
// const KOVAN_DEPLOYED_STAKING_STN = '0x0DE5FBf95f1a1f289Db6Bc2F9f976Cc6E8506FFF';
// const KOVAN_DEPLOYED_STAKING_LP = '0xcad81D9680Ca96BD5e3C28104160f190a2FE8226';
const KOVAN_DEPLOYED_STAKING_STN = '0xf5150b880bFeE084261b3A2c32B3a3fd9ac257aC';
const KOVAN_DEPLOYED_STAKING_LP = '0xa00DE9d7e541Fca0bD3f2a80A43Eb49b27DDFae4';
const KOVAN_USER ='0xDF7B28E6371c932dB986b8E1BfE852304F2bE2a1'


const MAINNET_STN = '0xe63d6b308bce0f6193aec6b7e6eba005f41e36ab';
const MAINNET_LP_STN_ETH = '0x00d76633a1071e9aed6158ae1a5e1c4c5dc75e54';
const MAINNET_DEPLOYED_STAKING_STN = '0x70a5637051227D5789c859D9deF27E2D58e21F7E';
const MAINNET_DEPLOYED_STAKING_LP = '0x22e2E24d586dFD168685B02836d83b99FC66a02E';
const MAINNET_USER ='0xc59598f681e66E6728bAAD05C2C7Ac2abFFC4113'

const StnRewardsDuration = 604800; // 7 days
const stnRewardAmountBN = '435000000000000000000' //435 STN

const LpRewardsDuration = 604800; // 7 days
const lpRewardAmountBN = '8309000000000000000000'   // 8309 STN

function  timeStamp2String (time){
    var datetime = new Date();
     datetime.setTime(time);
     var year = datetime.getFullYear();
     var month = datetime.getMonth() + 1;
     var date = datetime.getDate();
     var hour = datetime.getHours();
     var minute = datetime.getMinutes();
     var second = datetime.getSeconds();
     var mseconds = datetime.getMilliseconds();
     return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second;
};

async function main() {
    // const accounts = await web3.eth.getAccounts();
    // const owner = accounts[0];
    // console.log('Using the account: ', owner);

    const accounts = await web3.eth.getAccounts();
	const owner = accounts[0];
	console.log('Using the account: ', owner);

	if (owner == KOVAN_USER){
        var stakingStnRewards = await StakingRewards.at(KOVAN_DEPLOYED_STAKING_STN);
        period = await stakingStnRewards.periodFinish()
        console.log('Kovan STN periodFinish tx:', period.toNumber());
        console.log('Kovan STN periodFinish time:', timeStamp2String(period.toNumber()*1000));

        var stakingLpRewards = await StakingRewards.at(KOVAN_DEPLOYED_STAKING_LP);
        period = await stakingLpRewards.periodFinish()
        console.log('Kovan LP periodFinish period:', period.toNumber());
        console.log('Kovan LP periodFinish period:', timeStamp2String(period.toNumber()*1000));
	}

	if (owner == MAINNET_USER){
        var stakingStnRewards = await StakingRewards.at(MAINNET_DEPLOYED_STAKING_STN);
        period = await stakingStnRewards.periodFinish()
        console.log('Mainnet STN periodFinish tx:', period.toNumber());
        console.log('Mainnet STN periodFinish time:', timeStamp2String(period.toNumber()*1000));

        var stakingLpRewards = await StakingRewards.at(MAINNET_DEPLOYED_STAKING_LP);
        period = await stakingLpRewards.periodFinish()
        console.log('Mainnet LP periodFinish period:', period.toNumber());
        console.log('Mainnet LP periodFinish period:', timeStamp2String(period.toNumber()*1000));
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
