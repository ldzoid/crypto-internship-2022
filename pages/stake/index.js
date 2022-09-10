import { ethers } from 'ethers';
import Head from 'next/head';
import { useEffect, useContext, useState } from 'react';
import StakeDashboard from '../../components/stake/StakeDashboard';
import SectionStakeList from '../../components/stake/SectionStakeList';
import { AppContext } from '../../components/context/AppContext';
import { StakeContext } from '../../components/context/StakeContext';
import Layout from '../../components/layout/Layout';
import Contracts from '../../modules/contracts';
import Utils from '../../modules/utils';
import styles from '../../styles/stake.module.css';

const Stake = () => {
  const { account, setAccount, signer, chainId, setMessage, nftContract, stakeContract } =
    useContext(AppContext);

  const [stakedList, setStakedList] = useState([]);
  const [unstakedList, setUnstakedList] = useState([]);

  const [totalStaked, setTotalStaked] = useState('?');
  const [userStaked, setUserStaked] = useState('?');
  const [rewardPerDay, setRewardsPerDay] = useState('?');
  const [totalRewards, setTotalRewards] = useState('?');

  // update stake & unstake lists when account changes
  useEffect(() => {
    (async () => {
      // check if user disconnected or on wrong network
      if (!account || chainId != 5) {
        setStakedList([]);
        setUnstakedList([]);
        return;
      }
      // get staked list and sort it
      const _stakedList = Utils.sortedArray(
        (await stakeContract.getStakesOfOwner(account)).map((item) =>
          parseInt(item['_hex'], 16)
        )
      );
      // get unstaked list and sort it
      const _unstakedList = Utils.sortedArray(
        (await nftContract.tokensOfOwner(account)).map((item) =>
          parseInt(item['_hex'], 16)
        )
      );
      // set staked and unstaked lists
      setStakedList(_stakedList);
      setUnstakedList(_unstakedList);
    })();
  }, [account]);

  const stake = async (_id) => {
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
    // check if staking contract is approved for user NFTs
    if (
      !(await nftContract.isApprovedForAll(
        account,
        Contracts.StakingAddress
      ))
    ) {
      try {
        const tx = await nftContract.setApprovalForAll(
          Contracts.StakingAddress,
          true
        );
        setMessage([2, 'Please wait contract approval confirmation']);
        await tx.wait();
        setMessage([1, 'Contract approved succesfully']);
      } catch (e) {
        setMessage([-1, 'Error occurred']);
        console.log(e);
        return;
      }
    }
    // send transaction
    try {
      const tx = await stakeContract.stake([_id]);
      setMessage([2, 'Please wait transaction confirmation']);
      await tx.wait();
      setMessage([1, 'NFT staked succesfully']);
      updateAll();
    } catch (e) {
      setMessage([-1, 'Error occurred']);
      console.log(e);
      return;
    }
  };

  const unstake = async (_id) => {
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
    // send transaction
    try {
      const tx = await stakeContract.unstake([_id]);
      setMessage([2, 'Please wait transaction confirmation']);
      await tx.wait();
      setMessage([1, 'NFT unstaked succesfully']);
      updateAll();
    } catch (e) {
      setMessage([-1, 'Error occurred']);
      console.log(e);
      return;
    }
  };

  const updateAll = async () => {
    // get staked list and sort it
    const _stakedList = Utils.sortedArray(
      (await stakeContract.getStakesOfOwner(account)).map((item) =>
        parseInt(item['_hex'], 16)
      )
    );
    // get unstaked list and sort it
    const _unstakedList = Utils.sortedArray(
      (await nftContract.tokensOfOwner(account)).map((item) =>
        parseInt(item['_hex'], 16)
      )
    );
    // set staked and unstaked lists
    setStakedList(_stakedList);
    setUnstakedList(_unstakedList);
    // get staked amount
    const stakedAmount = parseInt(
      await nftContract.balanceOf(Contracts.StakingAddress),
      16
    );
    // get user stake amount
    const userStakedAmount = (await stakeContract.getStakesOfOwner(account))
      .length;
    // get user total rewards
    const userTotalRewards = parseInt(
      (await stakeContract.getRewardsOfOwner(account))['_hex'],
      16
    );
    // update staked amount, user staked amount, rewards per day
    setTotalStaked(stakedAmount);
    setUserStaked(userStakedAmount);
    setRewardsPerDay(userStakedAmount * 10);
    setTotalRewards(userTotalRewards);
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
