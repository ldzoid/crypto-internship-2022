import { ethers } from 'ethers';

const Utils = (() => {

  const isValidAddress = (address) => {
    try {
      ethers.utils.getAddress(address);
      return true;
    } catch {
      return false;
    }
  };

  const isPositiveInteger = (str) => {
    if (typeof str !== 'string') {
      return false;
    }
    const num = Number(str);
    if (Number.isInteger(num) && num > 0) {
      return true;
    }
    return false;
  };

  return { isValidAddress, isPositiveInteger };
})();

export default Utils;
