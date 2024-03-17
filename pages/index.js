import React, { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/router";
import Web3 from "web3";
import RealEstate from "./abis/RealEstate.json";
import Escrow from "./abis/Escrow.json";
import HashStorage from "./abis/HashStorage.json"
import Navigate from "./components/Navigate";
import Discover from "./discover";
import ListedProperty from "./listed-property";
import Add from "./add";
import SoldProperty from "./sold-property";
import PurchasedProperty from "./my-purchases";
import OwnedProperty from "./owned-property";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, database } from "./utils/firebaseConfig";
import SignIn from "./login";
import SignUp from "./signup";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { onValue, ref } from "firebase/database";
import VerifyProp from "./verify-property";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [realEstate, setRealEstate] = useState(null);
  const [escrow, setEscrow] = useState(null);
  const [hashStorage, setHashStorage] = useState(null);
  const [realEstate_address, setRealEstate_address] = useState("");
  const [escrow_address, setEscrow_address] = useState("");
  const [isInspector, setIsInspector] = useState(false);
  const inspector_address = "0x291291710b387F0d7209Cb4149d1fD6AD7Ce2018";
  const userContractAddress = "0x59d3568068b228EE6328b52A791677247F782116"; //"0x4C1BEC0B25a486D7d5E83770E78a7C16eb363096";
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const [currentUserId, setcurrentUserId] = useState("");
  const [aadhaarName, setAadhaarName] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [accountAddress, setAccountAddress] = useState("");

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const userSession = localStorage?.getItem("user");
      if (!user && !userSession) {
        if (pathname !== "/signup") {
          router.push("/login");
        }
      }
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const CurrentUser = user;
        setcurrentUserId(CurrentUser.uid);
        console.log(currentUserId);
      }
      const dbRef = ref(database, "users/" + currentUserId);
      onValue(dbRef, (snapshot) => {
        if (snapshot.exists()) {
          const value = snapshot.val();
          setAadhaarName(value.Name);
          setAadhaarNumber(value.AadhaarNumber);
          setAccountAddress(value.AccountAddress);
          console.log(value.Name, value.AadhaarNumber, value.AccountAddress);
        }
      });
    });
  });

  const web3Handler = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const web3Instance = new Web3(window.ethereum);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Current account:", accounts[0]);
        if (accounts[0] !== accountAddress.toLowerCase()) {
          alert(`Please connect to the correct account: ${accountAddress}`);
          return;
        }
        const netId = await web3Instance.eth.net.getId();
        console.log(netId);
        const realEstate_address = RealEstate.networks[netId].address.toString();
        const escrow_address = Escrow.networks[netId].address.toString();
        const hashStorage_address = HashStorage.networks[netId].address.toString();
        console.log("Deployed address:", realEstate_address, escrow_address, hashStorage_address);
        const realEstate = new web3Instance.eth.Contract(
          RealEstate.abi,
          realEstate_address
        );
        const escrow = new web3Instance.eth.Contract(
          Escrow.abi,
          escrow_address
        );
        const hashStorage = new web3Instance.eth.Contract(
          HashStorage.abi,
          hashStorage_address
        );

        setIsInspector(accounts[0] === inspector_address.toLowerCase());

        console.log(inspector_address, accounts[0], isInspector);
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setRealEstate(realEstate);
        setEscrow(escrow);
        setHashStorage(hashStorage);
        setRealEstate_address(realEstate_address);
        setEscrow_address(escrow_address);
      } else {
        console.error("MetaMask not detected");
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:7545"
        );
        const web3Instance = new Web3(provider);
        setWeb3(web3Instance);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error initializing Web3:", error);
    }
  };
  const connectToCorrectAccount = async () => {
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      web3Handler();
    } catch (error) {
      console.error("Error connecting to Metamask:", error);
    }
  };
  console.log(userContractAddress.toLowerCase());
  console.log(account);
  console.log(account === userContractAddress.toLowerCase());
  return (
    <div className="App">
      {router.pathname === "/login" && <SignIn />}
      {router.pathname === "/signup" && <SignUp />}
      {!user ? (
        ""
      ) : (
        <>
          <Navigate
            web3Handler={web3Handler}
            account={account}
            isInspector={isInspector}
          />
          <div>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "80vh",
                }}
              >
                <span className="loading loading-infinity loading-md"></span>
                <p className="mx-3 my-0 font-bold text-lg text-primary">
                  Awaiting Metamask Connection...
                </p>
              </div>
            ) : !isInspector ? (
              <>
                {router.pathname === "/" && (
                  <Discover
                    realEstate={realEstate}
                    escrow={escrow}
                    web3={web3}
                    account={account}
                  />
                )}
                {router.pathname === "/add" && (
                  <Add
                    realEstate={realEstate}
                    escrow={escrow}
                    hashStorage={hashStorage}
                    web3={web3}
                    account={account}
                    realEstate_address={realEstate_address}
                    escrow_address={escrow_address}
                    aadhaarName={aadhaarName}
                  />
                )}
                {router.pathname === '/verify-property' && (
                <VerifyProp 
                hashStorage={hashStorage}
                web3={web3} 
                account={account} 
                currentUserId={currentUserId} 
                aadhaarName={aadhaarName}
                />
                )}
                {router.pathname === "/owned-property" && (
                  <OwnedProperty
                    realEstate={realEstate}
                    escrow={escrow}
                    web3={web3}
                    account={account}
                    realEstate_address={realEstate_address}
                    escrow_address={escrow_address}
                    aadhaarName={aadhaarName}
                  />
                )}
                {router.pathname === "/listed-property" && (
                  <ListedProperty
                    realEstate={realEstate}
                    escrow={escrow}
                    web3={web3}
                    account={account}
                    realEstate_address={realEstate_address}
                    escrow_address={escrow_address}
                  />
                )}
                {router.pathname === "/sold-property" && (
                  <SoldProperty
                    realEstate={realEstate}
                    escrow={escrow}
                    web3={web3}
                    account={account}
                    realEstate_address={realEstate_address}
                    escrow_address={escrow_address}
                  />
                )}
                {router.pathname === "/my-purchases" && (
                  <PurchasedProperty
                    realEstate={realEstate}
                    escrow={escrow}
                    web3={web3}
                    account={account}
                    realEstate_address={realEstate_address}
                    escrow_address={escrow_address}
                  />
                )}
              </>
            ) : (
              <>
                {router.pathname === "/" && (
                  <Discover
                    realEstate={realEstate}
                    escrow={escrow}
                    web3={web3}
                    account={account}
                    isInspector={isInspector}
                  />
                )}
                {router.pathname === '/verify-property' && (
                <VerifyProp 
                hashStorage={hashStorage}
                web3={web3} 
                account={account} 
                isInspector={isInspector}
                />
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
