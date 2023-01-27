import styles from '../styles/Home.module.css'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import initialState from '../lib/initialState';
import { decodeDataUri } from '../lib/dataUri';
import { convertIpfsUrlToGatewayUrl } from '../lib/ipfsUri';
import { tokenURIABI } from '../lib/abi';
import { fetchSolanaTokenUri } from '../lib/solana';
import Header from '../components/Header';
import Form from '../components/Form';
import { useRouter } from 'next/router';

interface Props {}

const Content = () => {
  const router = useRouter();
  const [tokenId, setTokenId] = useState<number | undefined>(Math.floor(Math.random() * 5000) + 1);
  const [contractAddress, setContractAddress] = useState('0x59468516a8259058bad1ca5f8f4bff190d30e066');
  const [network, setNetwork] = useState('mainnet');
  const [tokenUri, setTokenUri] = useState('');
  const [metadataJson, setMetadataJson] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const { tokenId: tokenId, contractAddress, network } = router.query;
    if (!contractAddress || !tokenId || !network) {
      return;
    }
    setContractAddress(contractAddress.toString());
    setTokenId(Number(tokenId));
    setNetwork(network.toString() ?? initialState.network.toString());

    fetchTokenData(Number(tokenId), contractAddress.toString(), network.toString());
  }, [router]);

  const handleSubmit = async () => {
    router.push({
      pathname: '/',
      query: {
        tokenId: tokenId,
        contractAddress: contractAddress,
        network: network
      },
    })

    fetchTokenData(Number(tokenId), contractAddress, network);
  }

  const fetchTokenData = async (
    tokenId: number,
    contractAddress: string,
    network: string
  ) => {
    if (!tokenId || !contractAddress || !network) {
      return;
    }

    try {
      let tokenUri;
      if (network == "solana") {
        // Solana
        tokenUri = await fetchSolanaTokenUri(contractAddress);
      } else {
        // Ethereum chains
        const provider = new ethers.providers.InfuraProvider(network);

        // Create a contract instance
        const contract = new ethers.Contract(contractAddress, tokenURIABI, provider);

        // Call the tokenURI function
        tokenUri = await contract.tokenURI(tokenId)
      }
      setTokenUri(tokenUri);

      // Fetch the metadata JSON located at the tokenURI
      const uri = new URL(tokenUri);
      const scheme = uri.protocol;
      let metadata;
      if (scheme === 'data:') {
        metadata = JSON.parse(decodeDataUri(tokenUri));
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
      const metadataJson = JSON.stringify(metadata, undefined, 4)
      setMetadataJson(metadataJson.toString());

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
        console.log(decodeDataUri(imageUri));
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
