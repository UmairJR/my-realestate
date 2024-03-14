import React, { useEffect, useRef, useState } from 'react'
import { uploadFileToW3, initializeW3UpClient } from './utils/w3-storage';
import FormUI from './components/ui/Form';
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router';

const Add = ({web3, account, realEstate, escrow, escrow_address, realEstate_address}) => {
    const toast = useToast();
    const router = useRouter();
    const fileInputRef = useRef(null);
    console.log("RealEstate Contract Address: ",realEstate_address);
    console.log("Escrow Contract Address: ",escrow_address);
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        toast({
            title: 'Upload Image to proceed',
            status: 'info',
            duration: 3000,
            isClosable: true
        });
    }, []);

    const uploadToW3Storage = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                setLoading(true);
                await initializeW3UpClient();
                const cid = await uploadFileToW3(file);
                console.log(cid.toString());
                const url = `https://${cid}.ipfs.w3s.link`;
                console.log(url);
                setImage(url);
                toast({
                    title: 'Image Uploaded',
                    description: 'Your image has been uploaded successfully!',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
                setDisabled(false);
                setLoading(false);
            } catch (error) {
                console.log('W3 storage image upload error: ', error);
                toast({
                    title: 'Error',
                    description: 'An error occurred while uploading your image to W3Storage.',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
            }
        }

    };

    const createNFT = async () => {
        if (!image || !price || !name || !description) return;
        try {
            setLoading(true);
            await initializeW3UpClient();
            const obj = { image, price, name, description };
            // Create a Blob from the JSON object
            const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            // Create a File object from the Blob
            const file = new File([blob], 'prop-metadata.json');
            const cid = await uploadFileToW3(file);
            console.log(cid.toString());
            await mintThenList(cid);
            setLoading(false)
        } catch (error) {
            console.log('IPFS tokenURI ERROR ', error);
        }
    };

    const mintThenList = async (cid) => {
        const uri = `https://${cid}.ipfs.w3s.link`;
        console.log(uri)
        console.log("Minting....")
        try {
            // mint nft
            await (await realEstate.methods.mint(uri)).send({ from: account });
            console.log("Minted!!!!");
            toast({
                title: 'NFT Minted',
                description: 'Your NFT has been minted successfully!',
                status: 'success',
                duration: 4000,
                isClosable: true,
            });

            // get tokenId of new nft
            const id = await realEstate.methods.getTokenCount().call();

            // approve marketplace to spend nft
            await (await realEstate.methods.setApprovalForAll(escrow_address, true)).send({
                from: account,
            });
            console.log("Approved!!!!");
            toast({
                title: 'Approved',
                description: 'Approval given to Marketplace!',
                status: 'success',
                duration: 4000,
                isClosable: true,
              });

            // add nft to marketplace
            const listingPrice = web3.utils.toWei(price.toString(), 'ether');
            const gasPrice = await web3.eth.getGasPrice();
            const gasLimit = 200000;
            await escrow.methods.makeItem(realEstate_address, id, listingPrice).send({
                from: account,
            });

            toast({
                title: 'NFT Listed',
                description: 'Your NFT has been listed successfully!',
                status: 'success',
                duration: 4000,
                isClosable: true,
            });

            //await escrow.methods.listProperty(currPropId).call();
            router.push('/owned-property');
        } catch (err) {
            console.log(err);
            // Show error toast if something goes wrong
            toast({
                title: 'Error',
                description: 'An error occurred while minting and listing your NFT.',
                status: 'error',
                duration: 5000, // Adjust duration as needed
                isClosable: true,
            });
        }
        finally {
            setDisabled(true);
        }
        
    };

    return (
        <>
            <FormUI setName={setName} setPrice={setPrice} setDescription={setDescription} uploadToW3Storage={uploadToW3Storage} disabled={disabled} createNFT={createNFT} loading={loading} fileInputRef={fileInputRef} />
        </>
    );
}

export default Add