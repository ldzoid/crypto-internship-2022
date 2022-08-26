// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract Blank is ERC20Capped {
    constructor() ERC20Capped(1000000 ether) ERC20("Blank", "BLANK") {
        _mint(msg.sender, 1000000 ether);
    }
}
