import React, { useEffect, useState } from 'react'
import { onValue, ref } from 'firebase/database';
import { database } from '../../utils/firebaseConfig'

const CardUI = ({ prop, buyProp, listProp, isInspector, isNew, isDiscover, isOwned, account, sellerHandler, inspectorHandler_Approve, inspectorHandler_Reject, reListProp }) => {

    const [hasBought, setHasBought] = useState();
    const [hasInspected, setHasInspected] = useState();
    const [hasSold, setHasSold] = useState();
    const [isReList, setIsReList] = useState(false);
    const [newPrice, setNewPrice] = useState(null);

    useEffect(() => {
        const hasBoughtRef = ref(database, `/propStatus/${prop.propId}/hasBought`);
        const hasInspectedRef = ref(database, `/propStatus/${prop.propId}/hasInspected`);
        const hasSoldRef = ref(database, `/propStatus/${prop.propId}/hasSold`);

        const unsubscribeHasBought = onValue(hasBoughtRef, (snapshot) => {
            setHasBought(snapshot.val() || false);
        });

        const unsubscribeHasInspected = onValue(hasInspectedRef, (snapshot) => {
            setHasInspected(snapshot.val() || false);
        });

        const unsubscribeHasSold = onValue(hasSoldRef, (snapshot) => {
            setHasSold(snapshot.val() || false);
        });

        return () => {
            unsubscribeHasBought();
            unsubscribeHasInspected();
            unsubscribeHasSold();
        };
    }, [prop.propId]);



    const renderButton = (prop, isDiscover, isOwned, account, isInspector, hasInspected, hasBought, hasSold, listProp, buyProp, sellerHandler, inspectorHandler_Approve, inspectorHandler_Reject) => {
        const isSeller = prop.seller.toLowerCase() === account;
        const isBuyer = prop.buyer.toLowerCase() === account;
        console.log(hasBought, isInspector);
        console.log("Prop ID: " + prop.propId + " Inspected:" + hasInspected + " Bought: " + hasBought + " Sold: " + hasSold)
        if (isDiscover) {
            if (isSeller) {
                if (hasInspected) {
                    return (
                        <button
                            className="btn btn-primary sm:btn-sm md:btn-md lg:btn-md"
                            onClick={() => sellerHandler(prop)}
                            disabled={hasSold}
                        >
                            Final Approval
                        </button>);
                }
                else if(hasBought) {
                    return (
                        <button
                            className="btn btn-neutral btn-outline sm:btn-sm md:btn-md lg:btn-md"
                        >
                            In Progress
                        </button>);
                }
                else {
                    return (
                        <button
                            className="btn btn-error btn-outline sm:btn-sm md:btn-md lg:btn-md"
                        >
                            Your Property
                        </button>);
                }
            } else if (isInspector) {
                if (hasBought) {
                    return (
                        <div>
                            <button
                                className="btn btn-success sm:btn-sm md:btn-md lg:btn-md mr-4"
                                onClick={() => inspectorHandler_Approve(prop)}
                                disabled={hasInspected}
                            >
                                <img src='./check.png' width="25" height="25" className="" alt="approve" />
                            </button>
                            <button
                                className="btn btn-error sm:btn-sm md:btn-md lg:btn-md"
                                onClick={() => inspectorHandler_Reject(prop)}
                                disabled={hasInspected}
                            >
                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> */}
                                <img src='./cross.png' width="25" height="25" className="" alt="reject" />
                            </button>
                        </div>
                    );
                }
                else {
                    return (<button
                        className="btn btn-primary sm:btn-sm md:btn-md lg:btn-md"
                    >
                        Pending
                    </button>);
                }
                // if (isBuyer) {
                //     return (
                //         <button
                //             className="btn btn-primary sm:btn-sm md:btn-md lg:btn-md"
                //             onClick={() => buyProp(prop)}
                //             disabled={hasBought}
                //         >
                //             Buy Now
                //         </button>);
                // }
                // if (isInspector) {

            }
            else {
                return (
                    <button
                        className="btn btn-primary sm:btn-sm md:btn-md lg:btn-md"
                        onClick={() => buyProp(prop)}
                        disabled={hasBought}
                    >
                        Buy Now
                    </button>);
            }


        } else if (isOwned) {
            if (prop.isListed) {
                return (<button
                    className="btn btn-primary btn-disabled sm:btn-sm md:btn-md lg:btn-md"
                >
                    Listed
                </button>);
            }
            else if (prop.sold) {
                return (<button
                    className="btn btn-accent sm:btn-sm md:btn-md lg:btn-md"
                    onClick={() => setIsReList(true)}
                >
                    Want to Re-List?
                </button>);
            }
            else {
                return (<button
                    className="btn btn-primary sm:btn-sm md:btn-md lg:btn-md"
                    onClick={() => listProp(prop)}
                >
                    List Now
                </button>);
            }

        }
    };
    useEffect(() => {
        renderButton(prop, isDiscover, isOwned, account, isInspector, hasInspected, hasBought, hasSold, listProp, buyProp, sellerHandler, inspectorHandler_Approve, inspectorHandler_Reject);
    }, [hasBought, hasInspected, hasSold]);

    return (
        <div className="card card-compact w-96 bg-base-100 shadow-xl">
            <figure className="overflow-hidden h-64">
                <img src={prop.image} alt={prop.name} className="w-full h-full object-cover" />
            </figure>
            <div className="card-body mt-2">
                <div className='card-title'>
                    <h2 className="text-lg font-semibold">{prop.name}</h2>
                    {isNew && <div className="badge badge-secondary">NEW</div>}{prop.sold && <div className="badge badge-neutral">Purchased</div>}
                    {isInspector && hasSold && <p className="text-sm text-green-500 font-bold">Sold!</p>}
                </div>

                <p className="text-gray-500">{prop.description}</p>
                <div className="mt-4 flex card-actions justify-between items-center">
                    <span className="text-primary-500 font-bold text-lg">
                        {isReList && isOwned ? (
                            <input type="number"
                                placeholder="Enter New Price"
                                className="input input-bordered input-accent w-full max-w-xs"
                                onChange={(e) => {
                                    setNewPrice(e.target.value)
                                }}
                            />
                        ) : (
                            (isDiscover && prop.price + " ETH") || (isOwned && prop.price + " ETH")
                            //|| (isSold && "Sold For " + item.totalPriceEther + " ETH") || (isPurchased && "Purchased For " + item.totalPriceEther + " ETH") 
                        )}
                        
                    </span>
                    
                    {!isReList ?
                        renderButton(prop, isDiscover, isOwned, account, isInspector, hasInspected, hasBought, hasSold, listProp, buyProp, sellerHandler, inspectorHandler_Approve, inspectorHandler_Reject)
                        :
                        <button
                            className="btn btn-primary sm:btn-sm md:btn-md lg:btn-md"
                            onClick={() => reListProp(prop, newPrice)}
                        >
                            Re-List Now
                        </button>
                    }

                </div>
                <div className="mt-2">
                    {isDiscover && <p className="text-sm text-gray-600">Seller Address: {prop.seller}</p>}
                    {isDiscover && isInspector && <p className="text-sm text-gray-600">Buyer Address: {prop.buyer}</p>}
                    {isDiscover && <p className="text-sm text-gray-600">Owner: {prop.owner}</p>}
                    {/* <p className="text-sm text-gray-600">Buyer Address: {prop.buyer}</p> */}
                </div>
            </div>
        </div>
    );
};

export default CardUI;
