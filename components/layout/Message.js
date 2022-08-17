import Image from 'next/image';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { MessageContext } from './MessageContext';
import styles from './Message.module.css';
import Success from '../../public/images/Success.png';
import Warning from '../../public/images/Warning.png';

const Message = () => {
  const { message, setMessage } = useContext(MessageContext);
  const messageState = message[0];
  const messageText = message[1];

  if (messageState == 0) {
    return;
  } else {
    return (
      <div className={styles.container}>
        <Image
          src={messageState == 1 ? Success : Warning}
          width={48}
          height={48}
        ></Image>
        <h1 className={styles.message}>{messageText}</h1>
        <button
          className={`${styles.btn} btnMain`}
          onClick={() => {setMessage([0, ''])}}
        >
          Okay
        </button>
      </div>
    );
  }
};

export default Message;
