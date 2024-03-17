import { create } from '@web3-storage/w3up-client';

let w3upClient;

export const initializeW3UpClient = async () => {
  w3upClient = await create();
};

export const authorizeAgent = async (email) => {
    if (!w3upClient) {
      throw new Error('w3up client not initialized. Call initializeW3UpClient first.');
    }
  
    try {
      await w3upClient.authorize(email);
      console.log(`Agent authorized successfully for email: ${email}`);
    } catch (error) {
      console.error('Authorization failed:', error);
      throw error;
    }
  };
//realestate_verify-docs - did:key:z6MkgfG1bg3VJ2z6hacb326PVt8PHGX6cUfeb3iGYTnHTfMs
//realestate_all-properties - did:key:z6MkhfYqtJ5sehBMUbt82mEmijdxEGY8FmmJo98PSrTBDWht
//realestate_property-images - did:key:z6Mkqm7U5ZScA7s4kc2qVtrFumvMFFLaucp9D144hRvzFFop
export const uploadFileToW3 = async (file, spaceDid) => {
  if (!w3upClient) {
    throw new Error('w3up client not initialized. Call initializeW3UpClient first.');
  }

  try {
    // await authorizeAgent('umairjr1265@gmail.com');
    await w3upClient.setCurrentSpace(spaceDid);
    const cid = await w3upClient.uploadFile(file);
    console.log('File uploaded successfully. CID:', cid);
    return cid;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};