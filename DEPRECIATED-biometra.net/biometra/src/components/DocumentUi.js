//Reduced all 8 js biometric scanning components to one function and 2 variables

import React, { useEffect, useRef } from 'react';

const DocumentUi = (props) => {
  const uiElementRef = useRef(null);

  useEffect(() => {
    const initializeDocumentUi = () => {
      if (uiElementRef.current) {
        uiElementRef.current.props = props;
      }
    };

    initializeDocumentUi();
  }, [props]);

  return <x-dot-document-auto-capture-ui ref={uiElementRef} />;
};

export default DocumentUi;
