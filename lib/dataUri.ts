export const decodeBase64DataURI = (dataUri: string): string => {
  // Split the data URI at the comma
  const parts = dataUri.split(',');

  // Check the encoding information to make sure it is "base64"
  if (!parts[0].endsWith(';base64')) {
    console.log('Invalid encoding');
    return '';
  }

  // Decode the base64 encoded data using the atob() function
  const decodedData = atob(parts[1]);
  return decodedData;
}
