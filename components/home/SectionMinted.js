import MintedCard from './MintedCard';
import utils from '../../styles/utils.module.css'
import styles from './SectionMinted.module.css'

const SectionMinted = () => {
  return (
    <section className={styles.container}>
      <h1 className={utils.headerSecondary}>Minted NFTs</h1>
      <div className={styles.mintedListContainer}>
        <MintedCard id={123} />
        <MintedCard id={1765} />
        <MintedCard id={1342} />
      </div>
    </section>
  );
};

export default SectionMinted;
