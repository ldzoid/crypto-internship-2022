import Image from "next/image";
import styles from './ConnectButton.module.css'
import Metamask from '../../public/images/Metamask.png'

const ConnectButton = () => {
  return (
    <>
      <button className={styles.button}>
        <Image src={Metamask} width={100} height={100} className={styles.image} />
      </button>
    </>
  );
};

export default ConnectButton;
