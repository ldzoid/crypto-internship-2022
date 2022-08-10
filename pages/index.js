import Head from 'next/head'
import SectionMint from '../components/home/SectionMint'
import SectionMinted from '../components/home/SectionMinted'

import Image from 'next/image'
import Hoodie from '../public/images/Hoodie.png'

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
      <SectionMint/>
      <SectionMinted/>
    </>
  );
};

export default Home;
