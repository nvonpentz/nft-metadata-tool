import Head from 'next/head'
import { ethers } from 'ethers';
import { useState } from 'react';
import initialState from '../lib/initialState';
import { decodeBase64DataURI } from '../lib/dataUri';
import { convertIpfsUrlToGatewayUrl } from '../lib/ipfsUri';
import { tokenURIABI } from '../lib/abi';
import Header from '../components/Header';
import Form from '../components/Form';
import Display from '../components/Display';
import styles from '../styles/Home.module.css'

const Home = () => {
  const [contractAddress, setContractAddress] = useState(initialState.contractAddress);
  const [tokenId, setTokenId] = useState(initialState.tokenId);
  const [tokenUri, setTokenUri] = useState(initialState.tokenUri);
  const [metadataJson, setMetadataJson] = useState(initialState.metadataJson);
  const [imageUri, setImageUri] = useState(initialState.imageUri);
  const [provider, setProvider] = useState(initialState.provider); // Mainnet
  const [error, setError] = useState(initialState.error);

  async function handleNetworkChange(network) {
    const provider = new ethers.providers.InfuraProvider(network);
    setProvider(provider);
  }

  async function handleSubmit() {
    try {
      // Create a contract instance
      const contract = new ethers.Contract(contractAddress, tokenURIABI, provider);

      // Call the tokenURI function
      const tokenUri = await contract.tokenURI(tokenId)
      setTokenUri(tokenUri);

      // Fetch the metadata JSON located at the tokenURI
      const uri = new URL(tokenUri);
      const scheme = uri.protocol;
      let metadata;
      if (scheme === 'data:') {
        metadata = JSON.parse(decodeBase64DataURI(tokenUri));
      } else if (scheme === 'ipfs:') {
        const response = await fetch(convertIpfsUrlToGatewayUrl(uri));
        metadata = await response.json();
      } else if (scheme === 'https:') {
        const response = await fetch(tokenUri);
        metadata = await response.json();
      } else {
        throw new Error('Invalid URI scheme');
      }

      // Set the metadata JSON
      const metadataJson = JSON.stringify(metadata, null, 4, {sort_keys: true})
      console.log(metadataJson);
      setMetadataJson(metadataJson);

      // Get the image URI from the metadata
      let imageUri = metadata.image;
      // if image URI is ipfs scheme convert to gateway url
      if (new URL(imageUri).protocol === 'ipfs:') {
        imageUri = convertIpfsUrlToGatewayUrl(new URL(imageUri)).toString();
      }
      setImageUri(imageUri);
      setError(initialState.error);

      // // Decode the image URI
      // const imageData = decodeBase64DataURI(imageUri);
    } catch(error) {
      console.error(error.message);
      setError(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>NFT Metadata</title>
        <meta name="description" content="NFT Metadata fetcher" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header/>
        <Form
          contractAddress={contractAddress}
          tokenId={tokenId}
          setContractAddress={setContractAddress}
          setTokenId={setTokenId}
          handleNetworkChange={handleNetworkChange}
          handleSubmit={handleSubmit}
        />
        <div className={styles.error}>{error}</div>
        <Display
          tokenUri={tokenUri}
          metadataJson={metadataJson}
          imageUri={imageUri}
        />
      </main>
    </div>
  )
}

export default Home;
