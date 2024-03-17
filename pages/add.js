import React, { useEffect, useRef, useState } from 'react'
import { uploadFileToW3, initializeW3UpClient } from './utils/w3-storage';
import FormUI from './components/ui/Form';
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import axios from 'axios';

const Add = ({ web3, account, realEstate, escrow, escrow_address, realEstate_address, hashStorage }) => {
    const toast = useToast();
    const router = useRouter();
    const fileInputRef = useRef(null);
    console.log("RealEstate Contract Address: ", realEstate_address);
    console.log("Escrow Contract Address: ", escrow_address);
    const [image, setImage] = useState('');
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [beds, setBeds] = useState('');
    const [baths, setBaths] = useState('');
    const [sqft, setSqft] = useState(null);
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [pin, setPin] = useState(null);
    const [state, setState] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const did_all_props = "did:key:z6MkhfYqtJ5sehBMUbt82mEmijdxEGY8FmmJo98PSrTBDWht";

    useEffect(() => {
        toast({
            title: 'Upload Image to proceed',
            status: 'info',
            duration: 3000,
            isClosable: true
        });
    }, []);

    const verifyHashKey = async (hashKey) => {
        const url = `https://${hashKey}.ipfs.w3s.link`;
        try {
            setLoading(true);
            const response = await axios.get(url);
            console.log(response.data);
            const metadata = response.data;
            const docHash = metadata.docHash;
            setImage(metadata.image);
            setName(metadata.name);
            setPrice(metadata.price);
            setDescription(metadata.description);
            setBeds(metadata.beds);
            setBaths(metadata.baths);
            setPin(metadata.pin);
            setSqft(metadata.sqft);
            setAddress(metadata.address);
            setCity(metadata.city);
            setState(metadata.state); console.log("Blockchain stored hash: ", docHash);
            const isStored = await hashStorage.methods.isStored(docHash).call();
            console.log("isStored: ", isStored);
            if (isStored) {
                toast({
                    title: 'Valid Seller',
                    description: 'You are a Valid seller!',
                    status: 'success',
                    duration: 4000,
                    isClosable: true,
                });
                setDisabled(false);
                setIsVerified(true);
            }
            else {
                toast({
                    title: 'Not a Valid Seller',
                    description: 'You are a Not a valid seller!',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
                setDisabled(true);
                setIsVerified(false);
            }
            setLoading(false);
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('Invalid hash key:', hashKey);
                toast({
                    title: 'Not a Valid Seller',
                    description: 'You are a Not a valid seller!',
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                });
                setDisabled(true);
                setIsVerified(false);
            } else {
                console.error('Error verifying hash key:', error);
            }
        }
    }

    const uploadToW3Storage = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                setLoading(true);
                await initializeW3UpClient();
                const cid = await uploadFileToW3(file, did_all_props);
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
        if (!image || !name || !price || !beds || !baths || !sqft || !description || !address || !city || !pin || !state) return;
        try {
            setLoading(true);
            await initializeW3UpClient();
            const obj = { image, price, name, beds, baths, sqft, description, address, city, pin, state };
            // Create a Blob from the JSON object
            const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            // Create a File object from the Blob
            const file = new File([blob], 'prop-metadata.json');
            const cid = await uploadFileToW3(file, did_all_props);
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
            <FormUI
                isVerified={isVerified}
                image={image}
                name={name}
                price={price}
                beds={beds}
                baths={baths}
                sqft={sqft}
                description={description}
                address={address}
                city={city}
                pin={pin}
                state={state}
                uploadToW3Storage={uploadToW3Storage}
                disabled={disabled}
                createNFT={createNFT}
                loading={loading}
                fileInputRef={fileInputRef}
                verifyHashKey={verifyHashKey}
            />
        </>
    );
}

export default Add