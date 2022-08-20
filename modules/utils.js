import { ethers } from 'ethers';

const Utils = (() => {

  const isValidAddress = (_address) => {
    try {
      ethers.utils.getAddress(_address);
      return true;
    } catch {
      return false;
    }
  };

  const isPositiveInteger = (_str) => {
    if (typeof _str !== 'string') {
      return false;
    }
    const num = Number(_str);
    if (Number.isInteger(num) && num > 0) {
      return true;
    }
    return false;
  };

  return { isValidAddress, isPositiveInteger };
})();

export default Utils;
