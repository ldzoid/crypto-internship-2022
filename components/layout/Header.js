import styles from './Header.module.css';

const Header = (props) => {
  return (
    <div className={styles.container}>
      <h1 className={`${styles.header2022} ${props.home ? '' : 'hidden'}`}>2022</h1>
      <h1 className={styles.header}>{props.title}</h1>
      <p className={styles.subtitle}>{props.subtitle}</p>
    </div>
  );
};

export default Header;
