import Link from 'next/link';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import StakeCard from './StakeCard';
import styles from './SectionStakeList.module.css';

const SectionStakeList = (props) => {
  const { account } = useContext(AppContext);

  return (
    <section className={styles.container}>
      <h2 className={styles.headerSecondary}>{props.title}</h2>
      <div className={styles.stakedListContainer}>
        {account ? (
          props.list.length > 0 ? (
            props.list.map((_id) => (
              <StakeCard id={_id} btnText={props.btnText} btnClick={props.btnClick} key={_id} />
            ))
          ) : (
            <h2 className={styles.stakedListInfoParagraph}>{`You have no ${props.title}`}</h2>
          )
        ) : (
          <Link href="/connect">
            <h2 className={styles.linkConnect}>Connect wallet to see your NFTs</h2>
          </Link>
        )}
      </div>
    </section>
  );
};

export default SectionStakeList;
