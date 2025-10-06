// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/NFT.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        MyNFT nft = new MyNFT();
        console.log("MyNFT deployed to:", address(nft));
        
        vm.stopBroadcast();
    }
}

contract MintScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address nftAddress = vm.envAddress("NFT_CONTRACT_ADDRESS");
        string memory metadataUri = vm.envString("METADATA_URI");
        
        vm.startBroadcast(deployerPrivateKey);
        
        MyNFT nft = MyNFT(nftAddress);
        nft.mint(metadataUri);
        
        console.log("NFT minted with URI:", metadataUri);
        
        vm.stopBroadcast();
    }
}

contract DeployAndMintScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy
        MyNFT nft = new MyNFT();
        console.log("MyNFT deployed to:", address(nft));
        
        // Mint first NFT
        string memory metadataUri = "ipfs://Qmf6P7DBfszYetiz1popxkiYJw46njsRJmJpcTN2ENH8wX";
        nft.mint(metadataUri);
        console.log("NFT #0 minted to:", msg.sender);
        
        vm.stopBroadcast();
    }
}

contract BatchMintScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address nftAddress = vm.envAddress("NFT_CONTRACT_ADDRESS");
        
        // Array of metadata URIs - from Pinata upload
        string[] memory uris = new string[](10);
        uris[0] = "ipfs://Qmf6P7DBfszYetiz1popxkiYJw46njsRJmJpcTN2ENH8wX";
        uris[1] = "ipfs://QmTv48WLA4CwUDDRFLgEZD82WcJzv7Hw2pS78NFeE8mEnn";
        uris[2] = "ipfs://QmSe2dF66LLHuKh82YUiqZB9m1qmSvX3Z5io2LnYV8WJ8j";
        uris[3] = "ipfs://Qmc3de1JGG16dhidzNWNTfX1wqoLakDC6tnxqT3K928MN9";
        uris[4] = "ipfs://QmPtKSucHLjmMUTh37BFzNE2nSNCER3LDRCLftGZwphGPk";
        uris[5] = "ipfs://Qmd4kz6hS13AyCmXSwgjVz41s1sG9xZoebd7T2qLkTGw9S";
        uris[6] = "ipfs://QmTPCZheEkLLfnLepsu2ihzaRQwFkMHeKFrJZDSB1BKJQU";
        uris[7] = "ipfs://QmZKU3tr9pVyppt4nih495T4bLc5Wpwapg1VHmNAuKodte";
        uris[8] = "ipfs://QmbdSCUhAscHn67pZJ3mWM8ScG2DgGfSAu28bRrx89UNbD";
        uris[9] = "ipfs://QmRouAcTcWd7GFoucQkdRFY6BX5AktVaGiw9Pr6ssGtAs2";
        
        vm.startBroadcast(deployerPrivateKey);
        
        MyNFT nft = MyNFT(nftAddress);
        
        for (uint256 i = 0; i < uris.length; i++) {
            nft.mint(uris[i]);
            console.log("Minted NFT with URI:", uris[i]);
        }
        
        console.log("Batch minted", uris.length, "NFTs");
        
        vm.stopBroadcast();
    }
}