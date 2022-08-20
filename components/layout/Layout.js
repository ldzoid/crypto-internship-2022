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

  useEffect(() => {
    (async () => {
      // if address is connected
      if (address) {
        console.log(address)
        // update minted list and supply
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send('eth_requestAccounts', []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          Connector.BlankHoodieAddress,
          Connector.BlankHoodieABI,
          signer
        );
        // get supply and minted list
        const _address = await signer.getAddress();
        const _supply = await contract.totalSupply();
        const _mintedList = (await contract.tokensOfOwner(_address)).map(
          (object) => parseInt(object['_hex']),
          16
        );
        setSupply(_supply);
        setMintedList(_mintedList);
        console.log('updated both');
      } else {
        console.log('user disconnected');
        setSupply('?');
        setMintedList([]);
      }
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
