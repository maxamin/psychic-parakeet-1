//Reduced all 8 js biometric scanning components to one function and 2 variables
//Innovatrics component
import React, { useEffect } from "react";

function DocumentCamera(props) {
  useEffect(() => {
    const initializeDocumentAutoCapture = () => {
      const documentAutoCaptureHTMLElement = document.getElementById(
        "x-dot-document-auto-capture"
      );

      if (documentAutoCaptureHTMLElement) {
        documentAutoCaptureHTMLElement.cameraOptions = props;
      }
    };

    initializeDocumentAutoCapture();
  }, [props]);

  return <x-dot-document-auto-capture id="x-dot-document-auto-capture" />;
}

export default DocumentCamera;
