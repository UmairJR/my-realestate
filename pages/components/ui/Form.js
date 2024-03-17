import React from 'react';
import { useState, useEffect } from 'react';

const FormUI = ({ isVerified, image, name, price, beds, baths, sqft, description, address, city, pin, state, disabled, uploadToW3Storage, createNFT, fileInputRef, loading, verifyHashKey }) => {
    const [hashKey, setHashKey] = useState('');
    return (
        <div className="w-full mt-5 sm:mt-8 flex justify-center">
            <div className="w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">

                <input
                    type="text"
                    placeholder="Enter Hash Key"
                    className="input input-bordered input-primary w-full max-w-lg"
                    onChange={(e) => setHashKey(e.target.value)}
                />
                <button className='btn btn-primary'
                    onClick={() => verifyHashKey(hashKey)}
                >Submit</button>
                {isVerified ? (
                    <>
                        <img src={image} />
                        <div className="flex gap-5">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Enter Property Name"
                                    value={name}
                                    className="input input-bordered input-primary w-full"
                                    disabled={disabled}
                                    readOnly
                                />

                            </div>
                            <div className="flex-1">
                                <input
                                    type="number"
                                    placeholder="Enter Property Price in ETH"
                                    value={price}
                                    className="input input-bordered input-primary w-full"
                                    disabled={disabled}
                                    readOnly
                                />
                                
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Beds"
                                value={beds}
                                className="input input-bordered input-primary w-full max-w-lg sm:w-1/4"
                                disabled={disabled}
                                readOnly
                            />
                            <input
                                type="number"
                                placeholder="Baths"
                                value={baths}
                                className="input input-bordered input-primary w-full max-w-lg sm:w-1/4"
                                disabled={disabled}
                                readOnly
                            />
                            <input
                                type="number"
                                placeholder="Enter Square Footage"
                                value={sqft}
                                className="input input-bordered input-primary w-full max-w-lg"
                                disabled={disabled}
                                readOnly
                            />
                        </div>
                        <textarea
                            className="textarea textarea-primary textarea-sm w-full max-w-lg"
                            value={address}
                            placeholder="Enter Street Address"
                            disabled={disabled}
                            readOnly
                        ></textarea>
                        <div className='flex gap-2'>
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                className="input input-bordered input-primary w-full max-w-lg"
                                disabled={disabled}
                                readOnly
                            />
                            <input
                                type="text"
                                placeholder="PIN Code"
                                value={pin}
                                className="input input-bordered input-primary w-full max-w-lg"
                                disabled={disabled}
                                readOnly
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="State"
                            value={state}
                            className="input input-bordered input-primary w-full max-w-lg"
                            disabled={disabled}
                            readOnly
                        />
                        <textarea
                            className="textarea textarea-primary textarea-sm w-full max-w-lg"
                            value={description}
                            placeholder="Enter Property Description"
                            disabled={disabled}
                            readOnly
                        ></textarea>

                        <button className='btn btn-primary sm:btn-sm md:btn-md lg:btn-md btn-wide'
                            onClick={createNFT}
                            disabled={disabled}
                        >
                            Add Property!
                        </button>
                    </>

                ) : (
                    <h1 className="text-3xl font-bold font-serif mb-4 text-center">Not Verified yet</h1>
                )}

                <a className='text-center'>
                    {loading ? (
                        <span className="loading loading-dots loading-md"></span>
                    ) : (
                        <span></span>
                    )}
                </a>
            </div>

        </div>
    );
};

export default FormUI;