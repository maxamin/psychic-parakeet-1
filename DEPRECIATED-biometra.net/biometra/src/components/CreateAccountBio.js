/*
import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const FaceCamera = (props) => {
  useEffect(() => {
    const faceAutoCaptureHTMLElement = document.getElementById(
      "x-dot-face-auto-capture"
    );

    if (faceAutoCaptureHTMLElement) {
      faceAutoCaptureHTMLElement.cameraOptions = props;
    }
  });

  return React.createElement("x-dot-face-auto-capture", {
    id: "x-dot-face-auto-capture",
  });
};

const FaceUi = (props) => {
  useEffect(() => {
    const uiElement = document.getElementById("x-dot-face-auto-capture-ui");

    if (uiElement) {
      uiElement.props = props;
    }
  });

  return React.createElement("x-dot-face-auto-capture-ui", {
    id: "x-dot-face-auto-capture-ui",
  });
};

const CreateAccountBio = ({ setSeedPhrase, setWallet }) => {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const navigate = useNavigate();

  const generateWallet = () => {
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    setNewSeedPhrase(mnemonic);
  };

  const setWalletAndMnemonic = () => {
    setSeedPhrase(newSeedPhrase);
    setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address);
    navigate("/wallet-view");
  };

  return (
    <>
      <div className="content">
        <div className="mnemonic">
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            Once you generate the seed phrase, save it securely in order to
            recover your wallet in the future.
          </div>
        </div>
        <Button
          className="frontPageButton"
          type="primary"
          onClick={generateWallet}
        >
          Generate Seed Phrase
        </Button>
        <Card className="seedPhraseContainer">
          {newSeedPhrase && (
            <pre style={{ whiteSpace: "pre-wrap" }}>{newSeedPhrase}</pre>
          )}
        </Card>
        <Button
          className="frontPageButton"
          type="primary"
          onClick={setWalletAndMnemonic}
        >
          Open Wallet
        </Button>
        <div className="faceScanContainer">
          <FaceCamera
            onCapture={setWalletAndMnemonic}
            onError={(error) => console.log("Face scan error:", error)}
          />
          <FaceUi
            showSpinner={true}
            spinnerMessage="Please wait..."
            captureButtonLabel="Capture"
            retryButtonLabel="Retry"
            onRetry={() => console.log("Retry")}
          />
        </div>
      </div>
    </>
  );
};
*/

export default CreateAccountBio;
