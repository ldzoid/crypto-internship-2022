import Image from 'next/image'
import Link from 'next/link'
import CompanyLogo from '../../public/images/Company Logo.png'
import Burger from '../../public/images/Burger.png'
import styles from "./MainNavigation.module.css";
import utils from '../../styles/utils.module.css'
import { useState } from 'react';

const MainNavigation = () => {

  let [expanded, setExpanded] = useState(false)

  return (
  <div className={styles.container}>
    <div className={styles.imgLogoContainer}><Image src={CompanyLogo} width={85} height={16}></Image></div>
    <div className={`${styles.linksContainer} ${expanded ? styles.expanded : styles.hidden}`}>
      <Link href='/'>Home</Link>
      <Link href='/'>Stake</Link>
      <Link href='/'>ERC20 Manager</Link>
      <button className={`${utils.btnMain} ${styles.btnConnect}`}>Connect wallet</button>
    </div>
    <button className={styles.btnBurger} onClick={() => {setExpanded(!expanded)}}><Image src={Burger} width={32} height={16} /></button>
  </div>
  );
};

export default MainNavigation;
