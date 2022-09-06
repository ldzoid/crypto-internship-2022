import { ethers } from 'ethers';
import { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Contracts from '../../modules/contracts';
import styles from './StakeDashboard.module.css';

const StakeDashboard = () => {
  const { account, signer, chainId } = useContext(AppContext);

  const [totalStaked, setTotalStaked] = useState('?');
  const [userStaked, setUserStaked] = useState('?');

  useEffect(() => {
    (async () => {
      // check if user disconnected or on wrong network
      if (!account || chainId != 5) {
        setTotalStaked('?');
        setUserStaked('?');
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
      const userStakedAmount = (await stakingContract.getStakesOfOwner(account)).length
      // update staked amount & user staked amount
      setTotalStaked(stakedAmount);
      setUserStaked(userStakedAmount);
    })();
  }, [account]);

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
        <h3 className={styles.dataValue}>15th July 2022</h3>
      </div>
      <div className={styles.dataContainer}>
        <h3 className={styles.dataTitle}>Rewards per day</h3>
        <h3 className={styles.dataValue}>10 BLANK</h3>
      </div>
      <div className={styles.dataContainer}>
        <h3 className={styles.dataTitle}>Claimable rewards</h3>
        <h3 className={styles.dataValue}>X BLANK</h3>
      </div>
      <button className={`btnMain ${styles.btnClaim}`}>Claim</button>
    </div>
  );
};

export default StakeDashboard;
