//Need to implement FaceUI next to Biometra
//FaceUi library fixed
import React, { useEffect } from "react";

function FaceUi(props) {
  useEffect(() => {
    const initializeFaceUi = () => {
      const uiElement = document.getElementById("x-dot-face-auto-capture-ui");

      if (uiElement) {
        uiElement.props = props;
      }
    };

    initializeFaceUi();
  }, [props]);

  return <x-dot-face-auto-capture-ui id="x-dot-face-auto-capture-ui" />;
}

export default FaceUi;
