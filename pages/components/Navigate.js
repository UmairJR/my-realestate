import React from 'react';
import NavbarUI from './ui/Navbar';

const Navigate = ({ account, web3Handler, isInspector }) => {
  const title = "RealEstate"
  return (
    <>
      <NavbarUI logo={'./house_logo.png'} title={title} web3Handler={web3Handler} account={account} isInspector={isInspector} />
    </>
  );
};

export default Navigate;
