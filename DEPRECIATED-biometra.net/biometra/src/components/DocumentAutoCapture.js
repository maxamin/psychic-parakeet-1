//Reduced all 8 js biometric scanning components to one function and 2 variables
import React, { useState } from "react";
import {
  dispatchControlEvent,
  DocumentCustomEvent,
  ControlEventInstruction,
} from "@innovatrics/dot-document-auto-capture/events";
import styles from "../styles/index.module.css";
import buttonStyles from "../styles/button.module.css";
import DocumentCamera from "./DocumentCamera";
import DocumentUi from "./DocumentUi";

function DocumentAutoCapture({ onPhotoTaken, onError, onBackClick }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handlePhotoTaken = (image, data) => {
    setIsButtonDisabled(false);
    onPhotoTaken(image, data);
  };

  const handleContinueDetection = () => {
    dispatchControlEvent(
      DocumentCustomEvent.CONTROL,
      ControlEventInstruction.CONTINUE_DETECTION
    );

    setIsButtonDisabled(true);
  };

  return (
    <>
      <h2>Document auto capture</h2>
      <div>
        <button
          className={buttonStyles.primary}
          onClick={handleContinueDetection}
          disabled={isButtonDisabled}
        >
          Continue detection
        </button>

        <button className={buttonStyles.primary} onClick={onBackClick}>
          Back
        </button>
      </div>
      {/* parent container must have position: relative */}
      <div className={styles.container}>
        <DocumentCamera
          imageType="png"
          cameraFacing="environment"
          onPhotoTaken={handlePhotoTaken}
          onError={onError}
        />
        <DocumentUi showCameraButtons />
      </div>
    </>
  );
}

export default DocumentAutoCapture;
