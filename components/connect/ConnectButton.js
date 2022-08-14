import Image from "next/image";
import styles from './ConnectButton.module.css'
import Connector from "../../modules/connector";
import Metamask from '../../public/images/Metamask.png'

const ConnectButton = () => {

  const handleClick = () => {
    // connect to Metamask
    Connector.connectMetamask()
  }

  return (
    <>
      <button className={styles.button} onClick={handleClick}>
        <Image src={Metamask} width={100} height={100} className={styles.image} />
      </button>
    </>
  );
};

export default ConnectButton;
