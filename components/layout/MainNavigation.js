import Image from 'next/image'
import Link from 'next/link'

import CompanyLogo from '../../public/images/Company Logo.png'

import styles from "./MainNavigation.module.css";
import utils from '../../styles/utils.module.css'

const MainNavigation = () => {
  return (
  <div className={styles.container}>
    <div className={styles.imgLogoContainer}><Image src={CompanyLogo} width={85} height={16}></Image></div>
    <div className={styles.linksContainer}>
      <Link href='/'>Home</Link>
      <Link href='/'>Stake</Link>
      <Link href='/'>ERC20 Manager</Link>
      <button className={`${utils.btnMain} ${styles.btnConnect}`}>Connect wallet</button>
    </div>
  </div>
  );
};

export default MainNavigation;
