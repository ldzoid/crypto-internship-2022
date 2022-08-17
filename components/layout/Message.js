import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { MessageContext } from "./MessageContext";
import styles from "./Message.module.css";
import Success from "../../public/images/Success.png";
import Warning from "../../public/images/Warning.png";

const Message = () => {
  const router = useRouter();
  const { message, setMessage } = useContext(MessageContext);
  const messageState = message[0];
  const messageText = message[1];

  const handleClickOkay = () => {
    setMessage([0, ""]);
  };

  const handleClickConnect = () => {
    setMessage([0, ""]);
    router.push("/connect");
  };

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
          onClick={messageState == 1 ? handleClickOkay : handleClickConnect}
        >
          {messageState == 1 ? "Okay" : "Connect wallet"}
        </button>
      </div>
    );
  }
};

export default Message;
