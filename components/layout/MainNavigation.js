import Image from 'next/image'
import Link from 'next/link'

import BlankLogo from '../../public/images/Blank Logo.png'

import classes from "./MainNavigation.module.css";
import utils from '../../styles/utils.module.css'

const MainNavigation = () => {
  return (
  <div className={classes.container}>
    <div className={classes.imgLogoContainer}><Image src={BlankLogo} width={85} height={16}></Image></div>
    <div className={classes.linksContainer}>
      <Link href='/'>Home</Link>
      <Link href='/'>Stake</Link>
      <Link href='/'>ERC20 Manager</Link>
      <button className={`${utils.btnMain} ${classes.btnConnect}`}>Connect wallet</button>
    </div>
  </div>
  );
};

export default MainNavigation;
