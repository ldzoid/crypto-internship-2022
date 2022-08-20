import { useContext } from 'react';
import MintedCard from './MintedCard';
import styles from './SectionMinted.module.css';
import { LayoutContext } from '../layout/LayoutContext';

const SectionMinted = () => {

  const { mintedList } = useContext(LayoutContext)

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
