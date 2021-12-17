
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract Slime is IERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    struct LastWrite {
        uint64 time;
        uint64 blockNum;
    }

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public cost = 0.06 ether;
    uint256 public mkbSupply = 1500;
    uint256 public maxSupply = 30000;
    uint256 public maxMintAmount = 10;
    bool public paused = false;

    // address => allowedToCallFunctions
    mapping(address => bool) private admins;

    // Tracks the last block and timestamp that a caller has written to state.
    // Disallow some access to functions if they occur while a change is being written.
    mapping(address => LastWrite) private lastWriteAddress;
    mapping(uint256 => LastWrite) private lastWriteToken;

    event TokenStaked(address indexed owner, uint256 indexed tokenId, bool indexed isSlime, uint256 value);
    event SlimeClaimed(uint256 indexed tokenId, bool indexed unstaked, uint256 earned);
    event HeroClaimed(uint256 indexed tokenId, bool indexed unstaked, uint256 earned);

    //Address of 
    IERC721 public mkbToken;
    bool[1500] public mkbTokenMintStatus;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        IERC721 _mkbToken
    ) ERC721(_name, _symbol) {
        setBaseURI(_initBaseURI);
        mkbToken = _mkbToken;
        for(uint256 i = 0; i < mkbSupply; i++) {
            mkbTokenMintStatus[i] = false;
        }
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    /** CRITICAL TO SETUP / MODIFIERS */

    modifier blockIfChangingAddress() {
        // frens can always call whenever they want :)
        require(admins[_msgSender()] || lastWriteAddress[tx.origin].blockNum < block.number, "hmmmm what doing?");
        _;
    }

    modifier blockIfChangingToken(uint256 tokenId) {
        // frens can always call whenever they want :)
        require(admins[_msgSender()] || lastWriteToken[tokenId].blockNum < block.number, "hmmmm what doing?");
        _;
    }

    // public
    function mint(address _to, uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(!paused);
        require(_mintAmount > 0);
        require(supply + _mintAmount <= maxSupply - mkbSupply);

        require(_mintAmount <= maxMintAmount);
        require(msg.value >= cost * _mintAmount, "Not enough ether");

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(_to, supply + i);
        }
    }

    function mintFree(address _to, uint16[] calldata blades) public payable {
        // Check each blade to verify ownership and token mint status
        for (uint256 i = 0; i < blades.length; i++) {
            uint256 tokenId = blades[i];
            require(mkbToken.ownerOf(tokenId) == msg.sender, "You do not own all of these blades.");
            require(mkbTokenMintStatus[tokenId] == false, "Token(s) already minted");
        }

        for (uint256 i = 0; i < blades.length; i++) {
            uint256 tokenId = blades[i];
            _safeMint(_to, tokenId);
        }
    }
  
    /** 
    * Burn a token - any game logic should be handled before this function.
    */
    function burn(uint256 tokenId) external {
        require(admins[_msgSender()], "Only admins can call this");
        require(ownerOf(tokenId) == tx.origin, "Oops you don't own that");
        // if(tokenTraits[tokenId].isWizard) {
        //     emit WizardBurned(tokenId);
        // }
        // else {
        //     emit DragonBurned(tokenId);
        // }
        _burn(tokenId);
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

    function transferFrom(
            address from,
            address to,
            uint256 tokenId
        ) public virtual override(ERC721, IERC721) blockIfChangingToken(tokenId) {
            // allow admin contracts to be send without approval
            if(!admins[_msgSender()]) {
                require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved");
            }
            _transfer(from, to, tokenId);
    }

    /**
    * enables an address to mint / burn
    * @param addr the address to enable
    */
    function addAdmin(address addr) external onlyOwner {
        admins[addr] = true;
    }

    /**
    * disables an address from minting / burning
    * @param addr the address to disbale
    */
    function removeAdmin(address addr) external onlyOwner {
        admins[addr] = false;
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

    function withdraw() public payable onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
    }
}