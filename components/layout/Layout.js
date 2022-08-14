import Head from "next/head";
import MainNavigation from "./MainNavigation";
import Header from "./Header";
import { useRouter } from "next/router";
import styles from "./Layout.module.css";
import { AddressContext } from "./AddressContext";
import { useState } from "react";

const Layout = (props) => {

  const [address, setAddress] = useState(null)

  // get url
  const router = useRouter();
  const path = router.asPath;
  let title = "";
  let connectLayout = false;

  // based on url change website header
  switch (path) {
    case "/":
      title = "Blank\nCrypto\nInternship";
      break;
    case "/connect":
      title = "";
      connectLayout = true;
      break;
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
        <AddressContext.Provider value={{address, setAddress}}>
          <div className={styles.container}>
            <MainNavigation />
            <main className={`${styles.main} ${styles.connectMain}`}>
              {props.children}
            </main>
          </div>
        </AddressContext.Provider>
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
      <AddressContext.Provider value={{address, setAddress}}>
        <div className={styles.container}>
          <MainNavigation />
          <Header title={title} />
        </div>
        <main className={styles.main}>{props.children}</main>
      </AddressContext.Provider>
    </>
  );
};

export default Layout;
