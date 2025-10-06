// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyNFT.sol";

contract MyNFTTest is Test {
    MyNFT public nft;
    address public owner;
    address public user1;

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        nft = new MyNFT();
    }

    function testMint() public {
        string memory uri = "ipfs://QmTest123";
        nft.mint(uri);
        
        assertEq(nft.ownerOf(0), address(this));
        assertEq(nft.tokenURI(0), uri);
    }

    function testSafeMint() public {
        string memory uri = "ipfs://QmTest456";
        nft.safeMint(user1, uri);
        
        assertEq(nft.ownerOf(0), user1);
        assertEq(nft.tokenURI(0), uri);
    }

    function testFailMintUnauthorized() public {
        vm.prank(user1);
        nft.safeMint(user1, "ipfs://test");
    }
}