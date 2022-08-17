import { useState } from 'react';
import MintedCard from './MintedCard';
import Connector from '../../modules/connector';
import styles from './SectionMinted.module.css';

const SectionMinted = () => {
  const [walletList, setWalletList] = useState([]);

  const updateList = async () => {
    if (Connector.getSigner() != undefined) {
      const newWalletList = await Connector.getTokensOfSigner();
      if (JSON.stringify(newWalletList) != JSON.stringify(walletList)) {
        setWalletList(newWalletList);
      }
    }
    setTimeout(updateList, 10000);
  };
  updateList();

  return (
    <section className={styles.container}>
      <h1 className={styles.headerSecondary}>Minted NFTs</h1>
      <div className={styles.mintedListContainer}>
        {walletList.map((_id) => (
          <MintedCard id={_id} key={_id} />
        ))}
      </div>
    </section>
  );
};

export default SectionMinted;
