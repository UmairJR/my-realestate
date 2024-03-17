import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardUI from './components/ui/Card';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react'
import { database } from './utils/firebaseConfig';
import { get, set, ref, update } from 'firebase/database';

const OwnedProperty = ({ web3, account, realEstate, escrow, escrow_address, realEstate_address, aadhaarName }) => {
    const [loading, setLoading] = useState(true);
    const [txLoading, setTxLoading] = useState(false);
    const [properties, setProperties] = useState([]);
    const router = useRouter();
    const toast = useToast();

    const addInFirebase = async (propId, aadhaarName) => {
        const propStatusRef = ref(database, `/propStatus/${propId}`);
        set(propStatusRef, {
            hasBought: false,
            hasInspected: false,
            hasSold: false,
            name: aadhaarName
        })
            .then(() => {
                console.log("Added Successfully in Firebase!!");
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const updateInFirebase = async (propId, hasBought, hasInspected, hasSold) => {
        const propStatusRef = ref(database, `/propStatus/${propId}`);

        const updates = {};
        if (hasBought !== undefined) {
            updates.hasBought = hasBought;
        }
        if (hasInspected !== undefined) {
            updates.hasInspected = hasInspected;
        }
        if (hasSold !== undefined) {
            updates.hasSold = hasSold;
        }

        update(propStatusRef, updates)
            .then(() => {
                console.log("Updated Successfully in Firebase!!");
            })
            .catch((error) => {
                console.log(error);
            });
    };



    const loadOwnedProperties = async () => {
        console.log('Loading....');
        try {
            const totalItems = await escrow.methods.getItemCount().call();
            console.log("Total item count: ", totalItems);
            let props = [];
            for (let i = 1; i <= totalItems; i++) {
                const prop = await escrow.methods.props(i).call();
                console.log("Prop: ", prop);
                if (prop.seller.toLowerCase() === account) {
                    const uri = await realEstate.methods.tokenURI(prop.tokenId).call();
                    console.log("URI: ", uri);
                    const response = await axios.get(uri);
                    console.log("RESPONSE: ", response)
                    // console.log("RESPONSE JSON: ",response.json())
                    const metadata = response.data;
                    console.log("METADATA: ", metadata);
                    const ownerOf = await realEstate.methods.ownerOf(prop.tokenId).call();
                    console.log(prop.propertyId + ": " + ownerOf);
                    // const totalPrice = await mpContract.methods.getTotalPrice(item.itemId).call();
                    // console.log("TOTALPRICE: ", totalPrice);
                    const totalPrice = prop.price;
                    const totalPriceEther = web3.utils.fromWei(totalPrice.toString(), 'ether');
                    props.push({
                        totalPrice,
                        price: totalPriceEther,
                        propId: prop.propertyId,
                        seller: prop.seller,
                        buyer: prop.buyer,
                        name: metadata.name,
                        description: metadata.description,
                        image: metadata.image,
                        price: metadata.price,
                        beds: metadata.beds,
                        baths: metadata.baths,
                        sqft: metadata.sqft,
                        address: metadata.address,
                        city: metadata.city,
                        pin: metadata.pin,
                        state: metadata.state,
                        isListed: prop.propertyInfo.isListed,
                        sold: prop.sold
                    })
                }
            }
            setLoading(false);
            console.log("Properties: ", props);
            setProperties(props);
        }
        catch (err) {
            console.log(err);
        }

    }
    const listProp = async (prop) => {
        console.log("Listing....")
        try {
            setTxLoading(true);
            console.log(prop.propId)
            const tx = await escrow.methods.listProperty(prop.propId).send({
                from: account
            });
            console.log(tx)

            toast({
                title: 'Property Listed',
                description: 'Your Property has been listed successfully!',
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
            if (!prop.sold) {
                await addInFirebase(prop.propId, aadhaarName);
            }
            loadOwnedProperties();
            setTxLoading(false);
            router.push('/listed-property');
        }
        catch (error) {
            console.error("Error listing property:", error);
            toast({
                title: 'Error',
                description: 'An error occurred listing your Property.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            console.log("Listed!!!");
        }
    }
    const reListProp = async (prop, price) => {
        try {
            setTxLoading(true);
            const listingPrice = web3.utils.toWei(price.toString(), 'ether');
            //give approval
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
            //transfer nft to contract (relisting)
            await escrow.methods.nftTransferToContract(prop.propId, listingPrice).send({
                from: account,
            });
            console.log("Transfered!!!!");
            toast({
                title: 'Transfered',
                description: 'Transfered to Contract!',
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
            //isListed = true in blockchain
            const tx = await escrow.methods.listProperty(prop.propId).send({
                from: account
            });
            console.log(tx)

            toast({
                title: 'Property Re-Listed',
                description: 'Your Property has been re-listed successfully!',
                status: 'success',
                duration: 4000,
                isClosable: true,
            });
            await addInFirebase(prop.propId, aadhaarName);

            loadOwnedProperties()
            setTxLoading(false);
            router.push('/listed-property');
        }
        catch (err) {
            console.log(err);
            toast({
                title: 'Error',
                description: 'An error occurred re-listing your Property.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }
    useEffect(() => {
        loadOwnedProperties();
    }, [])

    if (loading) return (
        <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <span className="loading loading-ring loading-md"></span>
            <p className='mx-3 my-0 font-bold text-lg text-primary'>Loading...</p>
        </main>
    )
    return (
        <div className="mt-5 mb-10">
            <h1 className="text-3xl font-bold font-serif mb-4 text-center">Owned Properties</h1>
            <div className="px-5 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-center">
                {properties.length > 0 ? (
                    properties.map((prop, idx) => (
                        <div key={idx}>
                            <CardUI prop={prop} listProp={listProp} reListProp={reListProp} isNew={idx === properties.length - 1} isOwned={true} />
                        </div>
                    )).reverse()
                ) : (
                    <main style={{ padding: "1rem 0" }}>
                        <h1 className="text-3xl font-bold font-serif mb-4 text-center">No Properties to List</h1>
                    </main>
                )}
            </div>
            <a className='text-center'>
                {txLoading ? (
                    <span className="loading loading-dots loading-md"></span>
                ) : (
                    <span></span>
                )}
            </a>
        </div>
    );
}

export default OwnedProperty
