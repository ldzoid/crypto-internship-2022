import StakeCard from './StakeCard';
import styles from './SectionStakeList.module.css';

const SectionStakeList = (props) => {

  return (
    <section className={styles.container}>
      <h2 className={styles.headerSecondary}>{props.title}</h2>
      <div className={styles.stakedListContainer}>
        {props.list.map(_id => (
          <StakeCard id={_id} btnText={props.btnText} btnClick={props.btnClick} key={_id} />
        ))}
      </div>
    </section>
  );
};

export default SectionStakeList;
