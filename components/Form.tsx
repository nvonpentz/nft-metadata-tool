import styles from '../styles/Home.module.css'

interface Props {
  contractAddress: string;
  setContractAddress: (contractAddress: string) => void;
  tokenId: number;
  setTokenId: (tokenId: number) => void;
  handleNetworkChange: (network: string) => void;
  handleSubmit: () => void;
  error: string;
}

const Form = ({
  contractAddress,
  setContractAddress,
  tokenId,
  setTokenId,
  handleNetworkChange,
  handleSubmit,
  error,
}: Props) => {
  return (
    <div className={styles.form}>
      <label htmlFor="contractAddress" className={styles.label}>ERC721 Contract Address</label>
      <input
        type="search"
        id="contractAddress"
        name="contractAddress"
        value={contractAddress}
        className={styles.formElement}
        onChange={(event) => setContractAddress(event.target.value)}
      />
      <label htmlFor="tokenId" className={styles.label}>Token ID</label>
      <input
        type="number"
        id="tokenId"
        name="tokenId"
        min="0"
        max="100000"
        value={tokenId}
        className={styles.formElement}
        onChange={(event) => setTokenId(Number(event.target.value))}
      />
      <label htmlFor="network" className={styles.label}>Network</label>
      <select
        id="network"
        name="network"
        className={styles.formElement}
        onChange={(event) => handleNetworkChange(event.target.value)}
      >
        <option value="mainnet">Mainnet</option>
        <option value="goerli">Goerli</option>
      </select>
      <button className={`${styles.formElement} ${styles.button}`} onClick={handleSubmit}>Fetch</button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Form;
