//Reduced all 8 js biometric scanning components to one function and 2 variables
import React from "react";
import styles from "../styles/index.module.css";

function PhotoResult({ photoUrl = "" }) {
  return (
    <div className={styles.container}>
      <img alt="Web component result" src={photoUrl} />
    </div>
  );
}

export default PhotoResult;
