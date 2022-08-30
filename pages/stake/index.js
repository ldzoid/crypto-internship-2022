import Head from 'next/head';
import StakeDashboard from '../../components/stake/StakeDashboard';
import SectionStakeList from '../../components/stake/SectionStakeList';
import styles from '../../styles/stake.module.css';
import { useState } from 'react';
import Layout from '../../components/layout/Layout';

const Stake = () => {
  const [stakedList, setStakedList] = useState(['23', '234', '514', '1', '65']);
  const [unstakedList, setUnstakedList] = useState(['543', '86', '455']);

  // const updateLists = () => {

  // }

  const unstake = (_id) => {
    console.log('unstaked ' + _id);
  };

  const stake = (_id) => {
    console.log('stake ' + _id);
  };

  return (
    <>
      <Head>
        <title>Blank NFT | Stake</title>
      </Head>
      <Layout
        title={'Stake'}
        subtitle={'Stake your NFTs so you can later unstake them here as well'}
      >
        <div className={styles.container}>
          <StakeDashboard />
          <SectionStakeList
            title="Staked NFTs"
            list={stakedList}
            btnText="Unstake"
            btnClick={unstake}
          />
          <SectionStakeList
            title="Unstaked NFTs"
            list={unstakedList}
            btnText="Stake"
            btnClick={stake}
          />
        </div>
      </Layout>
    </>
  );
};

export default Stake;
