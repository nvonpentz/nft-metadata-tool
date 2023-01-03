import { ethers } from 'ethers';

const initialState = {
  contractAddress: '0x59468516a8259058bad1ca5f8f4bff190d30e066',
  contractABI: [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "tokenURI",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
],
  tokenId: 50,
  tokenUri: 'ipfs://QmSBnsELjNQbhLVbf6w7UMGFVT35UhK4DfePpDJwQVtxDN/50',
  metadataJson:`{
    "name": "Invisible Friends #50",
    "description": "5,000 animated Invisible Friends hiding in the metaverse. A collection by Markus Magnusson & Random Character Collective.",
    "image": "ipfs://QmXmuSenZRnofhGMz2NyT3Yc4Zrty1TypuiBKDcaBsNw9V/50.gif",
    "attributes": [
        {
            "trait_type": "Feet",
            "value": "Black Shoes"
        },
        {
            "trait_type": "Legs",
            "value": "Dark Blue Pants"
        },
        {
            "trait_type": "Upper Body",
            "value": "Light Blue Loose Shirt with Pens"
        },
        {
            "trait_type": "Sleeves",
            "value": "Short Sleeves"
        },
        {
            "trait_type": "Hat",
            "value": "Tie"
        },
        {
            "trait_type": "Eyes",
            "value": "Black Nerd Glasses"
        },
        {
            "trait_type": "Nose",
            "value": "Bandage"
        },
        {
            "trait_type": "Right Arm",
            "value": "Burning Computer"
        },
        {
            "trait_type": "Left Arm",
            "value": "Baseball Bat"
        },
        {
            "trait_type": "Background",
            "value": "Blue"
        }
    ],
    "animation_url": "ipfs://QmX4nfgA35MiW5APoc4P815hMcH8hAt7edi5H3wXkFm485/50.html"
}`,
  imageUri: "https://nftstorage.link/ipfs/QmXmuSenZRnofhGMz2NyT3Yc4Zrty1TypuiBKDcaBsNw9V/50.gif",
  network: "mainnet",
  error: ''
}

export default initialState;
