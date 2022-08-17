// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import './BlankHoodieDependencies/ERC721AQueryable.sol';
import './BlankHoodieDependencies/Ownable.sol';
import './BlankHoodieDependencies/Strings.sol';

contract BlankHoodie is ERC721AQueryable, Ownable {

    error InsufficientFunds();
    error ContractIsPaused();
    error MaxSupplyExceeded();
    error OnlyEOA();

    using Strings for uint256;

    string  public baseURI = 'ipfs://QmVqodXFfpUU13GJDetcE2UtPLWMBsZubX6ZnhU3XDWhmJ';

    uint256 public          cost      = 0.1 ether;
    uint256 public constant maxSupply = 500;

    bool public paused = true;

    constructor() ERC721A('Blank Hoodie', 'HOODIE') {}

    function mint(uint256 _mintAmount) external payable {

        if (paused) revert ContractIsPaused();
        if (msg.sender != tx.origin) revert OnlyEOA();
        if (totalSupply() + _mintAmount > maxSupply) revert MaxSupplyExceeded(); 
        if (msg.value < cost * _mintAmount) revert InsufficientFunds();

        _mint(msg.sender, _mintAmount);
    }

    function airDrop(address _to, uint256 _amount) external onlyOwner {
        if (totalSupply() + _amount > maxSupply) revert MaxSupplyExceeded();

        _mint(_to, _amount);
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            'ERC721Metadata: URI query for nonexistent token'
        );

        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI))
            : '';
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function setPaused(bool _state) external onlyOwner {
        paused = _state;
    }

    function setCost(uint256 _price) external onlyOwner {
        cost = _price;
    }

    function withdraw() onlyOwner external {
        (bool os, ) = payable(owner()).call{value: address(this).balance }('');
        require(os, 'Withdraw failed!');
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
}