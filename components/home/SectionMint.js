import Image from "next/image";
import utils from "../../styles/utils.module.css";
import styles from "./SectionMint.module.css";
import Hoodie from "../../public/images/Hoodie.png";
import IconBox from "../../public/images/Icon Box.png";
import IconStars from "../../public/images/Icon Stars.png";
import IconBlank from "../../public/images/Icon Blank.png";

const SectionMint = () => {
  return (
    <section className={styles.container}>
      <div className={styles.mintMainContainer}>
        <h2 className={utils.headerSecondary}>
          Blank’s
          <br />
          <span className={utils.highlight}>Meta-builder</span>
          <br />
          Hoodie
        </h2>
        <p className={utils.paragraph}>
          Become a part of our trip to the Metaverse by owning <br /> Blank’s
          “Meta-builder” Hoodie NFT.
        </p>
        <div className={styles.mintContainer}>
          <p className={styles.mintContainerParagraph}>Price</p>
          <div className={styles.mintInfoContainer}>
            <h3 className={styles.mintPrice}>0.1 ETH</h3>
            <div className={styles.mintedAmountContainer}>
              <p className={styles.mintContainerParagraph}>Minted</p>
              <h5 className={styles.mintedAmount}>63 / 500</h5>
            </div>
          </div>
          <div className={styles.mintBtnsContainer}>
            <select className={styles.selectAmount} name="amount">
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
            <button className={`${styles.btnMint} ${utils.btnMain}`}>
              Mint
            </button>
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
