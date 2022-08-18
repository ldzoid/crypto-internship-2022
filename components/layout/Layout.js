import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Header from './Header';
import MainNavigation from './MainNavigation';
import Message from './Message';
import { AddressContext } from './AddressContext';
import { MessageContext } from './MessageContext';
import styles from './Layout.module.css';

const Layout = (props) => {
  const [address, setAddress] = useState(null);
  const [message, setMessage] = useState([0, '']); // 0 - defaut, 1 - success, -1 - error

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
      subtitle = 'Stake your NFTs so you can later unstake them here as well';
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
        <MessageContext.Provider value={{ message, setMessage }}>
          <AddressContext.Provider value={{ address, setAddress }}>
            <div className={styles.container}>
              <MainNavigation />
              <main className={`${styles.main} ${styles.connectMain}`}>
                {props.children}
              </main>
              <Message />
            </div>
          </AddressContext.Provider>
        </MessageContext.Provider>
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
      <MessageContext.Provider value={{ message, setMessage }}>
        <AddressContext.Provider value={{ address, setAddress }}>
          <div className={styles.container}>
            <MainNavigation />
            <Header title={title} subtitle={subtitle} home={homePage} />
          </div>
          <main className={styles.main}>{props.children}</main>
          <Message />
        </AddressContext.Provider>
      </MessageContext.Provider>
    </>
  );
};

export default Layout;
