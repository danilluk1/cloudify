import ProgressBar from "@ramonak/react-progress-bar";
import React from "react";
import styles from "./ProgressModal.module.scss";

type Props = {
  fileName: string;
};

const FileLoading: React.FC<Props> = ({ fileName }) => {
  const [isFinished] = React.useState(true);
  return (
    <div className={styles.fileLoading}>
      <span>{fileName}</span>
      <ProgressBar
        completed={60}
        className={styles.progressBar}
        customLabel={""}
        animateOnRender={false}
      />
      {isFinished === true ? (
        <div className={styles.round}></div>
      ) : (
        <div className={styles.round}></div>
      )}
    </div>
  );
};

export default FileLoading;
