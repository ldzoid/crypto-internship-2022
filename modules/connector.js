const Connector = (() => {

  const BlankHoodieAddress = '0xf63f410b7831AA6b34651260C8d5B69F812581b3';
  const BlankHoodieABI = [
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

  return { BlankHoodieAddress, BlankHoodieABI };
})();

export default Connector;
