import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { AppContext } from '../components/context/AppContext';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [chainId, setChainId] = useState();
  const [message, setMessage] = useState([0, '']); // 0 - defaut, 1 - success, -1 - error, 2 - loader

  // set provider to window.ethereum if MetaMask is installed & handle MetaMask events
  useEffect(() => {
    if (window.ethereum !== undefined) {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(_provider);
      // init metamask events
      ethereum.on('accountsChanged', (accounts) => setAccount(accounts[0]));
      ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } else {
      setProvider(undefined);
    }

    // unsubscribe events when component unmounts
    return () => {
      // init metamask events
      ethereum.removeListener('accountsChanged', (accounts) =>
        setAccount(accounts[0])
      );
      ethereum.removeListener('chainChanged', () => {
        window.location.reload();
      });
    };
  }, []);

  // update signer when account changes
  useEffect(() => {
    (async () => {
      // check if user disconnected
      if (!account) {
        return;
      }
      console.log(account);
      // update signer
      await provider.send('eth_requestAccounts', []);
      const _signer = await provider.getSigner();
      setSigner(_signer);
      // check if correct network
      const { chainId } = await provider.getNetwork();
      setChainId(chainId);
      if (chainId != 5) {
        console.log(chainId);
        setMessage([-1, 'Please switch network to Goerli testnet']);
        return;
      }
    })();
  }, [account]);

  return (
    <AppContext.Provider
      value={{
        account,
        setAccount,
        provider,
        setProvider,
        signer,
        setSigner,
        chainId,
        setChainId,
        message,
        setMessage,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;
