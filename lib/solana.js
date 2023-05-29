import fetch from 'node-fetch';
import { PublicKey } from '@solana/web3.js';
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

// Derives the associated metadata account for a mint address
const deriveAssociatedMetadataAccount = async (solanaMintAddress) => {
  const metadataProgramId = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );
  const metadataProgramDerivedAddress = await PublicKey.findProgramAddress(
    [
      Buffer.from("metadata"),
      new PublicKey(metadataProgramId).toBuffer(),
      new PublicKey(solanaMintAddress).toBuffer(),
    ],
    metadataProgramId
  );
  return metadataProgramDerivedAddress[0];
};

// Calls the getAccountInfo RPC method to get the info for a given account
const getAccountInfo = async (metadataAccount) => {
  const response = await fetch(process.env["NEXT_PUBLIC_SOLANA_ALCHEMY_API_URL"], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'getAccountInfo',
      params: [metadataAccount, { encoding: 'base64' }],
    }),
  });
  const json = await response.json();
  return json;
}

const decodeTokenUriFromAccountInfoResponse = (accountInfo) => {
  // Get the base64 encoded `data` from the account info response
  const metadataBase64 = accountInfo.result.value.data[0]

  // Base64 decode the data object
  const metadataBytes = Buffer.from(metadataBase64, 'base64')

  // Borsh decode decoded bytes as a Metadata object
  const metadata = Metadata.deserialize(metadataBytes)[0]

  // Strip null characters like this from the data uri
  // u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\
  const metadataUri = metadata.data.uri.replace(/\0/g, '')
  // Return the token URI
  return metadataUri
}

export const fetchSolanaTokenUri = async (mintAddress) => {
  const metadataAccount = await deriveAssociatedMetadataAccount(mintAddress);
  const accountInfo = await getAccountInfo(metadataAccount);
  return decodeTokenUriFromAccountInfoResponse(accountInfo);
}
