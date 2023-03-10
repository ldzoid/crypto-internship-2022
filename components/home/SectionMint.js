import { ethers } from 'ethers';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import styles from './SectionMint.module.css';
import Hoodie from '../../public/images/hoodie.png';
import IconBox from '../../public/images/icon-box.png';
import IconStars from '../../public/images/icon-stars.png';
import IconBlank from '../../public/images/icon-blank.png';
import DownArrow from '../../public/images/down-arrow.png';

const SectionMint = () => {
  const { account, provider, signer, chainId, setMessage, nftContract } = useContext(AppContext);

  const [supply, setSupply] = useState('?');
  const [amount, setAmount] = useState('1');
  const [expanded, setExpanded] = useState(false);

  // update supply when account changes
  useEffect(() => {
    (async () => {
      // check if user disconnected or on wrong network
      if (!account || chainId != 5) {
        setSupply('?');
        return;
      }
      // get supply
      const supply = await nftContract.totalSupply();
      // update supply
      setSupply(supply);
    })();
  }, [account]);

  const handleClickMint = async (_amount) => {
    // check if wallet is connected
    if (!account) {
      setMessage([-1, 'Connect wallet to complete the action']);
      return;
    }
    // check if chain is correct
    if (chainId != 5) {
      setMessage([-1, 'Please switch network to Goerli testnet']);
      // suggest user to switch network
      try {
        await provider.send('wallet_switchEthereumChain', [
          {
            chainId: '0x5',
          },
        ]);
      } catch (err) {
        console.error(err);
      }
      return;
    }
    // check if max supply is reached, not enough balance
    if (Number(await nftContract.totalSupply()) + parseInt(_amount) > 500) {
      setMessage([-1, 'Max supply is exceeded']);
      return;
    }
    // check if user has enough balance
    if (
      ethers.utils.formatEther(await provider.getBalance(await signer.getAddress())) <
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
      const tx = await nftContract.mint(_amount, txObject);
      setMessage([2, 'Please wait transaction confirmation']);
      await tx.wait();
      setMessage([1, 'Minted succesfully']);
      // update supply
      const _supply = await nftContract.totalSupply();
      setSupply(_supply);
    } catch (err) {
      setMessage([-1, 'Error occurred']);
      console.error(err);
    }
  };

  const handleClickOption = (e) => {
    setAmount(e.target.dataset.value);
  };

  return (
    <section className={styles.container}>
      <div className={styles.mintMainContainer}>
        <h2 className={styles.headerSecondary}>
          Blank???s <span className="highlight">Meta-builder</span> Hoodie
        </h2>
        <p className={styles.paragraph}>
          Become a part of our trip to the Metaverse by owning Blank???s ???Meta-builder??? Hoodie NFT.
        </p>

        <div className={styles.mintContainer}>
          <p className={styles.mintContainerParagraph}>Price</p>
          <div className={styles.mintInfoContainer}>
            <h3 className={styles.mintPrice}>{Math.round(0.1 * amount * 100) / 100 + ' ETH'}</h3>
            <div className={styles.mintedAmountContainer}>
              <p className={styles.mintContainerParagraph}>Minted</p>
              <h5 className={styles.mintedAmount}>{supply + ' / 500'}</h5>
            </div>
          </div>
          <div className={styles.mintBtnsContainer}>
            <div
              className={styles.selectAmount}
              onClick={(e) => {
                setExpanded(!expanded);
              }}
            >
              <div className={styles.selectOptionDefault}>
                <p>{amount}</p>
                <Image src={DownArrow} width={16} height={16}></Image>
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="1"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '1' : ''}
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="2"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '2' : ''}
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="3"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '3' : ''}
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="4"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '4' : ''}
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="5"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '5' : ''}
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="6"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '6' : ''}
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="7"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '7' : ''}
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="8"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '8' : ''}
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="9"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '9' : ''}
              </div>
              <div
                onClick={(e) => handleClickOption(e)}
                data-value="10"
                className={`${styles.selectOption} ${expanded ? styles.expanded : ''}`}
              >
                {expanded ? '10' : ''}
              </div>
            </div>
            <button className={`${styles.btnMint} btnMain`} onClick={() => handleClickMint(amount)}>
              Mint
            </button>
          </div>
          <div className={styles.mintAdditionalContainer}>
            <p className={styles.mintAdditionalInfo}>
              Already have your Blank Metabuilder Hoodie NFT?
            </p>
            <p className={styles.mintAdditionalInfoLink}>Redeem your real hoodie here!</p>
          </div>
        </div>
      </div>
      <div className={styles.imgHoodieContainer}>
        <Image src={Hoodie} width={636} height={636} />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoCard}>
          <div className={`${styles.cardImageContainer} ${styles.cardImageBox}`}>
            <Image src={IconBox} width={30} height={30} />
          </div>
          <h3 className={styles.cardHeading}>Random NFT airdrops</h3>
          <p>
            Gives you a chance to receive random NFT airdrops of the projects we work on to your
            holder???s wallet.{' '}
          </p>
        </div>
        <div className={styles.infoCard}>
          <div className={`${styles.cardImageContainer} ${styles.cardImageBlank}`}>
            <Image src={IconStars} width={30} height={30} />
          </div>
          <h3 className={styles.cardHeading}>Blank Drops</h3>
          <p>
            It grants you whitelist access to our future Drops. It grants you whitelist access to
            our future Drops.
          </p>
        </div>
        <div className={styles.infoCard}>
          <div className={`${styles.cardImageContainer} ${styles.cardImageStars}`}>
            <Image src={IconBlank} width={30} height={30} />
          </div>
          <h3 className={styles.cardHeading}>Real hoodie</h3>
          <p>
            As a holder, you will also receive a real ???Meta-builder??? hoodie that will be shipped
            directly to your home address.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SectionMint;
