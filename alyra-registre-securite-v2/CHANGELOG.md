# Changelog


### doc: Update README

- Update README.md

---

### fix: footer always stick at bottom

- Update css style to stick footer att bottom

---

### feat: Update layout form for `CompanyModalFormNew`

- Rename component `FormLayout` to `FormModalLayout`
- New non-modal form layout component `FormLayout`
- Implement `FormLayout` in `CompanyModalFormNew`
- Prevent to subscribe to an existing company/account
- Prevent to subscribe to an existing verifier/account
- Add blockQuote to forms (remove toast)

---

### feat: Add for adding new company site.

- Add a simple modal form to add new site for a company `CompanyModalFormNew`
- Update Identity context `useIdentityContext`
  - to rename company and setCompany to isCompany and setIsCompany
  - to rename verifier and setVerifier to isVerifier and setIsVerifier
  - to add company and setCompany
- Add a Global context `useGlobalContext`
- Move reloadPage and setReloadPage to `useGlobalContext`
- Remove reloadPage and setReloadPage from `useRegisterSecurityEventContext`
- Add `GlobalContextProvider` to `provider.tsx`
- set company context in `IsConnectedAs`

---

### fix: Load Metadata only while reading task detail

- Issue: 
  - fetch data on click to see task detail, open and close
- Fix: 
  - fetch data on click to see task detail only on open  
- Code cleanup 

### feat: Grid improvement

- Grid:
  - On status field, click, select and apply the new status
  - Show url for Metadata and Transaction Hash for NFT 
- On final status only for [approve | reject]
  - create metadata
  - mint NFT
- TheGraph
  - New queries

### feat: Add theGraph & ui improvement

- Get event from theGraph
- New ui improvement
- registers: new grid | new forms
- subscribe: new forms

---

### feat: Refactoring UI #1

- New UI design
- Improve getting data from blockchain
- Language internationalization [fr, en]
- Refactoring context

---

### feat: Add scripts

- Scripts for local and sepolia networks
- deploy script
- upload metadata to pinata

---

## [0.2.2] (2023-07-23)

### fix: Sepolia RPC

- update the Sepolia rpc. The default one reach https://rpc.sepolia.org which has a very poor score (https://chainlist.org/chain/11155111?testnets=true)
- Use of https://endpoints.omniatech.io/v1/eth/sepolia/public
- fix performance issues on Sepolia

---

## [0.2.1] (2023-07-23)

### fix: demo video missing

- Add demo video

---

## [0.2.0] (2023-07-23)

### cleanup: Cleanup + README update

- Some cleanup 
- Add Vercel deployment
- Add demo video

---

## [0.1.2] (2023-07-22)

### feat: backend / frontend

- struct backend with hardhat
  - Solidity smart contract
  - unit tests for smart contract
  - deployment script
  - script for loading data
- struct frontend NETX.js
  - init environment structure
  - add wallet library
- first MVP dApp
  - login
  - account creation company/verifier
  - account management
  - site management for companies
  - verification task creation
  - verification task management

---

## [0.1.1] (2023-07-16)

### doc: init README

- first commit

---

## [0.1.0] (2023-07-16)

### Init: First commit

- first commit

---