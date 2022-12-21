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
    <div>
        <input
          type="search"
          name="contractAddress"
          value={contractAddress}
          onChange={(event) => setContractAddress(event.target.value)}
        />
        <input
          type="number"
          name="tokenId"
          min="0"
          max="100000"
          value={tokenId}
          onChange={(event) => setTokenId(event.target.value)}
        />
        <select
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
