import Image from "next/image";
import styles from './ConnectButton.module.css'
import Connector from "../../modules/connector";
import Metamask from '../../public/images/Metamask.png'
import { useContext } from "react";
import { AddressContext } from "../layout/AddressContext";

const ConnectButton = () => {

  const { setAddress } = useContext(AddressContext)

  const handleClick = async () => {
    // connect to Metamask
    await Connector.connectMetamask()
    setAddress(await Connector.getAddress())
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
