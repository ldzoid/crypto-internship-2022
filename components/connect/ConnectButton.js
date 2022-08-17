import Image from "next/image";
import { useContext } from "react";
import { AddressContext } from "../layout/AddressContext";
import { MessageContext } from '../layout/MessageContext'
import Connector from "../../modules/connector";
import styles from './ConnectButton.module.css'
import Metamask from '../../public/images/Metamask.png'

const ConnectButton = () => {

  const { setAddress } = useContext(AddressContext)
  const { setMessage } = useContext(MessageContext)

  const handleClick = async () => {
    // connect to Metamask
    await Connector.connectMetamask()
    setAddress(await Connector.getAddress())
    setMessage([1, 'Connected successfully'])
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
