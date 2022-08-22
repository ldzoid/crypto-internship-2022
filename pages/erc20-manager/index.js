import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { LayoutContext } from '../../components/layout/LayoutContext';
import Connector from '../../modules/connector';
import Utils from '../../modules/utils';
import styles from '../../styles/erc20-manager.module.css';

const Erc20Manger = () => {
  const { address, setMessage, tokenBalance, setTokenBalance } =
    useContext(LayoutContext);

  const [addressToSend, setAddressToSend] = useState();
  const [amountToSend, setAmountToSend] = useState();

  const handleClickSend = async () => {
    // check if wallet is connected
    if (!address) {
      setMessage([-1, 'Connect wallet to complete the action']);
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    // check if chain is correct
    const { chainId } = await provider.getNetwork();
    if (chainId != 5) {
      setMessage([-1, 'Please switch network to Goerli testnet']);
      return;
    }
    // check if amount is valid
    if (!Utils.isPositiveInteger(amountToSend)) {
      setMessage([-1, 'Please enter a valid number']);
      return;
    }
    // check if address is valid
    if (!Utils.isValidAddress(addressToSend)) {
      setMessage([-1, 'Please enter a valid address']);
      return;
    }
    // check if amount is less than or equal to balance
    if (!(parseInt(amountToSend) <= tokenBalance)) {
      setMessage([-1, "You don't own enough tokens"]);
      return;
    }
    // initialize contract
    const blankContract = new ethers.Contract(
      Connector.BlankAddress,
      Connector.BlankABI,
      signer
    );
    // send transaction
    try {
      const tx = await blankContract.transfer(
        addressToSend,
        ethers.utils.parseEther(`${amountToSend}`)
      );
      await tx.wait()
      setMessage([1, `Successfully transferred ${amountToSend} BLANK tokens`]);
      // update new balance
      const _tokenBalance = Math.round(
        ethers.utils.formatEther(
          await blankContract.balanceOf(await signer.getAddress())
        )
      );
      setTokenBalance(_tokenBalance);
    } catch (e) {
      setMessage([-1, 'Error occurred']);
      console.log(e);
    }
  };

  const handleClickImport = async () => {
    // check if wallet is connected
    if (!address) {
      setMessage([-1, 'Connect wallet to complete the action']);
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    // check if chain is correct
    const { chainId } = await provider.getNetwork();
    if (chainId != 5) {
      setMessage([-1, 'Please switch network to Goerli testnet']);
      return;
    }
    try {
      await provider.send('wallet_watchAsset', Connector.blankObject);
    } catch (e) {
      setMessage([-1, 'Error occured']);
      console.error(e);
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
      <button className={styles.btnImportToken} onClick={handleClickImport}>
        Import token to MetaMask
      </button>
    </div>
  );
};

export default Erc20Manger;
