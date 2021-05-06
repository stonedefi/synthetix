const STUSDC = '0xbD40Ec2839FD401b87320E0324Ff419BfcC56308';
const STN = '0xe14cccC1abe7a4a17f11C68ff18f7945D022D133';
const STNETH_UNI_LP = '0xb572da900c00d25cf4e63d4ce1186eee1f4f27cf'

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
