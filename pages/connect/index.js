import Head from 'next/head';
import ConnectButton from '../../components/connect/ConnectButton';
import ConnectLayout from '../../components/layout/ConnectLayout';
import styles from '../../styles/connect.module.css';

const Connect = () => {
  return (
    <>
      <Head>
        <title>Blank NFT | Connect</title>
      </Head>
      <ConnectLayout>
        <div className={styles.container}>
          <div className={styles.textContainer}>
            <h1 className={styles.headerMain}>Connect wallet</h1>
            <p className={styles.paragraph}>
              Connect your wallet to use full features of the site placeholder text lorem ipsum sit
            </p>
          </div>
          <ConnectButton />
        </div>
      </ConnectLayout>
    </>
  );
};

export default Connect;
