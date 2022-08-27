import { useContext } from 'react';
import MintedCard from './MintedCard';
import styles from './SectionMinted.module.css';
import { AppContext } from '../context/AppContext';

const SectionMinted = () => {
  const { mintedList } = useContext(AppContext);

  return (
    <section className={styles.container}>
      <h1 className={styles.headerSecondary}>Minted NFTs</h1>
      <div className={styles.mintedListContainer}>
        {mintedList.map((_id) => (
          <MintedCard id={_id} key={_id} />
        ))}
      </div>
    </section>
  );
};

export default SectionMinted;
