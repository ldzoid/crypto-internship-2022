import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import styles from './MainNavigation.module.css';
import CompanyLogo from '../../public/images/company-logo.png';
import Burger from '../../public/images/burger.png';

const MainNavigation = () => {
  const [expanded, setExpanded] = useState(false);

  const { account } = useContext(AppContext);

  const handleClick = () => {
    setExpanded(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.imgLogoContainer}>
        <Image src={CompanyLogo} width={85} height={16}></Image>
      </div>
      <div
        className={`${styles.linksContainer} ${
          expanded ? styles.expanded : styles.hidden
        }`}
      >
        <Link href="/">
          <button className={styles.btnLink} onClick={handleClick}>
            Home
          </button>
        </Link>
        <Link href="/stake">
          <button className={styles.btnLink} onClick={handleClick}>
            Stake
          </button>
        </Link>
        <Link href="/erc20-manager">
          <button className={styles.btnLink} onClick={handleClick}>
            ERC20 Manager
          </button>
        </Link>
        <Link href="/connect">
          <button
            className={`btnMain ${styles.btnConnect}`}
            onClick={handleClick}
          >
            {account
              ? account.slice(0, 7) + '...' + account.slice(-4)
              : 'Connect wallet'}
          </button>
        </Link>
      </div>
      <button
        className={styles.btnBurger}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        <Image src={Burger} width={32} height={16} />
      </button>
    </div>
  );
};

export default MainNavigation;
