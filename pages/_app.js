import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Contracts from '../modules/contracts';
import { AppContext } from '../components/context/AppContext';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [message, setMessage] = useState([0, '']); // 0 - defaut, 1 - success, -1 - error, 2 - loader
  const [supply, setSupply] = useState('?');
  const [mintedList, setMintedList] = useState([]);
  const [tokenBalance, setTokenBalance] = useState('?');

  // set provider to window.ethereum if metamask is installed
  useEffect(() => {
    if (window.ethereum !== undefined) {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(_provider);
    } else {
      setProvider(undefined);
    }
  }, []);

  // when account changes, update all state variables
  useEffect(() => {
    (async () => {
      // check if user disconnected
      if (!account) {
        console.log('user disconnected');
        setSupply('?');
        setMintedList([]);
        setTokenBalance('?');
        return;
      }
      console.log(account);
      // update signer
      await provider.send('eth_requestAccounts', []);
      const _signer = await provider.getSigner();
      // check if correct network
      const { chainId } = await provider.getNetwork();
      if (chainId != 5) {
        setMessage([-1, 'Please switch network to Goerli testnet']);
        return;
      }
      // initialize contracts
      const blankHoodieContract = new ethers.Contract(
        Contracts.BlankHoodieAddress,
        Contracts.BlankHoodieABI,
        _signer
      );
      const blankContract = new ethers.Contract(
        Contracts.BlankAddress,
        Contracts.BlankABI,
        _signer
      );
      // update supply, minted list, token balance
      const _supply = await blankHoodieContract.totalSupply();
      const _mintedList = (
        await blankHoodieContract.tokensOfOwner(account)
      ).map((object) => parseInt(object['_hex']), 16);
      const _tokenBalance = Math.round(
        ethers.utils.formatEther(
          await blankContract.balanceOf(await _signer.getAddress())
        )
      );
      setSigner(_signer);
      setSupply(_supply);
      setMintedList(_mintedList);
      setTokenBalance(_tokenBalance);
      console.log('updated both');
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
        message,
        setMessage,
        supply,
        setSupply,
        mintedList,
        setMintedList,
        tokenBalance,
        setTokenBalance,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;
