import { ethers } from 'ethers';
import Image from 'next/image';
import { useContext, useState } from 'react';
import Connector from '../../modules/connector';
import styles from './SectionMint.module.css';
import Hoodie from '../../public/images/Hoodie.png';
import IconBox from '../../public/images/Icon Box.png';
import IconStars from '../../public/images/Icon Stars.png';
import IconBlank from '../../public/images/Icon Blank.png';
import { LayoutContext } from '../layout/LayoutContext';

const SectionMint = () => {
  const [amount, setAmount] = useState('1');

  const { supply, setSupply, address, setMessage } = useContext(LayoutContext);

  const handleClickMint = async (_amount) => {
    // check is wallet is connected
    if (!address) {
      setMessage([-1, 'Connect wallet to complete the action']);
      return;
    }
    // get provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    // check if chain is correct
    const { chainId } = await provider.getNetwork()
    if (chainId != 5) {
      setMessage([-1, 'Please switch network to Goerli testnet'])
      return
    }
    // initialize blankHoodieContract
    const blankHoodieContract = new ethers.Contract(
      Connector.BlankHoodieAddress,
      Connector.BlankHoodieABI,
      signer
    );
    // check if max supply is reached, not enough balance
    if (
      parseInt((await blankHoodieContract.totalSupply())['_hex'], 16) +
        parseInt(_amount) >
      500
    ) {
      setMessage([-1, 'Max supply is exceeded']);
      return;
    }
    // check if user has enough balance
    if (
      ethers.utils.formatEther(
        await provider.getBalance(await signer.getAddress())
      ) <
      0.1 * parseInt(_amount)
    ) {
      setMessage([-1, "You don't have enough Ether"]);
      return;
    }
    // send transaction
    try {
      const txObject = {
        value: ethers.utils.parseEther(`${0.1 * _amount}`),
      };
      await blankHoodieContract.mint(_amount, txObject);
      setMessage([1, 'Minted succesfully']);
      // update supply
      const _supply = await blankHoodieContract.totalSupply();
      setSupply(_supply);
    } catch {
      setMessage([-1, 'Error occurred']);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.mintMainContainer}>
        <h2 className={styles.headerSecondary}>
          Blank’s <span className="highlight">Meta-builder</span> Hoodie
        </h2>
        <p className={styles.paragraph}>
          Become a part of our trip to the Metaverse by owning Blank’s
          “Meta-builder” Hoodie NFT.
        </p>

        <div className={styles.mintContainer}>
          <p className={styles.mintContainerParagraph}>Price</p>
          <div className={styles.mintInfoContainer}>
            <h3 className={styles.mintPrice}>
              {Math.round(0.1 * amount * 100) / 100 + ' ETH'}
            </h3>
            <div className={styles.mintedAmountContainer}>
              <p className={styles.mintContainerParagraph}>Minted</p>
              <h5 className={styles.mintedAmount}>{supply + ' / 500'}</h5>
            </div>
          </div>
          <div className={styles.mintBtnsContainer}>
            <select
              className={styles.selectAmount}
              name="amount"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
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
            work on to your holder’s wallet.{' '}
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
