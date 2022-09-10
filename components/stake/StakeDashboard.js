import { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { StakeContext } from '../context/StakeContext';
import Contracts from '../../modules/contracts';
import styles from './StakeDashboard.module.css';

const StakeDashboard = () => {
  const { account, chainId, setMessage, nftContract, stakeContract } =
    useContext(AppContext);
  const {
    totalStaked,
    setTotalStaked,
    userStaked,
    setUserStaked,
    rewardPerDay,
    setRewardsPerDay,
    totalRewards,
    setTotalRewards,
  } = useContext(StakeContext);

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
      // get staked amount
      const stakedAmount = Number(
        await nftContract.balanceOf(Contracts.StakingAddress)
      );
      // get user stake amount
      const userStakedAmount = (await stakeContract.getStakesOfOwner(account))
        .length;
      // get user total rewards
      const userTotalRewards = Number(
        await stakeContract.getRewardsOfOwner(account)
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
      } catch (err) {
        console.error(err);
      }
      return;
    }
    // check if user has any claimable rewards
    if (totalRewards == 0) {
      setMessage([-1, 'You have no claimable tokens']);
      return;
    }
    // send transaction
    try {
      const tx = await stakeContract.claim();
      setMessage([2, 'Please wait transaction confirmation']);
      await tx.wait();
      setMessage([1, 'Claimed successfully']);
      // update total reward
      const userTotalRewards = Number(
        await stakeContract.getRewardsOfOwner(account)
      );
      setTotalRewards(userTotalRewards);
    } catch (err) {
      setMessage([-1, 'Error occurred']);
      console.error(err);
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
        <h3 className={styles.dataValue}>
          {Math.round(totalRewards / 10 ** 14) / 10000} BLANK
        </h3>
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
