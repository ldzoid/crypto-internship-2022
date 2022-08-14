import { ethers } from "ethers";

const Connector = (() => {
  let signer;

  const connectMetamask = async () => {
    if (window.ethereum !== undefined) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
    } else {
      console.log("You have to install MetaMask");
    }
  };

  const getAddress = async () => {
    return await signer.getAddress()
  }

  return { connectMetamask, getAddress };
})();

export default Connector;
