import SectionMint from '../components/home/SectionMint';
import SectionMinted from '../components/home/SectionMinted';
import Layout from '../components/layout/Layout';

const Home = () => {
  return (
    <Layout title={'Blank\nCrypto\nInternship'} subtitle={''}>
      <SectionMint />
      <SectionMinted />
    </Layout>
  );
};

export default Home;
