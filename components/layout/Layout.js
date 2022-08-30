import Head from 'next/head';
import Header from './Header';
import MainNavigation from './MainNavigation';
import Message from './Message';
import styles from './Layout.module.css';

const Layout = (props) => {
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
      <div className={styles.container}>
        <MainNavigation />
        <Header title={props.title} subtitle={props.subtitle} />
      </div>
      <main className={styles.main}>{props.children}</main>
      <Message />
    </>
  );
};

export default Layout;
