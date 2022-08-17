import Image from "next/image";
import { useContext, useState } from "react";
import { MessageContext } from "../layout/MessageContext";
import Connector from "../../modules/connector";
import styles from "./SectionMint.module.css";
import Hoodie from "../../public/images/Hoodie.png";
import IconBox from "../../public/images/Icon Box.png";
import IconStars from "../../public/images/Icon Stars.png";
import IconBlank from "../../public/images/Icon Blank.png";

const SectionMint = () => {
  const [amount, setAmount] = useState("1");
  const [supply, setSupply] = useState('?');

  const { setMessage } = useContext(MessageContext)

  // updates total minted supply every 10 seconds
  const updateSupply = async () => {
    if (Connector.getSigner() != undefined) {
      const newSupply = await Connector.getSupply();
      if (newSupply !== supply) {
        setSupply(newSupply);
      }
    }
    setTimeout(updateSupply, 5000);
  };
  updateSupply();

  // changes price based on selected mint amount
  const handleChange = (e) => {
    setAmount(e.target.value);
  };

  // mints nft
  const handleClickMint = async (_amount) => {
    if (Connector.getSigner() == undefined) {
      setMessage([-1, 'Connect wallet to complete the action'])
      return
    }
    await Connector.mint(_amount)
    setMessage([1, 'Minted succesfully'])
  };

  // updating minted amount live

  return (
    <section className={styles.container}>
      <div className={styles.mintMainContainer}>
        <h2 className={styles.headerSecondary}>
          Blank’s <span className='highlight'>Meta-builder</span> Hoodie
        </h2>
        <p className={styles.paragraph}>
          Become a part of our trip to the Metaverse by owning Blank’s
          “Meta-builder” Hoodie NFT.
        </p>

        <div className={styles.mintContainer}>
          <p className={styles.mintContainerParagraph}>Price</p>
          <div className={styles.mintInfoContainer}>
            <h3 className={styles.mintPrice}>
              {Math.round(0.1 * amount * 100) / 100 + " ETH"}
            </h3>
            <div className={styles.mintedAmountContainer}>
              <p className={styles.mintContainerParagraph}>Minted</p>
              <h5 className={styles.mintedAmount}>
                {supply + " / 500"}
              </h5>
            </div>
          </div>
          <div className={styles.mintBtnsContainer}>
            <select
              className={styles.selectAmount}
              name="amount"
              onChange={handleChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
            <button
              className={`${styles.btnMint} btnMain`}
              onClick={() => handleClickMint(amount)}
            >
              Mint
            </button>
          </div>
          <div className={styles.mintAdditionalContainer}>
            <p className={styles.mintAdditionalInfo}>
              Already have your Blank Metabuilder Hoodie NFT?
            </p>
            <p className={styles.mintAdditionalInfoLink}>
              Redeem your real hoodie here!
            </p>
          </div>
        </div>
      </div>
      <div className={styles.imgHoodieContainer}>
        <Image src={Hoodie} width={636} height={636} />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoCard}>
          <div
            className={`${styles.cardImageContainer} ${styles.cardImageBox}`}
          >
            <Image src={IconBox} width={30} height={30} />
          </div>
          <h3 className={styles.cardHeading}>Random NFT airdrops</h3>
          <p>
            Gives you a chance to receive random NFT airdrops of the projects we
            work on to your holder’s wallet.{" "}
          </p>
        </div>
        <div className={styles.infoCard}>
          <div
            className={`${styles.cardImageContainer} ${styles.cardImageBlank}`}
          >
            <Image src={IconStars} width={30} height={30} />
          </div>
          <h3 className={styles.cardHeading}>Blank Drops</h3>
          <p>
            It grants you whitelist access to our future Drops. It grants you
            whitelist access to our future Drops.
          </p>
        </div>
        <div className={styles.infoCard}>
          <div
            className={`${styles.cardImageContainer} ${styles.cardImageStars}`}
          >
            <Image src={IconBlank} width={30} height={30} />
          </div>
          <h3 className={styles.cardHeading}>Real hoodie</h3>
          <p>
            As a holder, you will also receive a real “Meta-builder” hoodie that
            will be shipped directly to your home address.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionMint;
