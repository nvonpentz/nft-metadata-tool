export const parseDataUri = (dataUri: string): { mimeType: string, encoding: string, buffer: string } => {
  const result = { mimeType: '', encoding: '', buffer: '' };
  const parts = dataUri.split(',');
  const metadata = parts[0].split(';');
  const mimeType = metadata[0].replace('data:', '');
  result.mimeType = mimeType;

  if (metadata[1] === 'base64') {
    result.encoding = 'base64';
  } else {
    result.encoding = 'utf8';
  }
  result.buffer = dataUri.split(parts[0] + ',')[1];
  return result;
}

export const decodeDataUri = (dataUri: string): string => {
  // parse the uri into mime type, encoding and buffer
  const { mimeType, encoding, buffer } = parseDataUri(dataUri);
  if (encoding === 'utf8') {
    // console.log('utf8 encoding', buffer);
    return buffer;
  } else if (encoding === 'base64') {
    // return Buffer.from(buffer, 'base64').toString('utf8');
    return atob(buffer);
  } else {
    throw new Error('Unknown encoding: ' + encoding);
  }
}
