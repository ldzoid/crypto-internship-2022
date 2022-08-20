import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { LayoutContext } from '../../components/layout/LayoutContext';
import Connector from '../../modules/connector';
import Utils from '../../modules/utils';
import styles from '../../styles/erc20-manager.module.css';

const Erc20Manger = (props) => {
  const { address, setMessage, tokenBalance, setTokenBalance } =
    useContext(LayoutContext);

  const [addressToSend, setAddressToSend] = useState();
  const [amountToSend, setAmountToSend] = useState();

  const handleClickSend = async () => {
    // get amount
    if (address) {
      // check if amount is valid
      if (Utils.isPositiveInteger(amountToSend)) {
        // check if address is valid
        if (Utils.isValidAddress(addressToSend)) {
          // check if amount is less than or equal to balance
          if (parseInt(amountToSend) <= tokenBalance) {
            // initialize contract
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = await provider.getSigner();
            const blankContract = new ethers.Contract(
              Connector.BlankAddress,
              Connector.BlankABI,
              signer
            );
            // send transaction
            try {
              await blankContract.transfer(addressToSend, amountToSend);
              setMessage([
                1,
                `Successfully transferred ${amountToSend} BLANK tokens`,
              ]);
              // update new balance
              const _tokenBalance = parseInt(
                (await blankContract.balanceOf(await signer.getAddress()))[
                  '_hex'
                ],
                16
              );
              setTokenBalance(_tokenBalance);
            } catch (e) {
              console.log(e);
              setMessage([-1, 'Error occurred']);
            }
          } else {
            setMessage([-1, "You don't own enough tokens"]);
          }
        } else {
          setMessage([-1, 'Please enter a valid address']);
        }
      } else {
        setMessage([-1, 'Please enter a valid number']);
      }
    } else {
      setMessage([-1, 'Connect wallet to complete the action']);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.erc20InfoContainer}>
        <h3 className={styles.erc20InfoTitle}>Blank tokens</h3>
        <h2 className={styles.erc20InfoBalance}>{tokenBalance}</h2>
      </div>
      <div className={styles.lineBreak}></div>
      <div className={styles.sendTokensInputContainer}>
        <label className={styles.inputLabel}>Amount</label>
        <input
          className={styles.input}
          type="text"
          name="amount"
          placeholder="Tokens to send"
          onChange={(e) => {
            setAmountToSend(e.target.value);
          }}
        ></input>
      </div>
      <div className={styles.sendTokensInputContainer}>
        <label className={styles.inputLabel}>Recipient</label>
        <input
          className={styles.input}
          type="text"
          name="amount"
          placeholder="Insert recipient address"
          onChange={(e) => {
            setAddressToSend(e.target.value);
          }}
        ></input>
      </div>
      <button className={`btnMain ${styles.btnSend}`} onClick={handleClickSend}>
        Send
      </button>
    </div>
  );
};

export default Erc20Manger;
