import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardUI from './components/ui/Card';
import ListCardUI from './components/ui/ListCard';

const ListedProperty = ({web3, account, realEstate, escrow, escrow_address, realEstate_address}) => {
    const [loading, setLoading] = useState(true);
    const [listedProp, setListedProp] = useState([]);
  
    const loadListedProps = async () => {
      try {
        const totalItems = await escrow.methods.getItemCount().call();
        console.log("Total item: ", totalItems);
        let listedProp = [];
        for (let i = 1; i <= totalItems; i++) {
          const prop = await escrow.methods.props(i).call();
          console.log("Property: ", prop);
          console.log(account);
          console.log(prop.seller.toLowerCase());
          if (prop.seller.toLowerCase() === account && prop.propertyInfo.isListed && !prop.sold) {
            const uri = await realEstate.methods.tokenURI(prop.tokenId).call();
            const response = await axios.get(uri);
            const metadata = response.data;
            const propPrice = web3.utils.fromWei(prop.price.toString(), 'ether')
            let propList = {
              price: propPrice,
              propId: prop.propertyId,
              name: metadata.name,
              description: metadata.description,
              image: metadata.image,
              seller: prop.seller,
              buyer: prop.buyer
            }
            listedProp.push(propList);
          } 
        }
        console.log("Listed items: ", listedProp);
          setListedProp(listedProp);
          setLoading(false);
      }
      catch (err) {
        console.log("Error", err);
      }
    }
  
    useEffect(() => {
      loadListedProps()
    }, [])
  
    if (loading) return (
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <span className="loading loading-ring loading-md"></span>
        <p className='mx-3 my-0 font-bold text-lg text-primary'>Loading...</p>
      </main>
    )
  
    return (
      <div className="mt-5 mb-10">
        <h1 className="text-3xl font-bold font-serif mb-5 text-center">Listed Property</h1>
          <div className="px-5 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-center">
            {listedProp.length > 0 ? (
              listedProp.map((prop, idx) => (
                <div key={idx}>
                  <ListCardUI prop={prop} isListed={true} isNew={idx === listedProp.length-1} />
                </div>
              )).reverse()
            ) : (
              <main style={{ padding: "1rem 0" }}>
              <h1 className="text-3xl font-bold font-serif mb-4 text-center">No listed Property. Add your first Property...</h1>
              </main>
            )}
          </div>
      </div>
    );
}

export default ListedProperty
