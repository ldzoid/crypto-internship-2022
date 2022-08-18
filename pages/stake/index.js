import StakeDashboard from '../../components/stake/StakeDashboard';
import SectionStaked from '../../components/stake/SectionStaked';
import SectionUnstaked from '../../components/stake/SectionUnstaked';
import styles from '../../styles/stake.module.css';

const Stake = () => {
  return (
    <div className={styles.container}>
      <StakeDashboard />
      <SectionStaked />
      <SectionUnstaked />
    </div>
  );
};

export default Stake;
