import { ethers } from 'ethers';
import Image from 'next/image';
import { useContext } from 'react';
import { LayoutContext } from '../layout/LayoutContext';
import styles from './ConnectButton.module.css';
import Metamask from '../../public/images/Metamask.png';

const ConnectButton = () => {
  const { setAddress, setMessage } = useContext(LayoutContext);

  const connectToMetamask = async () => {
    if (window.ethereum !== undefined) {
      // connect to metamask & update data
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        setAddress(await signer.getAddress());
        setMessage([1, 'Connected successfully']);
        // init events for changing address in future
        ethereum.on('accountsChanged', (accounts) => setAddress(accounts[0]));
        ethereum.on('chainChanged', (chainId) => {
          window.location.reload();
        });
      } catch (e) {
        setMessage([-1, 'Error occurred']);
        console.error(e)
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
