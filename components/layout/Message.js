import Image from 'next/image';
import { useContext } from 'react';
import { LayoutContext } from './LayoutContext';
import Success from '../../public/images/Success.png';
import Warning from '../../public/images/Warning.png';
import Loader from '../../public/images/Loader.png'
import styles from './Message.module.css';

const Message = () => {
  // message states - 0: hidden, 1: success, -1: error, 2: loading

  const { message, setMessage } = useContext(LayoutContext);
  const messageState = message[0];
  const messageText = message[1];

  if (messageState == 0) {
    return;
  } else {
    return (
      <div className={styles.blurContainer}>
        <div className={styles.container}>
          <Image
            src={messageState == -1 ? Warning : Success }
            width={48}
            height={48}
          ></Image>
          <h1 className={styles.message}>{messageText}</h1>
          <button
            className={`${styles.btn} btnMain`}
            onClick={
              messageState == 2
                ? () => {}
                : () => {
                    setMessage([0, '']);
                  }
            }
          >
            {messageState == 2 ? <Image className={styles.imgLoader} src={Loader} width={32} height={32}></Image> : 'Okay'}
          </button>
        </div>
      </div>
    );
  }
};

export default Message;
