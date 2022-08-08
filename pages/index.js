import Head from 'next/head'
import Image from 'next/image'
import Hoodie from '../public/images/Hoodie.png'
import styles from '../styles/home.module.css'
import utils from '../styles/utils.module.css'

const Home = () => {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Lobster&display=swap"
          rel="stylesheet"
        />
      </Head>
      <section className={styles.sectionMint}>
        <div>
          <h2 className={utils.headerSecondary}>Blank’s<br /><span className={utils.highlight}>Meta-builder</span><br />Hoodie</h2>
          <p className={utils.paragraph}>Become a part of our trip to the Metaverse by owning <br /> Blank’s “Meta-builder” Hoodie NFT.</p>
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
              <button className={styles.btnAmount}></button>
              <button className={`${styles.btnMint} ${utils.btnMain}`}>Mint</button>
            </div>
          </div>
        </div>
        <div className={styles.imgHoodieContainer}><Image src={Hoodie} width={636} height={636} /></div>
        <div></div>
      </section>
      <section className={styles.sectionMinted}>minted</section>
    </>
  );
};

export default Home;
