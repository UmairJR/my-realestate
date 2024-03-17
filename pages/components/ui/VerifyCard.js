import React from 'react';

const VerifyCardUI = ({ prop, inspectorHandler_Verify }) => {
    return (
        <div className="max-w-xl mx-auto my-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
                <img src={prop.image} alt={prop.name} className="w-full h-auto object-cover" />
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">{prop.name}</h2>
                    <div className="flex flex-col lg:flex-row lg:justify-between mb-4">
                        <div className="w-full lg:w-auto mb-4 lg:mb-0">
                            <p className="text-gray-600 font-semibold">Owner</p>
                            <p className="text-gray-800">{prop.userName}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 font-semibold">Price</p>
                            <p className="text-gray-800">{prop.price} ETH</p>
                        </div>
                    </div>
                    <div className="flex mb-4">
                    <div className="w-1/3 pr-4">
                            <p className="text-gray-600 font-semibold">Beds</p>
                            <p className="text-gray-800">{prop.beds}</p>
                        </div>
                        <div className="w-1/3 pr-4">
                            <p className="text-gray-600 font-semibold">Baths</p>
                            <p className="text-gray-800">{prop.baths}</p>
                        </div>
                        <div className="w-1/3 pr-4">
                            <p className="text-gray-600 font-semibold">Sqft</p>
                            <p className="text-gray-800">{prop.sqft}</p>
                        </div>
                        
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-600 font-semibold">Address</p>
                        <p className="text-gray-800">{prop.address}</p>
                        <p className="text-gray-800">{prop.city}, {prop.pin}</p>
                        <p className="text-gray-800">{prop.state}</p>
                    </div>
                    <button
                        className="btn btn-success w-full"
                        onClick={() => inspectorHandler_Verify(prop)}
                    >
                        <img src='./check.png' width="25" height="25" className="mr-2" alt="approve" />
                       
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyCardUI;
