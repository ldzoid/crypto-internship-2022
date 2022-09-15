import MintedCard from '../home/MintedCard';
import styles from './StakeCard.module.css';

const StakeCard = (props) => {
  return (
    <div className={styles.container}>
      <MintedCard id={props.id} />
      <button className={styles.btn} onClick={() => props.btnClick(props.id)}>
        {props.btnText}
      </button>
    </div>
  );
};

export default StakeCard;
