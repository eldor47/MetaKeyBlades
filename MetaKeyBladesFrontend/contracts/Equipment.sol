pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Equipment is Ownable {
    
    struct Blade { 
       string bladeType;
       string bladeMaterial;
       uint256 id;
    }
    
    //Address of 
    IERC721 public mkbToken;
    
    //Equipment types
    Blade[] public blades;

    constructor(IERC721 _address) {
      mkbToken = _address;
    }

    function checkMKBOwnership(uint tokenId) public view returns (address) {
      return mkbToken.ownerOf(tokenId);
    }
    
    function createBlade(string memory _bladeType, string memory _bladeMaterial, uint256 _id) public onlyOwner() {
        Blade memory blade = Blade(_bladeType, _bladeMaterial, _id);
        blades.push(blade);
    }
}