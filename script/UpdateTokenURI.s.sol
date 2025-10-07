// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {MyNFT} from "../src/NFT.sol";

contract UpdateTokenURIScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address nftAddress = vm.envAddress("NFT_CONTRACT_ADDRESS");

        // Correct metadata URIs from Pinata upload
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
            nft.updateTokenUri(i, uris[i]);
            console.log("Updated NFT #", i, "with URI:", uris[i]);
        }

        console.log("Updated", uris.length, "NFTs with correct metadata");

        vm.stopBroadcast();
    }
}
