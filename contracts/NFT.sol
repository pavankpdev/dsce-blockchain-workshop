// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DuoNFT is ERC721 {
    constructor(string memory _name, string memory _symbol)
    ERC721(_name, _symbol) {}

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping (uint => string) private _tokenUri;

    modifier isTokenExist (uint tokenId) {
        require(_exists(tokenId), "ERC721 error: TokenID not found");
        _;
    }

    function _setTokenUri (string memory tokenUri, uint tokenId) internal isTokenExist(tokenId) {
        _tokenUri[tokenId] = tokenUri;
    }

    function mint (address recipient, uint tokenId, string memory tokenUri) public {
        _mint(recipient, tokenId);
        _setTokenUri(tokenUri, tokenId);
        Counters.increment(_tokenIds);
    }

    function tokenURI (uint tokenId) public view virtual override isTokenExist(tokenId) returns(string memory) {
        return _tokenUri[tokenId];
    }

    function totalSupply () public view returns(uint) {
        return Counters.current(_tokenIds);
    }

}