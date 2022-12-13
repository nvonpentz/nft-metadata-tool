import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';
import { useState } from 'react';
import initialState from './initialState';

const tokenURIABI = [
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
];

// Create a provider to connect to the Ethereum network
const provider = new ethers.providers.InfuraProvider("mainnet");

const decodeBase64DataURI = (dataUri) => {
  // Split the data URI at the comma
  const parts = dataUri.split(',');

  // Check the encoding information to make sure it is "base64"
  if (!parts[0].endsWith(';base64')) {
    console.log('Invalid encoding');
    return;
  }

  // Decode the base64 encoded data using the atob() function
  const decodedData = atob(parts[1]);
  return decodedData;
}

export default function Home() {
  const [contractAddress, setContractAddress] = useState(initialState.contractAddress);
  const [tokenId, setTokenId] = useState(initialState.tokenId);
  const [tokenUri, setTokenUri] = useState(initialState.tokenUri);
  const [metadataJson, setMetadataJson] = useState(initialState.metadataJson);
  const [imageUri, setImageUri] = useState(initialState.imageUri);

  async function handleSubmit() {
    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, tokenURIABI, provider);

    // Call the contract function
    const tokenUri = await contract.tokenURI(tokenId)
    setTokenUri(tokenUri);

    // Validate URI and get the scheme
    const uri = new URL(tokenUri);
    const scheme = uri.protocol;
    if (!scheme === 'data:') {
      console.log('Invalid URI');
      return;
    }

    const metadataJson = JSON.stringify(JSON.parse(decodeBase64DataURI(tokenUri)),null,2);
    setMetadataJson(metadataJson);

    // Get the image URI from the metadata
    const metadata = JSON.parse(metadataJson);
    const imageUri = metadata.image;
    setImageUri(imageUri);

    // Decode the image URI
    const imageData = decodeBase64DataURI(imageUri);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>NFT Metadata</title>
        <meta name="description" content="NFT Metadata fetcher" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
        <h1 className={styles.title}>
          NFT Metadata
        </h1>
        </div>
        <div className={styles.search}>
            <input
              type="search"
              name="contractAddress"
              value={contractAddress}
              className={styles.input}
              onChange={(event) => setContractAddress(event.target.value)}
            />
            <input
              type="number"
              name="tokenId"
              min="0"
              max="100000"
              value={tokenId}
              onChange={(event) => setContractAddress(event.target.value)}
              className={styles.input}
            />
            <select name="network" className="select">
              <option value="mainnet">Mainnet</option>
            </select>
          <button className={styles.button} onClick={handleSubmit}>Fetch</button>
        </div>
        <div className={styles.columns}>
          <div className={`${styles.column} ${styles.image}`}>
            <img src={imageUri} ></img>
          </div>
          <div className={styles.column}>{tokenUri}</div>
          <div className={styles.column}>{metadataJson}</div>
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}
