//Reduced all 8 js biometric scanning components to one function and 2 variables
import React, { useState } from "react";
import styles from "../styles/index.module.css";
import buttonStyles from "../styles/button.module.css";
import FaceCamera from "./FaceCamera";
import FaceUi from "./FaceUi";

function FaceAutoCapture({ onPhotoTaken, onError, onBackClick }) {
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handlePhotoTaken = (image, data) => {
    setIsButtonDisabled(false);
    onPhotoTaken(image, data);
  };

  const handleContinueDetection = () => {
    // Add your logic here for continuing the detection

    setIsButtonDisabled(true);
  };

  return (
    <>
      <h2>Face auto capture</h2>
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
      <div className={styles.container}>
        <FaceCamera
          imageType="png"
          cameraFacing="user"
          onPhotoTaken={handlePhotoTaken}
          onError={onError}
        />
        <FaceUi showCameraButtons />
      </div>
    </>
  );
}

export default FaceAutoCapture;
