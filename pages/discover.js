import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardUI from './components/ui/Card';
import { database } from './utils/firebaseConfig';
import { set, get, onValue, ref, update } from 'firebase/database'
import { useToast } from '@chakra-ui/react';

const Discover = ({ web3, account, realEstate, escrow, isInspector }) => {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [hasBought, setHasBought] = useState(false)
  const [hasInspected, setHasInspected] = useState(false)
  const [hasSold, setHasSold] = useState(false)
  const [owner, setOwner] = useState(null);
  const [ownerName, setOwnername] = useState(null);
  const toast = useToast();

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

  // const fetchHasAllStatus = async (propId) => {
  //   const hasBoughtRef = ref(database, `props/${propId}`);
  //   onValue(hasBoughtRef, (snapshot) => {
  //     if (snapshot.exists()) {
  //       const propId = snapshot.val();
  //       const hasBoughtStatus = propId.hasBought;
  //       const hasInspectedStatus = propId.hasInspected;
  //       const hasSoldStatus = propId.hasSold;
  //       console.log('For user id ' + id + ' status: ' + hasBoughtStatus);
  //       console.log('For user id ' + id + ' status: ' + hasInspectedStatus);
  //       console.log('For user id ' + id + ' status: ' + hasSoldStatus);
  //       setHasBoughtStatuses((prevStatuses) => ({ ...prevStatuses, [id]: hasBoughtStatus }));
  //     } else {
  //       console.log('User id not found');
  //     }
  //   });
  // };

  const loadAllPropsForInspector = async () => {
    console.log('Loading properties for Inspector....');
    try {
      const totalItems = await escrow.methods.getItemCount().call();
      console.log("Total item count: ", totalItems);
      let props = [];
      for (let i = 1; i <= totalItems; i++) {
        const prop = await escrow.methods.props(i).call();
        console.log("Property: ", prop);
        if (!prop.sold && prop.propertyInfo.isListed) {

          // Fetch hasBought status from Firebase for each property
          const hasBoughtRef = ref(database, `propStatus/${prop.propertyId}`);
          onValue(hasBoughtRef, async (snapshot) => {
            if (snapshot.exists()) {
              const hasBoughtStatus = snapshot.val().hasBought;
              const hasSoldStatus = snapshot.val().hasSold;
              const ownerName = snapshot.val().name;
              setHasBought(hasBoughtStatus);
              setHasSold(hasSoldStatus);
              // Check if the property hasBought is true
              if (hasBoughtStatus) {
                const uri = await realEstate.methods.tokenURI(prop.tokenId).call();
                console.log("URI: ", uri);
                const response = await axios.get(uri);
                console.log("RESPONSE: ", response)
                const metadata = response.data;
                console.log("METADATA: ", metadata);
                const totalPriceEther = web3.utils.fromWei(prop.price.toString(), 'ether');

                props.push({
                  txPrice: prop.price,
                  price: totalPriceEther,
                  propId: prop.propertyId,
                  seller: prop.seller,
                  buyer: prop.buyer,
                  name: metadata.name,
                  description: metadata.description,
                  image: metadata.image,
                  hasBought: hasBoughtStatus,
                  owner: ownerName
                });
                setProperties([...props]);
              }
            } else {
              console.log('Property not found in Firebase');
            }
          });
        }
      }

      setLoading(false);
      console.log("Properties: ", props);

      console.log("isInspector: ", isInspector)
    } catch (err) {
      console.log(err);
    }
  }

  const loadAllProps = async () => {
    console.log('Loading....');
    try {
      const totalItems = await escrow.methods.getItemCount().call();
      console.log("Total item count: ", totalItems);
      let props = [];
      for (let i = 1; i <= totalItems; i++) {
        const prop = await escrow.methods.props(i).call();
        console.log("Property: ", prop);
        if (!prop.sold && prop.propertyInfo.isListed) {
          const uri = await realEstate.methods.tokenURI(prop.tokenId).call();
          const nameRef = ref(database, `propStatus/${prop.propertyId}`)
          await get(nameRef).then(async (snapshot) => {
            console.log("Getting name...");
            if (snapshot.exists()) {
              const ownerName = snapshot.val().name;
              console.log("Owner:", ownerName);
              console.log("URI: ", uri);
              const response = await axios.get(uri);
              console.log("RESPONSE: ", response)
              // console.log("RESPONSE JSON: ",response.json())
              const metadata = response.data;
              console.log("METADATA: ", metadata);
              const totalPriceEther = web3.utils.fromWei(prop.price.toString(), 'ether');
              props.push({
                txPrice: prop.price,
                price: totalPriceEther,
                propId: prop.propertyId,
                seller: prop.seller,
                buyer: prop.buyer,
                name: metadata.name,
                description: metadata.description,
                image: metadata.image,
                owner: ownerName
              })
            }
            else {
              console.log("No props found");
            }
          })

        }
      }
      setLoading(false);
      console.log("Properties: ", props);
      setProperties(props);
      console.log("isInspector: ", isInspector)
    }
    catch (err) {
      console.log(err);
    }

  }
  const inspectorHandler_Approve = async (prop) => {
    console.log("Inspecting.....");
    console.log("Inspecting Property: " + prop.propId + " - " + prop.name);
    // Inspector updates status
    try {
      await escrow.methods.updateInspectionStatus(prop.propId, true).send({ from: account });
      updateInFirebase(prop.propId, true, true, false)
      toast({
        title: 'Approved',
        description: 'Property successfully Inspected and Approved!',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      console.log('Inspection Approval error: ', error);
      toast({
        title: 'Error',
        description: 'An error occurred while Inspecting the Property.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }
  const inspectorHandler_Reject = async (prop) => {
    console.log("Inspecting.....");
    console.log("Inspecting Property: " + prop.propId + " - " + prop.name);
    // Inspector updates status
    try {
      console.log("Rejecting...");
      await escrow.methods.cancelSale(prop.propId).send({ from: account });
      updateInFirebase(prop.propId, false, false, false)
      toast({
        title: 'Rejected',
        description: 'Property Inspection Rejected!',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      console.log('Inspection Rejection error: ', error);
      toast({
        title: 'Error',
        description: 'An error occurred while Inspecting the Property.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }


  const sellerHandler = async (prop) => {
    console.log("Final Approval for Selling...");
    console.log("Approval to " + prop.propId + " " + prop.name);
    try {
      await escrow.methods.approveSale(prop.propId).send({ from: account });
      // Seller finalize...
      await escrow.methods.finalizeSale(prop.propId).send({ from: account });
      updateInFirebase(prop.propId, true, true, true);
      setHasSold(true)
      toast({
        title: 'Approved Sale',
        description: `Approval for Property: ${prop.propId}, Property Name: ${prop.name} given to Buyer: ${prop.buyer}`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      loadAllProps();
    }
    catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while Approving the Property.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }

  }
  const buyProp = async (prop) => {
    console.log("Buying....")
    try {
      const tx = await escrow.methods.paymentEscrow(prop.propId).send({
        from: account,
        value: prop.txPrice
      });
      updateInFirebase(prop.propId, true, false, false);
      setHasBought(true)
      toast({
        title: 'Gone for Inspection',
        description: 'Waiting for Inspector to Approve!',
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    }
    catch (error) {
      console.error("Error purchasing property:", error);
      toast({
        title: 'Error',
        description: 'An error occurred while Purchasing the Property.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }

  }

  const reLoadPage = () => {
    if (isInspector) {
      setProperties([]);
      loadAllPropsForInspector();
    } else {
      loadAllProps();
    }
  }

  useEffect(() => {
    if (isInspector) {
      loadAllPropsForInspector();
    } else {
      loadAllProps();
    }
  }, [hasBought, hasInspected, hasSold]);

  if (loading) return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <span className="loading loading-ring loading-md"></span>
      <p className='mx-3 my-0 font-bold text-lg text-primary'>Loading...</p>
    </main>
  )
  return (
    <div className="mt-5 mb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
      <h1 className="text-3xl font-bold font-serif text-center">Propertiess</h1>
    </div>
        <button
          className="btn btn-square btn-ghost sm:btn-sm md:btn-md lg:btn-md mr-4"
          onClick={reLoadPage}
        >
          <img src='./reload.png' width="25" height="25" className="" alt="approve" />
        </button>
      </div>
      <div className="px-5 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 justify-center">
        {properties.length > 0 ? (
          properties.map((prop, idx) => (
            <div key={idx}>
              <CardUI
                prop={prop}
                buyProp={buyProp}
                isNew={idx === properties.length - 1}
                isDiscover={true}
                account={account}
                isInspector={isInspector}
                hasBought={hasBought}
                hasInspected={hasInspected}
                hasSold={hasSold}
                sellerHandler={sellerHandler}
                inspectorHandler_Approve={inspectorHandler_Approve}
                inspectorHandler_Reject={inspectorHandler_Reject}
              />
            </div>
          )).reverse()
        ) : (
          <main style={{ padding: "1rem 0" }}>
            <h1 className="text-3xl font-bold font-serif mb-4 text-center">No listed Properties</h1>
          </main>
        )}
      </div>
    </div>
  );

}

export default Discover
