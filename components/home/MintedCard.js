import Image from 'next/image';
import styles from './MintedCard.module.css';
import Hoodie from '../../public/images/hoodie.png';

const MintedCard = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.cardImage}>
        <Image src={Hoodie} width={240} height={270} />
      </div>
      <p className={styles.cardParagraph}>Hoodie #{props.id}</p>
    </div>
  );
};

export default MintedCard;
