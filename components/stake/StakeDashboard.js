import { ethers } from 'ethers';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { StakeContext } from '../context/StakeContext';
import Contracts from '../../modules/contracts';
import styles from './StakeDashboard.module.css';

const StakeDashboard = () => {
  const { account, signer, chainId, setMessage } = useContext(AppContext);
  const { totalStaked, setTotalStaked, userStaked, setUserStaked, rewardPerDay, setRewardsPerDay, totalRewards, setTotalRewards} = useContext(StakeContext)

  // update staking information when account changes
  useEffect(() => {
    (async () => {
      // check if user disconnected or on wrong network
      if (!account || chainId != 5) {
        setTotalStaked('?');
        setUserStaked('?');
        setRewardsPerDay('?');
        setTotalRewards('?');
        return;
      }
      // init NFT contract
      const blankHoodieContract = new ethers.Contract(
        Contracts.BlankHoodieAddress,
        Contracts.BlankHoodieABI,
        signer
      );
      // init staking contract
      const stakingContract = new ethers.Contract(
        Contracts.StakingAddress,
        Contracts.StakingABI,
        signer
      );
      // get staked amount
      const stakedAmount = parseInt(
        await blankHoodieContract.balanceOf(Contracts.StakingAddress),
        16
      );
      // get user stake amount
      const userStakedAmount = (await stakingContract.getStakesOfOwner(account))
        .length;
      // get user total rewards
      const userTotalRewards = parseInt(
        (await stakingContract.getRewardsOfOwner(account))['_hex'],
        16
      );
      // update staked amount, user staked amount, rewards per day
      setTotalStaked(stakedAmount);
      setUserStaked(userStakedAmount);
      setRewardsPerDay(userStakedAmount * 10);
      setTotalRewards(userTotalRewards);
    })();
  }, [account]);

  const handleClickClaim = async () => {
    // check if wallet is connected
    if (!account) {
      setMessage([-1, 'Connect wallet to complete the action']);
      return;
    }
    // check if chain is correct
    if (chainId != 5) {
      setMessage([-1, 'Please switch network to Goerli testnet']);
      // suggest user to switch network
      try {
        await provider.send('wallet_switchEthereumChain', [
          {
            chainId: '0x5',
          },
        ]);
      } catch (e) {
        console.error(e);
      }
      return;
    }
    // check if user has any claimable rewards
    if (totalRewards == 0) {
      setMessage([-1, 'You have no claimable tokens']);
      return;
    }
    // initialize staking contract
    const stakingContract = new ethers.Contract(
      Contracts.StakingAddress,
      Contracts.StakingABI,
      signer
    );
    // send transaction
    try {
      const tx = await stakingContract.claim();
      setMessage([2, 'Please wait transaction confirmation']);
      await tx.wait();
      setMessage('Claimed successfully');
      // update total reward
      const userTotalRewards = parseInt(
        (await stakingContract.getRewardsOfOwner(account))['_hex'],
        16
      );
      setTotalRewards(userTotalRewards);
    } catch (e) {
      setMessage([-1, 'Error occurred']);
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.infoStakeContainer}>
          <h3 className={styles.infoStakeTitle}>Total staked</h3>
          <h2 className={styles.infoStakeValue}>{totalStaked}</h2>
        </div>
        <div className={styles.infoStakeContainer}>
          <h3 className={styles.infoStakeTitle}>Your stake</h3>
          <h2 className={styles.infoStakeValue}>{userStaked}</h2>
        </div>
      </div>
      <div className={styles.dataContainer}>
        <h3 className={styles.dataTitle}>Start date</h3>
        <h3 className={styles.dataValue}>6th September 2022</h3>
      </div>
      <div className={styles.dataContainer}>
        <h3 className={styles.dataTitle}>Rewards per day</h3>
        <h3 className={styles.dataValue}>{rewardPerDay} BLANK</h3>
      </div>
      <div className={styles.dataContainer}>
        <h3 className={styles.dataTitle}>Claimable rewards</h3>
        <h3 className={styles.dataValue}>{totalRewards} BLANK</h3>
      </div>
      <button
        onClick={handleClickClaim}
        className={`btnMain ${styles.btnClaim}`}
      >
        Claim
      </button>
    </div>
  );
};

export default StakeDashboard;
