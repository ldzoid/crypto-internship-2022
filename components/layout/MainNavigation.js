import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import styles from './MainNavigation.module.css';
import CompanyLogo from '../../public/images/company-logo.png';
import Burger from '../../public/images/burger.png';

const MainNavigation = () => {
  const [expanded, setExpanded] = useState(false);

  const { account, setAccount, provider, setMessage } = useContext(AppContext);

  const router = useRouter();

  const handleClickConnect = () => {
    router.push('/connect');
  };

  const handleClickDisconnect = async () => {
    if (provider?.close) {
      await provider.close();
    } else {
      setAccount('');
    }
    setMessage([1, 'Disconnected successfully'])
  };

  const handleClickLink = () => {
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
          <button className={styles.btnLink} onClick={handleClickLink}>
            Home
          </button>
        </Link>
        <Link href="/stake">
          <button className={styles.btnLink} onClick={handleClickLink}>
            Stake
          </button>
        </Link>
        <Link href="/erc20-manager">
          <button className={styles.btnLink} onClick={handleClickLink}>
            ERC20 Manager
          </button>
        </Link>
        <button
          className={`btnMain ${styles.btnConnect}`}
          onClick={account ? handleClickDisconnect : handleClickConnect}
        >
          {account ? (
            <>
              <h4>Disconnect</h4>
              <h5>{account.slice(0, 7) + '...' + account.slice(-4)}</h5>
            </>
          ) : (
            'Connect wallet'
          )}
        </button>
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
