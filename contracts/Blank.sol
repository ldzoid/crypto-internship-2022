// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import './BlankDependencies/ERC20Capped.sol';

contract Blank is ERC20Capped {

    constructor() ERC20Capped(1000000) ERC20('Blank', 'BLANK') {
        _mint(msg.sender, 1000000);
    }

}