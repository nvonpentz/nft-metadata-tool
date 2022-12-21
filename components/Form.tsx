import styles from '../styles/Home.module.css'

interface Props {
  contractAddress: string;
  tokenId: number;
  setContractAddress: (contractAddress: string) => void;
  setTokenId: (tokenId: number) => void;
  handleNetworkChange: (network: string) => void;
  handleSubmit: () => void;
}

const Form = ({
  contractAddress,
  tokenId,
  setContractAddress,
  setTokenId,
  handleNetworkChange,
  handleSubmit
}: Props) => {
  return (
    <div className={styles.form}>
      <label htmlFor="contractAddress">Contract address:</label>
      <input
        type="search"
        id="contractAddress"
        name="contractAddress"
        value={contractAddress}
        onChange={(event) => setContractAddress(event.target.value)}
      />
      <label htmlFor="tokenId">Token ID:</label>
      <input
        type="number"
        id="tokenId"
        name="tokenId"
        min="0"
        max="100000"
        value={tokenId}
        onChange={(event) => setTokenId(Number(event.target.value))}
      />
      <label htmlFor="network">Network:</label>
      <select
        id="network"
        name="network"
        className="select"
        onChange={(event) => handleNetworkChange(event.target.value)}
      >
        <option value="mainnet">Mainnet</option>
        <option value="goerli">Goerli</option>
      </select>
      <button onClick={handleSubmit}>Fetch</button>
    </div>
  );
}

export default Form;
