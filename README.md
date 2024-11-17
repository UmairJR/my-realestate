# Fraud Prevention in Real Estate using Blockchain

## Table of Contents
- [Project Overview](#project-overview)
- [Video Demo](#video-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Usage](#usage)

## Drive Link - For Documents/Thesis/Certificates (For University Purpose only)
https://drive.google.com/drive/folders/1anRfm57rsMRcP4UD8ySw0GnmUk9gk6Z7?usp=sharing

## Project Overview
This project aims to prevent fraud in real estate transactions by leveraging blockchain technology. By automating the verification and transfer of property ownership, the system ensures security, transparency, and integrity in real estate dealings. The project also includes role-based access control for users, inspectors, and buyers, as well as the use of NFTs (Non-Fungible Tokens) to uniquely represent property ownership.

## Video Demo

[![Watch the video](https://raw.githubusercontent.com/UmairJR/my-realestate/main/thumbnail.png)](https://raw.githubusercontent.com/UmairJR/my-realestate/main/Major_Project_Demo.mp4)

## Features
- **Blockchain-Backed Transactions:** Secure real estate transactions using Ethereum blockchain and smart contracts.
- **Role-Based Access Control:** Different access levels for users, inspectors, and buyers.
- **NFT Integration:** Use of NFTs to uniquely represent and track property ownership.
- **Decentralized Document Storage:** Secure document storage using IPFS.
- **User-Friendly Interface:** Built with Next.js and ChakraUI for a smooth user experience.
- **Real-Time Data Management:** Managed with Firebase Realtime Database and Firebase Auth for authentication.

## Tech Stack
- **Frontend:** JavaScript, Next.js, ChakraUI, daisyUI
- **Blockchain:** Ethereum, Solidity, Truffle, Ganache
- **File Storage:** IPFS
- **NFTs:** ERC-721 standard for NFTs
- **Database:** Firebase Realtime Database
- **Authentication:** Firebase Auth
- **Tools:** MetaMask, Postman

## System Architecture
1. **Frontend (Next.js):** Provides the interface for users to interact with the system.
2. **Smart Contracts (Solidity):** Handles the verification, transfer, and storage of property ownership.
3. **NFTs (ERC-721):** Represents unique properties on the blockchain.
4. **IPFS:** Stores property documents securely and in a decentralized manner.
5. **Backend Integration:** Manages interactions between the frontend, blockchain, and IPFS.
6. **Firebase:** Handles user authentication and data storage.

## Installation

### Prerequisites
- Node.js
- MetaMask (browser extension)
- Ganache (for local Ethereum blockchain)
- Truffle (for smart contract management)

### Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/UmairJR/real-estate-blockchain.git
   cd real-estate-blockchain

2. **Install dependencies:**
   ```bash
   npm install

3. **Setup Ethereum blockchain using Ganache:**

- Download and install Ganache.
- Start a new workspace and configure Truffle to use Ganache.

4. **Compile and deploy smart contracts:**
   ```bash
   truffle compile
   truffle migrate
   
5. **Start the Next.js development server:**
   ```bash
    npm run dev
   
6. **Connect MetaMask:**

- Connect MetaMask to your local blockchain (Ganache).
- Import an account from Ganache to MetaMask.

## Usage

- **Register and Login:** Users can register and log in using Firebase Auth.
- **List Property:** Users can list a property by uploading documents, which are securely stored on IPFS.
- **Verify Ownership:** Inspectors can verify property ownership by checking the hash key on the blockchain.
- **Buy Property:** Buyers can request to buy a property, and once approved, the transaction is executed through a smart contract.
