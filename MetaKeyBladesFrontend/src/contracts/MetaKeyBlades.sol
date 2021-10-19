
// SPDX-License-Identifier: GPL-3.0

// Created by HashLips
// The Nerdy Coder Clones

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SmartContract is ERC721Enumerable, Ownable {
  using Strings for uint256;

  string public baseURI;
  string public baseExtension = ".json";
  uint256 public cost = 0.06 ether;
  uint256 public maxSupply = 2500;
  uint256 public maxMintAmount = 10;
  uint256 public maxPresale = 2;
  bool public paused = false;
  bool public isWhitelist = true;
  mapping(address => bool) public whitelisted;
  mapping(address => uint256) public presaleBoughtCounts;
  //Default it to value far in future
  uint256 public whiteListStartTime = 2000000000;

  constructor(
    string memory _name,
    string memory _symbol,
    string memory _initBaseURI
  ) ERC721(_name, _symbol) {
    setBaseURI(_initBaseURI);
    //mint(msg.sender, 20);
  }

  // internal
  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  // public
  function mint(address _to, uint256 _mintAmount) public payable {
    uint256 supply = totalSupply();
    require(!paused);
    require(_mintAmount > 0);
    require(supply + _mintAmount <= maxSupply);

    if (msg.sender != owner()) {
        //Check to make sure block wasn't sent early
        require(block.timestamp >= whiteListStartTime, "Sales are not live");
        
        if(isWhitelist != true) {
          //It is not whitelist and user is not whitelisted
          require(_mintAmount <= maxMintAmount);
          require(msg.value >= cost * _mintAmount, "Not enough ether");
        }
        if(isWhitelist == true && whitelisted[msg.sender] != true){
            //User should not be able to buy here
            require(!isWhitelist, "Whitelist addresses only");
        }
        else if (isWhitelist == true && whitelisted[msg.sender] == true){
            //User is whitelisted and is whitelist period
            require(presaleBoughtCounts[msg.sender] + _mintAmount <= maxPresale, "Presale max count exceeded!");
            presaleBoughtCounts[msg.sender] += _mintAmount;
            require(msg.value >= cost * _mintAmount, "Not enough ether");
        }
    }

    for (uint256 i = 1; i <= _mintAmount; i++) {
      _safeMint(_to, supply + i);
    }
  }

  function walletOfOwner(address _owner)
    public
    view
    returns (uint256[] memory)
  {
    uint256 ownerTokenCount = balanceOf(_owner);
    uint256[] memory tokenIds = new uint256[](ownerTokenCount);
    for (uint256 i; i < ownerTokenCount; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
    }
    return tokenIds;
  }

  function tokenURI(uint256 tokenId)
    public
    view
    virtual
    override
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory currentBaseURI = _baseURI();
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
        : "";
  }

  //only owner
  function setCost(uint256 _newCost) public onlyOwner() {
    cost = _newCost;
  }

  function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner() {
    maxMintAmount = _newmaxMintAmount;
  }

  function setBaseURI(string memory _newBaseURI) public onlyOwner {
    baseURI = _newBaseURI;
  }

  function setBaseExtension(string memory _newBaseExtension) public onlyOwner {
    baseExtension = _newBaseExtension;
  }

  function pause(bool _state) public onlyOwner {
    paused = _state;
  }
  
  function setWhitelist(bool _state, uint256 _startTime) public onlyOwner {
    isWhitelist = _state;
    whiteListStartTime = _startTime;
  }
 
 function whitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = true;
  }
 
  function removeWhitelistUser(address _user) public onlyOwner {
    whitelisted[_user] = false;
  }

  function withdraw() public payable onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
  }
}