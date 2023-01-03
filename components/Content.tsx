import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import initialState from '../lib/initialState';
import { decodeBase64DataURI } from '../lib/dataUri';
import { convertIpfsUrlToGatewayUrl } from '../lib/ipfsUri';
import { tokenURIABI } from '../lib/abi';
import Header from '../components/Header';
import Form from '../components/Form';
import { useRouter } from 'next/router';

interface Props {}

const Content = () => {
  const router = useRouter();
  const [tokenId, setTokenId] = useState(1);
  const [contractAddress, setContractAddress] = useState('0x59468516a8259058bad1ca5f8f4bff190d30e066');
  const [network, setNetwork] = useState('mainnet');
  const [tokenUri, setTokenUri] = useState();
  const [metadataJson, setMetadataJson] = useState();
  const [imageUri, setImageUri] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const { tokenId, contractAddress, network } = router.query;
    if (!contractAddress || !tokenId || !network) {
      return;
    }
    setContractAddress(router?.query?.contractAddress);
    setTokenId(router?.query?.tokenId);
    setNetwork(router?.query?.network ?? initialState.network);
    fetchTokenData(tokenId, contractAddress, network);
  }, [router]);

  async function handleSubmit() {
    router.push({
      pathname: '/',
      query: {
        tokenId: tokenId,
        contractAddress: contractAddress,
        network: network
      },
    })

    fetchTokenData(tokenId, contractAddress, network);
  }

  async function fetchTokenData(
    tokenId: string,
    contractAddress: string,
    network: string
  ) {
    if (!tokenId || !contractAddress || !network) {
      return;
    }

    try {
      const provider = new ethers.providers.InfuraProvider(network);

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
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <Form
            contractAddress={contractAddress}
            setContractAddress={setContractAddress}
            tokenId={tokenId}
            setTokenId={setTokenId}
            network={network}
            setNetwork={setNetwork}
            handleSubmit={handleSubmit}
            error={error}
          />
        </div>
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
        <div className={`${styles.gridItem} ${styles.gridItemImage}`}>
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
