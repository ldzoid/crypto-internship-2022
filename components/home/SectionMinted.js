import { ethers } from 'ethers';
import { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { AppContext } from '../context/AppContext';
import Contracts from '../../modules/contracts';
import MintedCard from './MintedCard';
import styles from './SectionMinted.module.css';

const SectionMinted = () => {
  const { account, signer, chainId } = useContext(AppContext);

  const [mintedList, setMintedList] = useState([]);

  // update minted list when account changes
  useEffect(() => {
    (async () => {
      // check if user disconnected or on wrong network
      if (!account || chainId != 5) {
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
      {account ? (
        <div className={styles.mintedListContainer}>
          {mintedList.map((_id) => (
            <MintedCard id={_id} key={_id} />
          ))}
        </div>
      ) : (
        <Link href='/connect'><h2 className={styles.linkConnect}>Connect wallet to see your NFTs</h2></Link>
      )}
    </section>
  );
};

export default SectionMinted;
