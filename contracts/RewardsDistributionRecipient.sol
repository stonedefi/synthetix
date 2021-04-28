pragma solidity ^0.5.16;

// Inheritance
import "./Owned.sol";


// https://docs.synthetix.io/contracts/source/contracts/rewardsdistributionrecipient
contract RewardsDistributionRecipient is Owned {
    address public rewardsDistribution;

    event RewardsDistributionUpdated(address newRewardsDistribution);

    function notifyRewardAmount(uint256 reward) external;

    modifier onlyRewardsDistribution() {
        require(msg.sender == rewardsDistribution, "Caller is not RewardsDistribution contract");
        _;
    }

    function setRewardsDistribution(address _rewardsDistribution) external onlyOwner {
        require(_rewardsDistribution != address(0), "_rewardsDistribution cannot be 0");
        rewardsDistribution = _rewardsDistribution;
        emit RewardsDistributionUpdated(_rewardsDistribution);
    }
}
