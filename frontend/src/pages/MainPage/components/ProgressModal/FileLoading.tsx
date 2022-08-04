import ProgressBar from "@ramonak/react-progress-bar";
import React from "react";
import styles from "./ProgressModal.module.scss";

type Props = {
  fileName: string;
};

const FileLoading: React.FC<Props> = ({ fileName }) => {
  return (
    <div className={styles.fileLoading}>
      <span>{fileName}</span>
     
    </div>
  );
};

export default FileLoading;
