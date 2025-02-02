//Reduced all 8 js biometric scanning components to one function and 2 variables
//Innovatrics components.
import React, { useEffect } from "react";
import "@innovatrics/dot-face-auto-capture";

function FaceCamera(props) {
  useEffect(() => {
    const initializeFaceAutoCapture = () => {
      const faceAutoCaptureHTMLElement = document.getElementById(
        "x-dot-face-auto-capture"
      );

      if (faceAutoCaptureHTMLElement) {
        faceAutoCaptureHTMLElement.cameraOptions = props;
      }
    };

    initializeFaceAutoCapture();
  }, [props]);

  return <x-dot-face-auto-capture id="x-dot-face-auto-capture" />;
}

export default FaceCamera;
