// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Blank.sol";
import "./BlankHoodie.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Staking is ReentrancyGuard, Pausable, Ownable {
    error CallerNotNftOwner();
    error TokenNotStaked();

    event Stake(address _from, uint256 _id);
    event Unstake(address _from, uint256 _id);
    event Claim(address _from, uint256 _value);

    mapping(uint => address) public idToOwner;
    mapping(address => uint256[]) public ownerToIds;
    mapping(uint256 => uint256) public idToTimestamp;

    uint256 tokensPerSecond = 11574074074074; // 10 ether per 24h

    BlankHoodie nftContract =
        BlankHoodie(0xd9145CCE52D386f254917e481eB44e9943F39138); // NFT contract
    Blank erc20Contract = Blank(0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8); // ERC20 token contract

    function stake(uint256[] memory _ids) external nonReentrant whenNotPaused {
        for (uint256 i; i < _ids.length; i++) {
            uint256 _id = _ids[i];
            // check if user is owner of nft
            if (nftContract.ownerOf(_id) != msg.sender)
                revert CallerNotNftOwner();
            // update state variables
            idToOwner[_id] = msg.sender;
            ownerToIds[msg.sender].push(_id);
            idToTimestamp[_id] = block.timestamp;
            // transfer nft
            nftContract.transferFrom(msg.sender, address(this), _id);
            // emit event
            emit Stake(msg.sender, _id);
        }
    }

    function unstake(uint256[] memory _ids)
        external
        nonReentrant
        whenNotPaused
    {
        uint256 totalReward;
        for (uint256 i; i < _ids.length; i++) {
            uint256 _id = _ids[i];
            // check if user is owner of nft
            if (idToOwner[_id] != msg.sender) revert CallerNotNftOwner();
            // get reward
            totalReward += getReward(_id);
            // update state variables
            delete idToOwner[_id];
            for (uint j; j < ownerToIds[msg.sender].length; j++) {
                if (_id == ownerToIds[msg.sender][j]) {
                    ownerToIds[msg.sender][j] = ownerToIds[msg.sender][
                        ownerToIds[msg.sender].length - 1
                    ];
                    ownerToIds[msg.sender].pop();
                }
            }
            delete idToTimestamp[_id];
            // transfer nft
            nftContract.transferFrom(address(this), msg.sender, _id);
            // emit event
            emit Unstake(msg.sender, _id);
        }
        // transfer reward (tokens)
        erc20Contract.transfer(msg.sender, totalReward);
        // emit event
        emit Claim(msg.sender, totalReward);
    }

    function claim() external nonReentrant whenNotPaused {
        uint256[] memory ids = ownerToIds[msg.sender];
        uint256 totalReward;
        // get reward and update timestamp for each nft
        for (uint256 i; i < ids.length; i++) {
            // get reward
            totalReward += getReward(ids[i]);
            // update timestamp
            idToTimestamp[ids[i]] = block.timestamp;
        }
        // transfer reward (tokens)
        erc20Contract.transfer(msg.sender, totalReward);
        // emit event
        emit Claim(msg.sender, totalReward);
    }

    function getReward(uint256 _id) public view returns (uint256) {
        uint256 tokenTimestamp = idToTimestamp[_id];
        if (tokenTimestamp == 0) return 0;
        uint256 reward = (block.timestamp - tokenTimestamp) * tokensPerSecond;
        return reward;
    }

    function emergencyUnstake(uint256 _id) external onlyOwner {
        if (idToTimestamp[_id] == 0) revert TokenNotStaked();
        address _owner = idToOwner[_id];
        // update state variables
        delete idToOwner[_id];
        for (uint j; j < ownerToIds[_owner].length; j++) {
            if (_id == ownerToIds[_owner][j]) {
                ownerToIds[_owner][j] = ownerToIds[_owner][
                    ownerToIds[_owner].length - 1
                ];
                ownerToIds[_owner].pop();
            }
        }
        delete idToTimestamp[_id];
        // transfer nft
        nftContract.transferFrom(address(this), msg.sender, _id);
        // emit event
        emit Unstake(msg.sender, _id);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
