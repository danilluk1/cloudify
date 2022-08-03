import ProgressBar from "@ramonak/react-progress-bar";
import React from "react";
import FileLoading from "./FileLoading";
import styles from "./ProgressModal.module.scss";


const ProgressModal : React.FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.root__header}>
        <div>
          <h3>Загрузка</h3>
          <h3>1/6</h3>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div className={styles.fileLoading_root}>
        <FileLoading fileName="Linux api book" />
        <FileLoading fileName="Linux api book" />
        <FileLoading fileName="Linux api book" />
        <FileLoading fileName="Linux api book" />
        <FileLoading fileName="Linux api book" />
      </div>
    </div>
  );
};

export default ProgressModal;
