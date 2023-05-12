export const parseDataUri = (dataUri: string): { mimeType: string, encoding: string, buffer: string } => {
  const result = { mimeType: '', encoding: '', buffer: '' };
  const parts = dataUri.split(',');
  const metadata = parts[0].split(';');
  const mimeType = metadata[0].replace('data:', '');
  result.mimeType = mimeType;

  if (metadata[1] === 'base64') {
    result.encoding = 'base64';
  } else if (metadata[1] === 'utf8') {
    result.encoding = 'utf8';
  } else {
    result.encoding = 'uri';
  }
  result.buffer = dataUri.split(parts[0] + ',')[1];
  return result;
}

export const decodeDataUri = (dataUri: string): string => {
  const { mimeType, encoding, buffer } = parseDataUri(dataUri);
  if (encoding === 'utf8') {
    return buffer;
  } else if (encoding === 'uri') {
    // E.g. ?tokenId=414&contractAddress=0x0c60b40289ff15ff6afdfa668d1a743dc6e53cf3&network=mainnet
    return decodeURIComponent(buffer);
  } else if (encoding === 'base64') {
    return atob(buffer);
  } else {
    throw new Error('Unknown encoding: ' + encoding);
  }
}
