import { ethers } from 'ethers';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Header from './Header';
import MainNavigation from './MainNavigation';
import Message from './Message';
import { LayoutContext } from './LayoutContext';
import Connector from '../../modules/connector';
import styles from './Layout.module.css';

const Layout = (props) => {
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState([0, '']); // 0 - defaut, 1 - success, -1 - error
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
        Connector.BlankHoodieAddress,
        Connector.BlankHoodieABI,
        signer
      );
      const blankContract = new ethers.Contract(
        Connector.BlankAddress,
        Connector.BlankABI,
        signer
      );
      // get supply, minted list, token balance
      const _address = await signer.getAddress();
      const _supply = await blankHoodieContract.totalSupply();
      const _mintedList = (
        await blankHoodieContract.tokensOfOwner(_address)
      ).map((object) => parseInt(object['_hex']), 16);
      const _tokenBalance = Math.round(ethers.utils.formatEther(
        await blankContract.balanceOf(await signer.getAddress())
      ));
      setSupply(_supply);
      setMintedList(_mintedList);
      setTokenBalance(_tokenBalance);
      console.log('updated both');
    })();
  }, [address]);

  // get url
  const router = useRouter();
  const path = router.asPath;
  let title = '';
  let subtitle = '';
  let homePage = true;
  let connectLayout = false;

  // based on url change website header
  switch (path) {
    case '/':
      title = 'Blank\nCrypto\nInternship';
      subtitle = '';
      homePage = true;
      connectLayout = false;
      break;
    case '/connect':
      title = '';
      subtitle = '';
      homePage = false;
      connectLayout = true;
      break;
    case '/erc20-manager':
      title = 'ERC20';
      subtitle =
        'Manage your BLANK tokens, you can get more tokens for staking your NFT';
      homePage = false;
      connectLayout = false;
      break;
    case '/stake':
      title = 'Stake';
      subtitle = 'Stake your NFTs so you can later unstake them here as well';
      homePage = false;
      connectLayout = false;
  }

  // if it's connect website, all content is inside layout header,
  // for all other websites title is passed as header and content is below
  if (connectLayout) {
    return (
      <>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Lobster&display=swap"
            rel="stylesheet"
          />
        </Head>
        <LayoutContext.Provider
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
          <div className={styles.container}>
            <MainNavigation />
            <main className={`${styles.main} ${styles.connectMain}`}>
              {props.children}
            </main>
            <Message />
          </div>
        </LayoutContext.Provider>
      </>
    );
  }
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Lobster&display=swap"
          rel="stylesheet"
        />
      </Head>
      <LayoutContext.Provider
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
        <div className={styles.container}>
          <MainNavigation />
          <Header title={title} subtitle={subtitle} home={homePage} />
        </div>
        <main className={styles.main}>{props.children}</main>
        <Message />
      </LayoutContext.Provider>
    </>
  );
};

export default Layout;
