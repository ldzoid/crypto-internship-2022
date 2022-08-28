import { ethers } from 'ethers'
import { useState, useContext, useEffect } from 'react';
import Contracts from '../../modules/contracts';
import MintedCard from './MintedCard';
import styles from './SectionMinted.module.css';
import { AppContext } from '../context/AppContext';

const SectionMinted = () => {
  const { account, provider, signer } = useContext(AppContext);

  const [mintedList, setMintedList] = useState([]);

  // update minted list when account changes
  useEffect(() => {
    (async () => {
      // check if user disconnected
      if (!account) {
        setMintedList([]);
        return;
      }
      // check if user on correct network
      const { chainId } = await provider.getNetwork();
      if (chainId != 5) {
        setMintedList([]);
        return;
      }
      // init contract
      const blankHoodieContract = new ethers.Contract(
        Contracts.BlankHoodieAddress,
        Contracts.BlankHoodieABI,
        signer
      );
      // get minted list
      const _mintedList = (
        await blankHoodieContract.tokensOfOwner(account)
      ).map((object) => parseInt(object['_hex']), 16);
      // update minted list
      setMintedList(_mintedList);
    })();
  }, [account]);

  return (
    <section className={styles.container}>
      <h1 className={styles.headerSecondary}>Minted NFTs</h1>
      <div className={styles.mintedListContainer}>
        {mintedList.map((_id) => (
          <MintedCard id={_id} key={_id} />
        ))}
      </div>
    </section>
  );
};

export default SectionMinted;
