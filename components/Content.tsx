import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';
import { useState } from 'react';
import initialState from '../lib/initialState';
import { decodeBase64DataURI } from '../lib/dataUri';
import { convertIpfsUrlToGatewayUrl } from '../lib/ipfsUri';
import { tokenURIABI } from '../lib/abi';
import Header from '../components/Header';
import Form from '../components/Form';

interface Props {}

const Content = () => {
  const [contractAddress, setContractAddress] = useState(initialState.contractAddress);
  const [tokenId, setTokenId] = useState(initialState.tokenId);
  const [tokenUri, setTokenUri] = useState(initialState.tokenUri);
  const [metadataJson, setMetadataJson] = useState(initialState.metadataJson);
  const [imageUri, setImageUri] = useState(initialState.imageUri);
  const [provider, setProvider] = useState(initialState.provider); // Mainnet
  const [error, setError] = useState(initialState.error);

  async function handleNetworkChange(network: string) {
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
      const metadataJson = JSON.stringify(metadata, null, 4)
      setMetadataJson(metadataJson);

      // Get the image URI from the metadata
      let imageUri = metadata.image;
      // if image URI is ipfs scheme convert to gateway url
      if (new URL(imageUri).protocol === 'ipfs:') {
        imageUri = convertIpfsUrlToGatewayUrl(new URL(imageUri)).toString();
      }
      setImageUri(imageUri);
      setError(initialState.error);

      // if imageUri is data scheme, decode and console.log
      if (new URL(imageUri).protocol === 'data:') {
        console.log(decodeBase64DataURI(imageUri));
      }

    } catch(error: any) {
      console.error(error.message);
      setError(error.message);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Form
          contractAddress={contractAddress}
          setContractAddress={setContractAddress}
          tokenId={tokenId}
          setTokenId={setTokenId}
          handleNetworkChange={handleNetworkChange}
          handleSubmit={handleSubmit}
          error={error}
        />
      </div>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <div className={styles.label}>
            Token URI
            <button className={styles.copyButton} onClick={() => copyToClipboard(tokenUri)}>Copy</button>
          </div>
          <div className={styles.scrollable}>
            {tokenUri}
          </div>
        </div>
        <div className={styles.gridItem}>
          <div className={styles.label}>
            Metadata JSON
            <button className={styles.copyButton} onClick={() => copyToClipboard(metadataJson)}>Copy</button>
          </div>
          <div className={styles.scrollable}>
            <pre>{metadataJson}</pre>
          </div>
        </div>
        <div className={styles.gridItem}>
          <div className={styles.label}>
            Image
          </div>
          <img className={styles.nftImage} src={imageUri}></img>
        </div>
      </div>
    </div>
  )
}

export default Content;
