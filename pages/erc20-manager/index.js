import { ethers } from 'ethers';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../components/context/AppContext';
import Layout from '../../components/layout/Layout';
import Contracts from '../../modules/contracts';
import Utils from '../../modules/utils';
import styles from '../../styles/erc20-manager.module.css';

const Erc20Manger = () => {
  const { account, provider, signer, chainId, setMessage, erc20Contract } =
    useContext(AppContext);

  const [tokenBalance, setTokenBalance] = useState('?');
  const [addressToSend, setAddressToSend] = useState();
  const [amountToSend, setAmountToSend] = useState();

  // update token balance when account changes
  useEffect(() => {
    (async () => {
      // check if user disconnected or on wrong network
      if (!account || chainId != 5) {
        setTokenBalance('?');
        return;
      }
      // get balance
      const _tokenBalance = Math.round(
        ethers.utils.formatEther(await erc20Contract.balanceOf(account))
      );
      // update balance
      setTokenBalance(_tokenBalance);
    })();
  }, [account]);

  const handleClickSend = async () => {
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
    // check if amount is valid
    if (!Utils.isPositiveInteger(amountToSend)) {
      setMessage([-1, 'Please enter a valid number']);
      return;
    }
    // check if address is valid
    if (!Utils.isValidAddress(addressToSend)) {
      setMessage([-1, 'Please enter a valid address']);
      return;
    }
    // check if amount is less than or equal to balance
    if (!(parseInt(amountToSend) <= tokenBalance)) {
      setMessage([-1, "You don't own enough tokens"]);
      return;
    }
    // send transaction
    try {
      const tx = await erc20Contract.transfer(
        addressToSend,
        ethers.utils.parseEther(`${amountToSend}`)
      );
      setMessage([2, 'Please wait transaction confirmation']);
      await tx.wait();
      setMessage([1, `Successfully transferred ${amountToSend} BLANK tokens`]);
      // update new balance
      const _tokenBalance = Math.round(
        ethers.utils.formatEther(
          await erc20Contract.balanceOf(await signer.getAddress())
        )
      );
      setTokenBalance(_tokenBalance);
    } catch (err) {
      setMessage([-1, 'Error occurred']);
      console.error(err);
    }
  };

  const handleClickImport = async () => {
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
    try {
      await provider.send('wallet_watchAsset', Contracts.blankObject);
    } catch (err) {
      setMessage([-1, 'Error occured']);
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>Blank NFT | ERC20</title>
      </Head>
      <Layout
        title={'ERC20'}
        subtitle={
          'Manage your BLANK tokens, you can get more tokens by staking your NFT'
        }
      >
        <div className={styles.container}>
          <div className={styles.erc20InfoContainer}>
            <h3 className={styles.erc20InfoTitle}>Blank tokens</h3>
            <h2 className={styles.erc20InfoBalance}>{tokenBalance}</h2>
          </div>
          <div className={styles.lineBreak}></div>
          <div className={styles.sendTokensInputContainer}>
            <label className={styles.inputLabel}>Amount</label>
            <input
              className={styles.input}
              type="text"
              name="amount"
              placeholder="Tokens to send"
              onChange={(e) => {
                setAmountToSend(e.target.value);
              }}
            ></input>
          </div>
          <div className={styles.sendTokensInputContainer}>
            <label className={styles.inputLabel}>Recipient</label>
            <input
              className={styles.input}
              type="text"
              name="amount"
              placeholder="Insert recipient address"
              onChange={(e) => {
                setAddressToSend(e.target.value);
              }}
            ></input>
          </div>
          <button
            className={`btnMain ${styles.btnSend}`}
            onClick={handleClickSend}
          >
            Send
          </button>
          <button className={styles.btnImportToken} onClick={handleClickImport}>
            Import token to MetaMask
          </button>
        </div>
      </Layout>
    </>
  );
};

export default Erc20Manger;
