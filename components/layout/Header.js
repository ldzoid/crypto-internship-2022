import { useRouter } from 'next/router';
import styles from './Header.module.css';

const Header = (props) => {
  const router = useRouter();
  const path = router.asPath;

  return (
    <div className={styles.container}>
      <h1 className={`${styles.header2022} ${path == '/' ? '' : 'hidden'}`}>
        2022
      </h1>
      <h1 className={styles.header}>{props.title}</h1>
      <p className={styles.subtitle}>{props.subtitle}</p>
    </div>
  );
};

export default Header;
