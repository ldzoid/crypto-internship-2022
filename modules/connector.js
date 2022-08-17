import { ethers } from 'ethers';

const Connector = (() => {

  const contractAddress = '0xf63f410b7831AA6b34651260C8d5B69F812581b3';
  const contractABI = [
    {
      inputs: [
        { internalType: 'uint256', name: '_mintAmount', type: 'uint256' },
      ],
      name: 'mint',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
      name: 'tokensOfOwner',
      outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
  ];

  let provider;
  let signer;
  let contract;

  const connectMetamask = async () => {
    if (window.ethereum !== undefined) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      signer = await provider.getSigner();
      contract = new ethers.Contract(contractAddress, contractABI, signer)
    } else {
      console.log('You have to install MetaMask');
    }
  };

  const getSigner = () => {
    return signer
  }

  const getAddress = async () => {
    return await signer.getAddress();
  };

  const getBalance = async () => {
    const balance = await provider.getBalance(getAddress())
    return ethers.utils.formatEther(balance)
  }

  // contract operations
  const getSupply = async () => {
    return await contract.totalSupply()
  }

  const mint = async (amount) => {
    const txObject = {
      value: ethers.utils.parseEther(`${0.1*amount}`),
    }
    await contract.mint(amount, txObject)
  }

  const getTokensOfSigner = async () => {
    const address = await signer.getAddress()
    return (await contract.tokensOfOwner(address)).map(object => parseInt(object['_hex']), 16)
  }

  return { connectMetamask, getSigner, getAddress, getBalance, getSupply, mint, getTokensOfSigner };
})();

export default Connector;
