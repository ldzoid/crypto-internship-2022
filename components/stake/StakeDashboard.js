import styles from './StakeDashboard.module.css';

const StakeDashboard = () => {
  return (
    <div className={styles.container}>
      <div className={styles.infoContainer}>
        <div className={styles.infoStakeContainer}>
          <h3 className={styles.infoStakeTitle}>Total staked</h3>
          <h2 className={styles.infoStakeValue}>1312</h2>
        </div>
        <div className={styles.infoStakeContainer}>
          <h3 className={styles.infoStakeTitle}>Your stake</h3>
          <h2 className={styles.infoStakeValue}>13</h2>
        </div>
      </div>
      <div className={styles.dataContainer}>
        <h3 className={styles.dataTitle}>Start date</h3>
        <h3 className={styles.dataValue}>15th July 2022</h3>
      </div>
      <div className={styles.dataContainer}>
        <h3 className={styles.dataTitle}>Rewards per day</h3>
        <h3 className={styles.dataValue}>20 BLANK</h3>
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
