import styles from '../styles/Home.module.css'

interface Props {
  contractAddress: string;
  setContractAddress: (contractAddress: string) => void;
  tokenId: number | undefined;
  setTokenId: (tokenId: number | undefined) => void;
  network: string;
  setNetwork: (network: string) => void;
  handleSubmit: () => void;
  error: string;
}

const Form = ({
  contractAddress,
  setContractAddress,
  tokenId,
  setTokenId,
  network,
  setNetwork,
  handleSubmit,
  error,
}: Props) => {
  return (
    <div className={styles.form}>
      <label htmlFor="network" className={styles.label}>Network</label>
      <select
        id="network"
        name="network"
        value={network}
        className={styles.formElement}
        onChange={(event) => setNetwork(event.target.value)}
      >
        <option value="mainnet">Ethereum Mainnet</option>
        <option value="goerli">Goerli</option>
        <option value="sepolia">Sepolia</option>
        <option value="arbitrum">Arbitrum</option>
        <option value="matic">Polygon</option>
        <option value="optimism">Optimism</option>
        <option value="solana">Solana Mainnet</option>
      </select>
      <label htmlFor="contractAddress" className={styles.label}>
        {network === "solana"
        ? "Mint Address"
        : "ERC721 Contract Address"}
      </label>
      <input
        type="search"
        id="contractAddress"
        name="contractAddress"
        value={contractAddress}
        className={styles.formElement}
        onChange={(event) => setContractAddress(event.target.value)}
      />
      {network !== "solana" && (
        <>
          <label htmlFor="tokenId" className={styles.label}>Token ID</label>
          <input
            type="number"
            id="tokenId"
            name="tokenId"
            value={tokenId}
            placeholder=""
            className={styles.formElement}
            onChange={(event) => setTokenId(
              event.target.value === ""
              ? undefined
              : Number(event.target.value)
            )}
          />
        </>
      )}
      <button
        className={`${styles.formElement} ${styles.button}`}
        onClick={handleSubmit}
        disabled={contractAddress === "" || (tokenId === undefined && network !== "solana")}>
        Fetch
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

export default Form;
