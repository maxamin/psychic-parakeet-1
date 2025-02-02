# ChainProof

![Project Logo](/assets/images/Home.png)

ChainProof aims to create a secure and decentralized system for document verification using Blockchain and InterPlanetary File System (IPFS) technologies. The system stores the hash of the documents in the Blockchain network and the documents themselves in the IPFS network. This ensures that the documents cannot be tampered with or altered, and they can be easily retrieved and verified by authorized parties.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Introduction

Document verification is a critical process for various industries and institutions. However, traditional centralized systems may suffer from vulnerabilities and risks of data manipulation. This project aims to address these challenges by leveraging the security and decentralization features of Blockchain and IPFS technologies.

## Features

- **Secure Document Verification**: The system ensures secure document verification by storing the document hashes in the Blockchain, making it tamper-proof and immutable.

- **Decentralized System**: The project utilizes the decentralized nature of Blockchain and IPFS, eliminating the need for a central authority and reducing the risk of a single point of failure.

- **Fast and Easy Verification Process**: With the integration of Blockchain and IPFS, document verification becomes faster and more efficient, without relying on intermediaries or third-party services.

- **User-Friendly Interface**: The web application provides a user-friendly interface for users to upload documents, verify their authenticity, and access the verification results.

- **Support for Multiple Document Types**: The system supports various document types and formats, making it versatile for different use cases.

## Requirements

Ensure you have the following tools and dependencies installed on your system before setting up the project:

- Node.js and npm: [Download Node.js](https://nodejs.org/en/download/)
- Ethereum Network Client (Ganache or other): [Ganache](https://www.trufflesuite.com/ganache)
- IPFS Client (optional): [IPFS](https://docs.ipfs.io/install/command-line/)

## Installation

1. Clone this repository:

```
git clone https://github.com/waseem0605/ChainProof.git
```

2. Install the required packages:

```
cd ChainProof
npm install
```

3. Open the application in your browser using Live Server Extension or any other preferred method.

## Usage

Follow these steps to use the application:

1. The system owner must add an exporter to the list of authorized parties by clicking on the "Add Exporter" button and entering the exporter's Ethereum address.

2. Upload a document to the system by clicking on the "Upload Document" button and selecting a file from your computer. The system will encrypt the document and store it in the IPFS network. The document hash will be recorded in the Blockchain.

3. Verify a document by clicking on the "Verify Document" button and entering its unique identifier (hash) in the input field. The system will retrieve the document from the IPFS network, decrypt it, and compare its hash with the one recorded in the Blockchain.

4. The system will display a message indicating whether the document is authentic or not.

## License

This project is licensed under the MIT License. For more information, please see the [LICENSE.md](LICENSE.md) file.

## Acknowledgments

This project has been made possible thanks to the valuable documentation and resources provided by:

- Metamask
- Solidity and Web3.js
- IPFS
- Truffle

---
