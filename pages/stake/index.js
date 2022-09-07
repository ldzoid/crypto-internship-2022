import Head from 'next/head';
import StakeDashboard from '../../components/stake/StakeDashboard';
import SectionStakeList from '../../components/stake/SectionStakeList';
import styles from '../../styles/stake.module.css';
import { useEffect, useContext, useState } from 'react';
import { AppContext } from '../../components/context/AppContext';
import { StakeContext } from '../../components/context/StakeContext';
import Layout from '../../components/layout/Layout';

const Stake = () => {
  const { account, signer, chainId, setMessage } = useContext(AppContext);

  const [stakedList, setStakedList] = useState(['23', '234', '514', '1', '65']);
  const [unstakedList, setUnstakedList] = useState(['543', '86', '455']);

  const [totalStaked, setTotalStaked] = useState('?');
  const [userStaked, setUserStaked] = useState('?');
  const [rewardPerDay, setRewardsPerDay] = useState('?');
  const [totalRewards, setTotalRewards] = useState('?');

  // update stake & unstake lists when account changes
  useEffect(() => {

  }, [account])

  const stake = (_id) => {
    // setApprovalForAll() first once for all (message or some shit? for better UX)
    console.log('stake ' + _id);
  };

  const unstake = (_id) => {
    console.log('unstaked ' + _id);
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
          <StakeContext.Provider
            value={{
              totalStaked,
              setTotalStaked,
              userStaked,
              setUserStaked,
              rewardPerDay,
              setRewardsPerDay,
              totalRewards,
              setTotalRewards,
            }}
          >
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
          </StakeContext.Provider>
        </div>
      </Layout>
    </>
  );
};

export default Stake;
