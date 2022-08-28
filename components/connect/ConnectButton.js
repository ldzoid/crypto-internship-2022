import { ethers } from 'ethers';
import Image from 'next/image';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import styles from './ConnectButton.module.css';
import Metamask from '../../public/images/Metamask.png';

const ConnectButton = () => {
  const { setAccount, provider, setSigner, setMessage } =
    useContext(AppContext);

  const connectToMetamask = async () => {
    if (provider) {
      // connect to metamask & update data
      try {
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
        setMessage([1, 'Connected successfully']);
        // init events for changing account in future
        ethereum.on('accountsChanged', (accounts) => setAccount(accounts[0]));
        ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });
      } catch (e) {
        setMessage([-1, 'Error occurred']);
        console.error(e);
      }
    } else {
      console.log('Please install ethereum');
    }
  };

  return (
    <>
      <button className={styles.button} onClick={connectToMetamask}>
        <Image
          src={Metamask}
          width={100}
          height={100}
          className={styles.image}
        />
      </button>
    </>
  );
};

export default ConnectButton;
