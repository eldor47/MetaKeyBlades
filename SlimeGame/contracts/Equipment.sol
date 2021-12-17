pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/IPLAT.sol";

contract Equipment is Ownable, ReentrancyGuard, IERC721Receiver, Pausable {

    // struct to store a stake's token, owner, and earning values
    struct Stake {
      uint16 tokenId;
      uint80 value;
      address owner;
    }
    
    struct Blade { 
       string bladeType;
       string bladeMaterial;
       uint256 id;
       uint256 stakeStartTime;
       bool isStaked;
       address owner;
    }
    
    //Address of 
    IERC721 public mkbToken;
    IERC721 public slimeToken;

    // reference to the $PLAT contract for minting $PLAT earnings
    IPLAT public platToken;
    
    //Equipment types
    Blade[] public blades;
    uint256 slimesStaked;

    uint256 public PLAT_RATE = 2000 ether;
    uint256 public constant MAXIMUM_GLOBAL_PLAT = 50000 ether;

    // maps tokenId to stake
    mapping(uint256 => Stake) private equipment;

    // amount of $PLAT earned so far
    uint256 public totalPlatEarned;
    // the last time $PLAT was claimed
    uint256 private lastClaimTimestamp;

    constructor() {
      // pause on strart TODO:
    }

    modifier requireContractsSet() {
      require(address(mkbToken) != address(0) && address(platToken) != address(0) 
        && address(slimeToken) != address(0), "Contracts not set");
      _;
    }

    modifier _updateEarnings() {
      if (totalPlatEarned < MAXIMUM_GLOBAL_PLAT) {
        totalPlatEarned += 
          (block.timestamp - lastClaimTimestamp)
          * slimesStaked
          * PLAT_RATE / 1 minutes; 
        lastClaimTimestamp = block.timestamp;
      }
      _;
    }

    function setContracts(IERC721 _mkbToken, IERC721 _slimeToken, address _plat) external onlyOwner {
      mkbToken = _mkbToken;
      slimeToken = _slimeToken;
      platToken = IPLAT(_plat);
    }

    function stakeSlime(uint256 slimeId) public {
      //Check if owner has blade in wallet 
      require(slimeToken.ownerOf(slimeId) == msg.sender, "You are not the owner of this token");

      slimeToken.transferFrom(msg.sender, address(this), slimeId);

      equipment[slimeId] = Stake({
        owner: msg.sender,
        tokenId: uint16(slimeId),
        value: uint80(block.timestamp)
      });

      slimesStaked += 1;
    }

    function unstakeSlime(uint256 slimeId) public {
      //Check if owner has blade in wallet 
      require(equipment[slimeId].owner == msg.sender, "You are not the owner of this token");

      slimeToken.transferFrom(address(this), msg.sender, slimeId);
      delete equipment[slimeId];
      slimesStaked -= 1;
    }
    
    function claimMany(uint16[] calldata tokenIds) public whenNotPaused _updateEarnings nonReentrant {
      require(tx.origin == _msgSender(), "Only EOA");
      uint256 owed = 0;
      for (uint i = 0; i < tokenIds.length; i++) {
        owed += getSlimeTokenAmount(i);
      }
      platToken.updateOriginAccess();
      if (owed == 0) {
        return;
      }
      platToken.mint(_msgSender(), owed);
    }

    function getSlimeTokenAmount(uint256 slimeId) public view returns(uint256) {
      if(equipment[slimeId].value > 0){
        return (block.timestamp - equipment[slimeId].value) * PLAT_RATE / 1 minutes;
      } else {
        return 0;
      }
    }

    function setSlimeRate(uint256 amount) public onlyOwner() {
      PLAT_RATE = amount;
    }

    function getTotalSlimeStaked() public view returns (uint256) {
      return slimesStaked;
    }



    //OTHER
    function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
      require(from == address(0x0), "Cannot stake directly");
      return IERC721Receiver.onERC721Received.selector;
    }
}