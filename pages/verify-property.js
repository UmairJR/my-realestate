import React, { useEffect, useRef, useState } from 'react'
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import { uploadFileToW3, initializeW3UpClient } from './utils/w3-storage';
import FormUI from './components/ui/Form';
import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router';
import VerifyFormUI from './components/ui/VerifyForm';
import axios from 'axios';
import { database } from './utils/firebaseConfig';
import { ref, set, onValue, update } from 'firebase/database';
import VerifyCardUI from './components/ui/VerifyCard';
import download from 'downloadjs';

const VerifyProp = ({ web3, account, hashStorage, currentUserId, aadhaarName, isInspector }) => {
    const toast = useToast();
    const router = useRouter();
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
    const [errors, setErrors] = useState({});
    const [ok, setOk] = useState('');
    const [dataUrl, setDataUrl] = useState('');
    const [doc, setDoc] = useState('');
    const [metadata, setMetadata] = useState('');
    const [props, setProps] = useState([]);
    const [hasVerified, setHasVerified] = useState(false);
    const [approvalHandled, setApprovalHandled] = useState(false);
    const did_prop_images = "did:key:z6Mkqm7U5ZScA7s4kc2qVtrFumvMFFLaucp9D144hRvzFFop";
    const did_all_props = "did:key:z6MkhfYqtJ5sehBMUbt82mEmijdxEGY8FmmJo98PSrTBDWht";
    const did_verify_docs = "did:key:z6MkgfG1bg3VJ2z6hacb326PVt8PHGX6cUfeb3iGYTnHTfMs";
    //realestate_verify-docs - did:key:z6MkgfG1bg3VJ2z6hacb326PVt8PHGX6cUfeb3iGYTnHTfMs
    //realestate_all-properties - did:key:z6MkhfYqtJ5sehBMUbt82mEmijdxEGY8FmmJo98PSrTBDWht
    //realestate_property-images - did:key:z6Mkqm7U5ZScA7s4kc2qVtrFumvMFFLaucp9D144hRvzFFop
    console.log(isInspector);

    useEffect(() => {
        if (isInspector) {
            loadPropsForInspector();
        }
        else {
            handleApproval();
        }
    }, [isInspector]);

    const handleApproval = async () => {
        try {
            console.log("Handling...");
            const verifiedRef = ref(database, `/verifyProp/${currentUserId}`);
            onValue(verifiedRef, (snapshot) => {
                if (snapshot.exists()) {
                    console.log("Approval Started....");
                    const cid = snapshot.val().cid;
                    const metadata = snapshot.val().metadata;
                    const hasVerified = snapshot.val().hasVerified;
                    if (hasVerified) {
                        downloadDocument(metadata, cid);
                    }
                }
            });
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    const downloadDocument = async (metadata, cid) => {
        try {
            const response = await axios.get(metadata);
            console.log(response.data);
            const docLink = response.data.docLink;
            const response_blob = await axios.get(docLink, {
                responseType: 'blob',
            });
            download(response_blob.data, 'downloaded_image.jpg', 'image/jpeg');
            console.log(metadata);
            const ipfsLink = metadata;
            const parts = ipfsLink.split('.');
            console.log(parts);
            const cid = parts[0].substring(parts[0].lastIndexOf('/') + 1);
            console.log(cid);
            console.log(cid);

            console.log(cid);
            console.log("CID: ", cid);
            toast({
                title: 'Your HashKey',
                description: `HashKey: ${cid} `,
                status: 'success',
                duration: 15000,
                isClosable: true,
            });
            console.log('Image downloaded successfully!');
        } catch (error) {
            console.error('Error downloading document:', error);
        }
    };

    const uploadToW3Storage = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (typeof file !== 'undefined') {
            try {
                setLoading(true);
                await initializeW3UpClient();
                const cid = await uploadFileToW3(file, did_prop_images);
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
    }
    const validateFields = () => {
        const errors = {
            name: '',
            description: '',
            price: '',
            beds: '',
            baths: '',
            sqft: '',
            address: '',
            city: '',
            pin: '',
            state: ''
        };

        if (!name) {
            errors.name = 'Please enter a property name.';
        }
        if (!description) {
            errors.description = 'Please enter a property description.';
        }
        if (!price) {
            errors.price = 'Please enter a property price.';
        }
        if (!/^[1-9]$/.test(beds)) {
            errors.beds = 'Please enter a valid number of beds (1-9).';
        }
        if (!/^[1-9]$/.test(baths)) {
            errors.baths = 'Please enter a valid number of baths (1-9).';
        }
        if (!sqft) {
            errors.sqft = 'Please enter square footage.';
        }
        if (!address) {
            errors.address = 'Please enter a property address.';
        }
        if (!city) {
            errors.city = 'Please enter a city.';
        }
        if (!/^[0-9]{6}$/.test(pin)) {
            errors.pin = 'Please enter a valid PIN Code (7 digits).';
        }
        if (!state) {
            errors.state = 'Please enter a state.';
        }
        setErrors(errors);
        return errors;
    };
    const makeMetadata = async () => {
        console.log(aadhaarName, image, name, price, beds, baths, address, city, pin, state, description);
        try {
            setLoading(true);
            const obj = { aadhaarName, image, name, price, beds, baths, address, city, pin, state, description };
            // Create a Blob from the JSON object
            const meta_blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            // Create a File object from the Blob
            const file = new File([blob], 'prop-metadata.json');
            const metadata_cid = await uploadFileToW3(file, did_verify_docs);
            console.log(metadata_cid.toString());
            console.log(`https://${metadata_cid}.ipfs.w3s.link`);
            setLoading(false)
        } catch (error) {
            console.log('IPFS tokenURI ERROR ', error);
        }
    };

    // const makeCanvas = () => {
    //     // Form data
    //     const formData = {
    //         name,
    //         price,
    //         beds,
    //         baths,
    //         sqft,
    //         description,
    //         address,
    //         city,
    //         pin,
    //         state
    //     };

    //     // Create a hidden div element to hold the card content
    //     // const hiddenDiv = document.createElement('div');

    //     // // Apply styles using regular CSS


    //     // // Populate the hidden div with form data
    //     // for (const [key, value] of Object.entries(formData)) {
    //     //     const field = document.createElement('div');

    //     //     // Apply styles using regular CSS
    //     //     field.style.marginBottom = '0.5rem';
    //     //     field.style.fontSize = '1.25rem';
    //     //     field.style.fontWeight = 'bold';
    //     //     field.textContent = `${key}: ${value}`;
    //     //     hiddenDiv.appendChild(field);
    //     // }

    //     // Append the hidden div to the body (to ensure proper rendering)
    //     // document.body.appendChild(hiddenDiv);
    //     const hiddenDiv = document.getElementById('hidden-div');

    //     // Wait for the hidden div to be rendered before capturing it
    //     setTimeout(() => {
    //         // Convert the hidden div to PNG image
    //         toPng(hiddenDiv,{ quality: 0.95, backgroundColor: "pink"})
    //             .then(function (dataUrl) {
    //                 // Create a temporary link element
    //                 console.log(dataUrl);
    //                 download(dataUrl, 'property_data.png');
    //             })
    //             .catch(function (error) {
    //                 console.error('Error generating canvas:', error);
    //             });

    //         // Remove the hidden div from the DOM after conversion
    //         // document.body.removeChild(hiddenDiv);
    //     }, 500); // Adjust the delay as needed to ensure proper rendering
    // };
    const makeCanvas = () => {
        const hiddenDiv = document.getElementById('hidden-div');

        if (!hiddenDiv) {
            console.error('Hidden div not found');
            return;
        }

        // Log the content of the hidden div
        console.log('Hidden div content:', hiddenDiv.innerHTML);

        // Wait for the hidden div to be rendered before capturing it
        console.log('State variables:', { name, price, beds, baths, sqft, description, address, city, pin, state });
        toPng(hiddenDiv, { quality: 0.95, backgroundColor: "white" })
            .then(function (dataUrl) {
                console.log('Data URL:', dataUrl);
                // setDataUrl(dataUrl);
                makeHashKeyAndStore(dataUrl);
                // download(dataUrl, 'property_data.png');
            })
            .catch(function (error) {
                console.error('Error generating canvas:', error);
            });

    };

    const addInFirebase = async (currentUserId, aadhaarName, metadata) => {
        const verificationRef = ref(database, `/verifyProp/${currentUserId}`);
        console.log(currentUserId);
        set(verificationRef, {
            owner: aadhaarName,
            metadata: metadata,
            hasVerified: false
        })
            .then(() => {
                console.log("Added Successfully in Firebase!!");
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const makeHashKeyAndStore = async (dataUrl) => {
        try {
            await initializeW3UpClient();
            //Doc -----
            const data = dataUrl.split(',')[1];
            console.log(data);
            const doc_blob = await fetch(`data:application/octet-stream;base64,${data}`).then(response => response.blob());
            console.log(doc_blob);
            const doc_file = new File([doc_blob], 'prop-doc-image.json');
            const cid = await uploadFileToW3(doc_file, "did:key:z6MkgfG1bg3VJ2z6hacb326PVt8PHGX6cUfeb3iGYTnHTfMs");
            console.log(cid.toString());
            console.log(`https://${cid}.ipfs.w3s.link`);
            setDoc(`https://${cid}.ipfs.w3s.link`);

            //Metadata -----
            const obj = {
                docLink: `https://${cid}.ipfs.w3s.link`,
                docHash: cid.toString(),
                userName: aadhaarName,
                currentUserId: currentUserId,
                image,
                name,
                price,
                beds,
                baths,
                address,
                city,
                pin,
                state,
                description
            };
            const meta_blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
            const metdata_file = new File([meta_blob], 'prop-metadata.json');
            const metadata_cid = await uploadFileToW3(metdata_file, "did:key:z6MkgfG1bg3VJ2z6hacb326PVt8PHGX6cUfeb3iGYTnHTfMs");
            console.log(metadata_cid.toString());
            console.log(`https://${metadata_cid}.ipfs.w3s.link`);
            setMetadata(`https://${metadata_cid}.ipfs.w3s.link`);
            addInFirebase(currentUserId, aadhaarName, `https://${metadata_cid}.ipfs.w3s.link`, metadata_cid);

        } catch (error) {
            console.error('Error uploading Data URL to IPFS:', error);
        }
    };

    const verifyProp = () => {
        validateFields();
        console.log("OK");
        setOk('OK');

    }




    //Inspector

    const loadPropsForInspector = () => {
        const verificationRef = ref(database, '/verifyProp');
        let props = [];

        // Listen for changes to the data
        onValue(verificationRef, async (snapshot) => {

            const data = snapshot.val();

            // Iterate over each property in the data
            for (const userId in data) {
                if (Object.hasOwnProperty.call(data, userId)) {
                    console.log(data[userId], data[userId].hasVerified);
                    if (!data[userId].hasVerified) {
                        const userProps = data[userId];
                        // Extract metadata from each user's properties
                        const metadata = userProps.metadata;
                        const response = await axios.get(metadata);
                        console.log("RESPONSE: ", response)
                        const alldata = response.data;
                        console.log("AllDATA: ", alldata);
                        // Push metadata into the props array
                        props.push({
                            docLink: alldata.docLink,
                            docHash: alldata.docHash,
                            userName: alldata.userName,
                            currentUserId: alldata.currentUserId,
                            image: alldata.image,
                            name: alldata.name,
                            price: alldata.price,
                            beds: alldata.beds,
                            baths: alldata.baths,
                            address: alldata.address,
                            city: alldata.city,
                            pin: alldata.pin,
                            state: alldata.state,
                            description: alldata.description
                        });
                    }

                }
            }

            console.log(props);
            setProps(props);
        });
    }

    const inspectorHandler_Verify = async (prop) => {
        console.log("Verifying..");
        const verificationRef = ref(database, `/verifyProp/${prop.currentUserId}`);
        try {
            await update(verificationRef, {
                hasVerified: true
            });
            console.log("Updated Successfully in Firebase!!");
            toast({
                title: 'Property Verified',
                description: `${prop.userName}'s property has been verified successfully!`,
                status: 'success',
                duration: 4000,
                isClosable: true,
            });

            const isStored = await hashStorage.methods.isStored(prop.docHash).call();
            console.log("isStored: ", isStored);
            if (!isStored) {
                console.log("docHash: ", prop.docHash);
                console.log("Account: ", account);
                const tx = await hashStorage.methods.storeHashKey(prop.docHash).send({
                    from: account
                });
                console.log('Transaction hash:', tx.transactionHash);
                toast({
                    title: 'Hashkey Stored',
                    description: `Hashkey has been stored in Blockchain successfully!`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            else {
                toast({
                    title: 'Already Hashkey Stored',
                    description: `Hashkey is already stored in Blockchain!`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
            loadPropsForInspector();
        } catch (error) {
            console.log(error);
        }
    };

    const reLoadPage = () => {
        if (isInspector) {
            setProps([]);
            loadPropsForInspector();
        }
    }
    return (
        <>
            {isInspector ? (
                <div className="mt-5 mb-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold font-serif text-center">Properties to Verify</h1>
                        </div>
                        <button
                            className="btn btn-square btn-ghost sm:btn-sm md:btn-md lg:btn-md mr-4"
                            onClick={reLoadPage}
                        >
                            <img src='./reload.png' width="25" height="25" className="" alt="approve" />
                        </button>
                    </div>
                    <div className="px-5 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-center">
                        {props.length > 0 ? (
                            props.map((prop, idx) => (
                                <div key={idx}>
                                    <VerifyCardUI
                                        prop={prop}
                                        inspectorHandler_Verify={inspectorHandler_Verify}
                                    />
                                </div>
                            ))
                        ) : (
                            <main style={{ padding: "1rem 0" }}>
                                <h1 className="text-3xl font-bold font-serif mb-4 text-center">No Properties to Verify</h1>
                            </main>
                        )}
                    </div>
                </div>
            ) : (
                <div className='flex gap-2'>
                    <div className='flex-1'>
                        <VerifyFormUI
                            setName={setName}
                            setPrice={setPrice}
                            setBeds={setBeds}
                            setBaths={setBaths}
                            setSqft={setSqft}
                            setDescription={setDescription}
                            setAddress={setAddress}
                            setCity={setCity}
                            setPin={setPin}
                            setState={setState}
                            validateFields={validateFields}
                            uploadToW3Storage={uploadToW3Storage}
                            verifyProp={verifyProp}
                            errors={errors}
                            disabled={disabled}
                            makeCanvas={makeCanvas}
                            loading={loading}
                        />
                    </div>
                    {ok}
                    <div className='flex-1'>
                        <div className="flex justify-center items-center h-screen">
                            <div id="hidden-div" className="bg-gray-100 border border-gray-300 p-6 shadow-lg rounded-lg w-full max-w-md">
                                {image && <div className="flex justify-center mb-4">
                                    <img src={image} className="rounded-lg" alt="Property Image" />
                                </div>}
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold mb-2">Property Information</h2>
                                    <div className="flex flex-wrap">
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">Owner:</span> {aadhaarName}
                                        </div>
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">Name:</span> {name}
                                        </div>
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">Price:</span> {price}
                                        </div>
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">Beds:</span> {beds}
                                        </div>
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">Baths:</span> {baths}
                                        </div>
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">Sqft:</span> {sqft}
                                        </div>
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">Address:</span> {address}
                                        </div>
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">City:</span> {city}
                                        </div>
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">PIN:</span> {pin}
                                        </div>
                                        <div className="w-full md:w-1/2 mb-2">
                                            <span className="font-bold">State:</span> {state}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>This document contains property information and is intended for internal use only.</p>
                                    <p>Do not share this document with unauthorized individuals.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>)
            }
            {doc && <img src={doc} />}
        </>
    )
}

export default VerifyProp