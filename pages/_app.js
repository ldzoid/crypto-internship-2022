import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Contracts from '../modules/contracts';
import { AppContext } from '../components/context/AppContext';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }) => {
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState([0, '']); // 0 - defaut, 1 - success, -1 - error, 2 - loader
  const [supply, setSupply] = useState('?');
  const [mintedList, setMintedList] = useState([]);
  const [tokenBalance, setTokenBalance] = useState('?');

  // when account changes, update all state variables
  useEffect(() => {
    (async () => {
      // check is wallet is connected
      if (!address) {
        console.log('user disconnected');
        setSupply('?');
        setMintedList([]);
        setTokenBalance('?');
        return;
      }
      console.log(address);
      // connect wallet
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
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
        signer
      );
      const blankContract = new ethers.Contract(
        Contracts.BlankAddress,
        Contracts.BlankABI,
        signer
      );
      // get supply, minted list, token balance
      const _address = await signer.getAddress();
      const _supply = await blankHoodieContract.totalSupply();
      const _mintedList = (
        await blankHoodieContract.tokensOfOwner(_address)
      ).map((object) => parseInt(object['_hex']), 16);
      const _tokenBalance = Math.round(
        ethers.utils.formatEther(
          await blankContract.balanceOf(await signer.getAddress())
        )
      );
      setSupply(_supply);
      setMintedList(_mintedList);
      setTokenBalance(_tokenBalance);
      console.log('updated both');
    })();
  }, [address]);

  return (
    <AppContext.Provider
      value={{
        supply,
        setSupply,
        mintedList,
        setMintedList,
        address,
        setAddress,
        message,
        setMessage,
        tokenBalance,
        setTokenBalance,
      }}
    >
      <Component {...pageProps} />
    </AppContext.Provider>
  );
};

export default MyApp;
