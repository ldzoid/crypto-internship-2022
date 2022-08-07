import utils from "../../styles/utils.module.css";

const Welcome = (props) => {
  return (
    <>
      <h1 className={utils.headerMain}>{props.title}</h1>
    </>
  );
};

export default Welcome;
