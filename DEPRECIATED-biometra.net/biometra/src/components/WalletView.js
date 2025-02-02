import React, { useEffect, useState } from "react";
import {
  Divider,
  Tooltip,
  List,
  Avatar,
  Spin,
  Tabs,
  Input,
  Button,
} from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../noImg.png";
import axios from "axios";
import { CHAINS_CONFIG } from "../chains";
import { ethers } from "ethers";

function WalletView({
  wallet,
  setWallet,
  seedPhrase,
  setSeedPhrase,
  selectedChain,
  darkMode,
}) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);

  async function sendTransaction(to, amount) {
    const chain = CHAINS_CONFIG[selectedChain];

    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);

    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;

    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to: to,
      value: ethers.parseEther(amount.toString()),
    };

    setProcessing(true);
    try {
      const transaction = await wallet.sendTransaction(tx);

      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);

      if (receipt.status === 1) {
        getAccountTokens();
      } else {
        console.log("failed");
      }
    } catch (err) {
      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);
    }
  }

  async function getAccountTokens() {
    setFetching(true);

    const res = await axios.get(`http://localhost:3001/getTokens`, {
      params: {
        userAddress: wallet,
        chain: selectedChain,
      },
    });

    const response = res.data;

    if (response.tokens.length > 0) {
      setTokens(response.tokens);
    }

    if (response.nfts.length > 0) {
      setNfts(response.nfts);
    }

    setBalance(response.balance);

    setFetching(false);
  }

  function logout() {
    setSeedPhrase(null);
    setWallet(null);
    setNfts(null);
    setTokens(null);
    setBalance(0);
    navigate("/");
  }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setNfts(null);
    setTokens(null);
    setBalance(0);
    getAccountTokens();
  }, [wallet, selectedChain]);

  return (
    <div className={`content ${darkMode ? "dark" : "light"}`}>
      <div className="logoutButton" onClick={logout}>
        <LogoutOutlined />
      </div>
      <div className="walletName">Wallet</div>
      <Tooltip title={wallet}>
        <div>
          {wallet.slice(0, 4)}...{wallet.slice(38)}
        </div>
      </Tooltip>
      <Divider />
      {fetching ? (
        <Spin />
      ) : (
        <Tabs
          defaultActiveKey="1"
          className="walletView"
          items={[
            {
              key: "3",
              label: "Tokens",
              children: tokens ? (
                <div className={darkMode ? "tokenRow dark" : "tokenRow"}>
                  <List
                    bordered
                    itemLayout="horizontal"
                    dataSource={tokens}
                    renderItem={(item, index) => (
                      <List.Item
                        key={item.id ? item.id.toString() : index}
                        style={{ textAlign: "left" }}
                        className={darkMode ? "token dark" : "token"}
                      >
                        <List.Item.Meta
                          avatar={<Avatar src={item.logo || logo} />}
                          title={
                            <span className="tokenText">{item.symbol}</span>
                          }
                          description={
                            <span className="tokenText">{item.name}</span>
                          }
                        />
                        <div className="tokenText">
                          {(
                            Number(item.balance) /
                            10 ** Number(item.decimals)
                          ).toFixed(2)}
                        </div>
                      </List.Item>
                    )}
                  />
                  <p className="frontPageBottom">Copyright © Biometra</p>
                </div>
              ) : (
                <>
                  <span>You seem to not have any tokens yet</span>
                  <p className="frontPageBottom">Copyright © Biometra</p>
                </>
              ),
            },
            {
              key: "2",
              label: "NFTs",
              children: nfts ? (
                <>
                  {nfts.map((e, i) => (
                    <div key={i}>
                      {e && (
                        <img
                          key={i}
                          className="nftImage"
                          alt="nftImage"
                          src={e}
                        />
                      )}
                    </div>
                  ))}
                  <p className="frontPageBottom">Copyright © Biometra</p>
                </>
              ) : (
                <>
                  <span>You seem to not have any tokens yet </span>
                  <p className="frontPageBottom">Copyright © Biometra</p>
                </>
              ),
            },
            {
              key: "1",
              label: "Transfer",
              children: (
                <>
                  <h3>Native Balance</h3>
                  <h1>
                    {balance.toFixed(4)} {CHAINS_CONFIG[selectedChain].ticker}
                  </h1>
                  <div className="sendRow">
                    <p style={{ width: "90px", textAlign: "left" }}>To:</p>
                    <Input
                      className="inputText darkerPlaceholder"
                      value={sendToAddress}
                      onChange={(e) => setSendToAddress(e.target.value)}
                      placeholder="0x..."
                    />
                  </div>
                  <div className="sendRow">
                    <p style={{ width: "90px", textAlign: "left" }}>Amount:</p>
                    <Input
                      className="inputText darkerPlaceholder"
                      value={amountToSend}
                      onChange={(e) => setAmountToSend(e.target.value)}
                      placeholder="Native tokens you wish to send..."
                    />
                  </div>

                  <Button
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                    type="primary"
                    onClick={() => sendTransaction(sendToAddress, amountToSend)}
                  >
                    Send Tokens
                  </Button>
                  {processing && (
                    <>
                      <Spin />
                      {hash && (
                        <Tooltip title={hash}>
                          <p>Hover For Tx Hash</p>
                        </Tooltip>
                      )}
                    </>
                  )}
                </>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}

export default WalletView;
