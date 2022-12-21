import Head from 'next/head'
import { ethers } from 'ethers';
import { useState } from 'react';
import initialState from '../lib/initialState';
import { decodeBase64DataURI } from '../lib/dataUri';
import { tokenURIABI } from '../lib/abi';
import Header from '../components/Header';
import Form from '../components/Form';
import Display from '../components/Display';

export default function Home() {
  const [contractAddress, setContractAddress] = useState(initialState.contractAddress);
  const [tokenId, setTokenId] = useState(initialState.tokenId);
  const [tokenUri, setTokenUri] = useState(initialState.tokenUri);
  const [metadataJson, setMetadataJson] = useState(initialState.metadataJson);
  const [imageUri, setImageUri] = useState(initialState.imageUri);
  const [provider, setProvider] = useState(initialState.provider); // Mainnet

  async function handleNetworkChange(network) {
    const provider = new ethers.providers.InfuraProvider(network);
    setProvider(provider);
  }

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
        <Display
          tokenUri={tokenUri}
          metadataJson={metadataJson}
          imageUri={imageUri}
        />
      </main>
    </div>
  )
}
