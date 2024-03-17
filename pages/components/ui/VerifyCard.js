import React from 'react';

const VerifyCardUI = ({ prop, inspectorHandler_Verify }) => {
    return (
        <div className="max-w-xl mx-auto my-4">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col lg:flex-row">
                <img src={prop.image} alt={prop.name} className="w-full lg:w-48 h-48 lg:h-auto object-cover" />
                <div className="p-6 flex-grow">
                    <h2 className="text-xl font-bold mb-2 text-gray-800">{prop.name}</h2>
                    <div className="flex mb-4">
                        <div className="w-1/2 pr-4">
                            <p className="text-gray-600 font-semibold">Price</p>
                            <p className="text-gray-800">{prop.price} ETH</p>
                        </div>
                        <div className="w-1/2 pl-4">
                            <p className="text-gray-600 font-semibold">Owner Name</p>
                            <p className="text-gray-800">{prop.userName}</p>
                        </div>
                    </div>
                    <div className="flex mb-4">
                        <div className="w-1/2 pr-4">
                            <p className="text-gray-600 font-semibold">Beds</p>
                            <p className="text-gray-800">{prop.beds}</p>
                        </div>
                        <div className="w-1/2 pl-4">
                            <p className="text-gray-600 font-semibold">Baths</p>
                            <p className="text-gray-800">{prop.baths}</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-gray-600 font-semibold">Address</p>
                        <p className="text-gray-800">{prop.address}</p>
                        <p className="text-gray-800">{prop.city}, {prop.pin}</p>
                        <p className="text-gray-800">{prop.state}</p>
                    </div>
                    <button
                        className="btn btn-success sm:btn-sm md:btn-md lg:btn-md mr-4"
                        onClick={() => inspectorHandler_Verify(prop)}
                    >
                        <img src='./check.png' width="25" height="25" className="" alt="approve" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerifyCardUI;
