import React from 'react'

const VerifyFormUI = ({
    setName,
    setDescription,
    setPrice,
    setBeds,
    setBaths,
    setSqft,
    setAddress,
    setCity,
    setPin,
    setState,
    loading,
    disabled,
    createNFT,
    uploadToW3Storage,
    validateFields,
    verifyProp,
    errors,
    makeCanvas
}) => {



    return (
        <div className="w-full mt-5 sm:mt-8 flex justify-center">
            <div className="w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
                <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    onChange={uploadToW3Storage}
                />
                <div className="flex gap-5">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Enter Property Name"
                            onChange={(e) => setName(e.target.value)}
                            className="input input-bordered input-primary w-full"
                            disabled={disabled}
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>
                    <div className="flex-1">
                        <input
                            type="number"
                            placeholder="Enter Property Price in ETH"
                            onChange={(e) => setPrice(e.target.value)}
                            className="input input-bordered input-primary w-full"
                            disabled={disabled}
                        />
                        {errors.price && <p className="text-red-500">{errors.price}</p>}
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Beds"
                        onChange={(e) => setBeds(e.target.value)}
                        className="input input-bordered input-primary w-full max-w-lg sm:w-1/4"
                        disabled={disabled}
                    />
                    {errors.beds && <p className="text-red-500">{errors.beds}</p>}
                    <input
                        type="number"
                        placeholder="Baths"
                        onChange={(e) => setBaths(e.target.value)}
                        className="input input-bordered input-primary w-full max-w-lg sm:w-1/4"
                        disabled={disabled}
                    />
                    {errors.baths && <p className="text-red-500">{errors.baths}</p>}
                    <input
                    type="number"
                    placeholder="Enter Square Footage"
                    onChange={(e) => setSqft(e.target.value)}
                    className="input input-bordered input-primary w-full max-w-lg"
                    disabled={disabled}
                />
                {errors.sqft && <p className="text-red-500">{errors.sqft}</p>}
                </div> 
                <textarea
                    className="textarea textarea-primary textarea-sm w-full max-w-lg"
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter Street Address"
                    disabled={disabled}
                ></textarea>
                {errors.address && <p className="text-red-500">{errors.address}</p>}
                <div className='flex gap-2'>
                <input
                    type="text"
                    placeholder="City"
                    onChange={(e) => setCity(e.target.value)}
                    className="input input-bordered input-primary w-full max-w-lg"
                    disabled={disabled}
                />
                {errors.city && <p className="text-red-500">{errors.city}</p>}
                
                <input
                    type="text"
                    placeholder="PIN"
                    onChange={(e) => setPin(e.target.value)}
                    className="input input-bordered input-primary w-full max-w-lg"
                    disabled={disabled}
                />
                {errors.pin && <p className="text-red-500">{errors.pin}</p>}
                </div>
                <input
                    type="text"
                    placeholder="State"
                    onChange={(e) => setState(e.target.value)}
                    className="input input-bordered input-primary w-full max-w-lg"
                    disabled={disabled}
                />
                {errors.state && <p className="text-red-500">{errors.state}</p>}
                
                <textarea
                    className="textarea textarea-primary textarea-sm w-full max-w-lg"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter Property Description"
                    disabled={disabled}
                ></textarea>
                {errors.description && <p className="text-red-500">{errors.description}</p>}
                <button
                    className="btn btn-primary sm:btn-sm md:btn-md lg:btn-md btn-wide"
                    onClick={makeCanvas}
                    disabled={disabled}
                >
                    Verify Property!
                </button>
                <a className="text-center">
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

export default VerifyFormUI