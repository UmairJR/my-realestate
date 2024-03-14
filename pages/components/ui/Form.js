import React from 'react';
import { useState, useEffect } from 'react';

const FormUI = ({ setName, setDescription, setPrice, disabled, uploadToW3Storage, createNFT, fileInputRef, loading }) => {
    return (
        <div className="w-full mt-5 sm:mt-8 flex justify-center">
            <div className="w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">

                <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    onChange={uploadToW3Storage}
                    ref={fileInputRef}
                />
                <input
                    type="text"
                    placeholder="Enter Property Name"
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered input-primary w-full max-w-lg"
                    disabled={disabled}
                />
                <textarea
                    className="textarea textarea-primary textarea-sm w-full max-w-lg"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter Property Description"
                    disabled={disabled}
                ></textarea>
                <input
                    type="number"
                    placeholder="Enter Property Price in ETH"
                    onChange={(e) => setPrice(e.target.value)}
                    className="input input-bordered input-primary w-full max-w-lg"
                    disabled={disabled}
                />

                <button className='btn btn-primary sm:btn-sm md:btn-md lg:btn-md btn-wide'
                    onClick={createNFT}
                    disabled={disabled}
                >
                    Add Property!
                </button>
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