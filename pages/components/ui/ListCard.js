import React, { useState } from 'react'

const ListCardUI = ({ prop, isNew, isListed, isSold, isPurchased, reListNft }) => {
    const [isReList, setIsReList] = useState(false);
    const [newPrice, setNewPrice] = useState(null);
    return (
        <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <figure className="overflow-hidden h-64">
                <img src={prop.image} alt={prop.name} className="w-full h-full object-cover" />
            </figure>
            <div className="card-body mt-2">
                <div className='card-title'>
                    <h2 className="text-lg font-semibold">{prop.name}</h2>
                    {isNew && <div className="badge badge-secondary">Newly Listed</div>}
                    {isSold && <div className="badge badge-success badge-outline">Sold</div>}
                    {isPurchased && <div className="badge badge-warning badge-outline">Purchased</div>}
                </div>
                <p className="text-gray-500">{prop.description}</p>
                <div className="mt-4 flex card-actions justify-between items-center">
                    <span className="text-primary-500 font-bold text-lg">
                        {isReList && isPurchased ? (
                            <input type="number" 
                            placeholder="Enter New Price" 
                            className="input input-bordered input-accent w-full max-w-xs" 
                            onChange={(e) => {
                                setNewPrice(e.target.value)
                            }}      
                            />
                        ) : (
                            (isListed && prop.price + " ETH") || (isSold && "Sold For " + prop.price + " ETH") || (isPurchased && "Purchased For " + prop.price + " ETH")
                        )}
                    </span>
                    {isPurchased ? (
                        isReList ? (
                            <button className='btn btn-accent sm:btn-sm md:btn-md lg:btn-md' onClick={() => reListNft(prop,newPrice)}>
                                List Now
                            </button>
                        ) : (
                            <button className='btn btn-accent btn-outline sm:btn-sm md:btn-md lg:btn-md' onClick={() => setIsReList(true)}>
                                Want to List this Nft?
                            </button>
                        )
                    ) : (
                        <>
                            {}
                        </>
                    )}


                </div>
                <div className="mt-2">
                    {isSold && <p className="text-sm text-gray-600">Buyer Address: {prop.buyer}</p>}
                </div>
            </div>
        </div>
    )
}

export default ListCardUI
