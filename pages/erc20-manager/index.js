import styles from '../../styles/erc20-manager.module.css';

const Erc20Manger = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.erc20InfoContainer}>
        <h3 className={styles.erc20InfoTitle}>Blank tokens</h3>
        <h2 className={styles.erc20InfoBalance}>1312</h2>
      </div>
      <div className={styles.lineBreak}></div>
      <div className={styles.sendTokensInputContainer}>
        <label className={styles.inputLabel}>Amount</label>
        <input
        className={styles.input}
          type="text"
          name="amount"
          placeholder="Tokens to send"
        ></input>
      </div>
      <div className={styles.sendTokensInputContainer}>
        <label className={styles.inputLabel}>Recipient</label>
        <input
        className={styles.input}
          type="text"
          name="amount"
          placeholder="Insert recipient address"
        ></input>
      </div>
      <button className={`btnMain ${styles.btnSend}`}>Send</button>
    </div>
  );
};

export default Erc20Manger;
