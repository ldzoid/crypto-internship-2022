import ConnectButton from '../../components/connect/ConnectButton';
import styles from '../../styles/connect.module.css';

const Connect = (props) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.textContainer}>
          <h1 className={styles.headerMain}>Connect wallet</h1>
          <p className={styles.paragraph}>
            Connect your wallet to use full features of the site placeholder
            text lorem ipsum sit
          </p>
        </div>
        <ConnectButton />
      </div>
    </>
  );
};

export default Connect;
