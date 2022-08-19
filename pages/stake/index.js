import StakeDashboard from '../../components/stake/StakeDashboard';
import SectionStakeList from '../../components/stake/SectionStakeList';
import styles from '../../styles/stake.module.css';
import { useState } from 'react';

const Stake = () => {

  const [stakedList, setStakedList] = useState(['23', '234', '514', '1', '65'])
  const [unstakedList, setUnstakedList] = useState(['543', '86', '455'])

  // const updateLists = () => {

  // }

  const unstake = (_id) => {
    console.log('unstaked ' + _id)
  }

  const stake = (_id) => {
    console.log('stake ' + _id)
  }

  return (
    <div className={styles.container}>
      <StakeDashboard />
      <SectionStakeList title='Staked NFTs' list={stakedList} btnText='Unstake' btnClick={unstake} />
      <SectionStakeList title='Unstaked NFTs' list={unstakedList} btnText='Stake' btnClick={stake} /> 
    </div>
  );
};

export default Stake;
