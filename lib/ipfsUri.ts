export const convertIpfsUrlToGatewayUrl = (ipfsUri: URL) => {
  return `https://nftstorage.link/ipfs/${ipfsUri.pathname.replace(/^\/\//, "")}`
}
