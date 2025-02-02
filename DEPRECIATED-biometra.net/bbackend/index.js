// Biometra Backend App - Node & Express | Will need backend initialization for Biometrics
// Will need to store the faces in Node / Express backend
// Avalanche C Chain disabled

const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get("/getTokens", getTokensHandler);

function getTokensHandler(req, res) {
  const { userAddress, chain } = req.query;
  fetchTokenBalances(userAddress, chain)
    .then((tokens) => fetchWalletNFTs(userAddress, chain))
    .then((nfts) => processNFTs(nfts))
    .then((myNFTs) => fetchNativeBalance(userAddress, chain)
      .then((balance) => sendResponse(res, tokens.raw, myNFTs, balance.raw.balance))
    )
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    });
}

async function fetchTokenBalances(address, chain) {
  return Moralis.EvmApi.token.getWalletTokenBalances({
    chain,
    address,
  });
}

async function fetchWalletNFTs(address, chain) {
  return Moralis.EvmApi.nft.getWalletNFTs({
    chain,
    address,
    mediaItems: true,
  });
}

function processNFTs(nfts) {
  return nfts.raw.result
    .filter((e) => e?.media?.media_collection?.high?.url && !e.possible_spam && e?.media?.category !== "video")
    .map((e) => e.media.media_collection.high.url);
}

async function fetchNativeBalance(address, chain) {
  return Moralis.EvmApi.balance.getNativeBalance({
    chain,
    address,
  });
}

function sendResponse(res, tokens, nfts, balance) {
  const jsonResponse = {
    tokens,
    nfts,
    balance: balance / 10 ** 18,
  };
  res.status(200).json(jsonResponse);
}

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
})
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening for API Calls`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
