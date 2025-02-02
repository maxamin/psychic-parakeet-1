//Fixed UI Library for biometric authentication feature
//Reduced all 8 js components to one function and 2 variables
//Innovatrics components into one
import React from 'react';
import styles from '../styles/button.module.css';

const ComponentSelect = ({ setStep }) => {
  const handleClick = (step) => {
    setStep(step);
  };

  const buttons = [
    { label: 'Document', step: 'DOCUMENT_CAPTURE' },
    { label: 'Face', step: 'FACE_CAPTURE' },
    { label: 'MagnifEye Liveness', step: 'MAGNIFEYE_LIVENESS' },
  ];

  return (
    <div>
      {buttons.map(({ label, step }) => (
        <button key={step} className={styles.primary} onClick={() => handleClick(step)}>
          {label}
        </button>
      ))}
    </div>
  );
};

export default ComponentSelect;
