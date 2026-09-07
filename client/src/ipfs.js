// ipfs.js
// Uploads files to IPFS via Pinata's pinning service.
// Sign up free at https://app.pinata.cloud/ and generate an API key + secret
// under Developers > API Keys. Add them to a .env file in your client root:
//
//   REACT_APP_PINATA_API_KEY=your_key_here
//   REACT_APP_PINATA_API_SECRET=your_secret_here
//
// Then restart the dev server (env vars are only read at startup).

import axios from 'axios';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_API_SECRET = process.env.REACT_APP_PINATA_API_SECRET;
const PINATA_BASE_URL = 'https://api.pinata.cloud';

/**
 * Uploads a Buffer (or File) to IPFS via Pinata.
 * Mirrors the old ipfs.files.add(buffer, callback) shape so existing
 * call sites need minimal changes — but this returns a Promise instead
 * of taking a callback, since axios is promise-based.
 *
 * @param {Buffer|File} fileData - the file contents to upload
 * @param {string} fileName - a name to store alongside the pin (optional)
 * @returns {Promise<string>} the IPFS content hash (CID)
 */
const addFile = async (fileData, fileName = 'upload') => {
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    throw new Error(
      'Pinata API credentials are missing. Set REACT_APP_PINATA_API_KEY and REACT_APP_PINATA_API_SECRET in your .env file.'
    );
  }

  const formData = new FormData();

  // fileData may be a raw Buffer/Uint8Array (from FileReader) or a File object
  const blob = fileData instanceof Blob ? fileData : new Blob([fileData]);
  formData.append('file', blob, fileName);

  const response = await axios.post(
    `${PINATA_BASE_URL}/pinning/pinFileToIPFS`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_API_SECRET,
      },
    }
  );

  // response.data.IpfsHash is the CID, same role as the old result[0].hash
  return response.data.IpfsHash;
};

/**
 * Unpins (deletes) a file from Pinata by its IPFS hash.
 * Use this for the "delete uploaded images" workflow.
 *
 * @param {string} ipfsHash - the CID to unpin
 */
const removeFile = async (ipfsHash) => {
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    throw new Error(
      'Pinata API credentials are missing. Set REACT_APP_PINATA_API_KEY and REACT_APP_PINATA_API_SECRET in your .env file.'
    );
  }

  await axios.delete(`${PINATA_BASE_URL}/pinning/unpin/${ipfsHash}`, {
    headers: {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    },
  });
};

const ipfs = { addFile, removeFile };

export default ipfs;