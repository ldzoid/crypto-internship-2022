import { ethers } from 'ethers';
import Image from 'next/image';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import styles from './ConnectButton.module.css';
import Metamask from '../../public/images/metamask.png';

const ConnectButton = () => {
  const { setAccount, provider, setMessage } = useContext(AppContext);

  const connectToMetamask = async () => {
    if (provider) {
      // connect to metamask & update data
      try {
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());
        setMessage([1, 'Connected successfully']);
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
