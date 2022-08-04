import ProgressBar from "@ramonak/react-progress-bar";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { progressLoaderShownChanged } from "../../../../redux/slice/userSlice";
import FileLoading from "./FileLoading";
import styles from "./ProgressModal.module.scss";

const ProgressModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loadingProgress, uploadingFilesNames } = useAppSelector(
    (state) => state.userSlice
  );

  return (
    <div className={styles.root}>
      <div className={styles.root__header}>
        <div>
          <h3>Загрузка</h3>
        </div>
        <svg
          onClick={() => dispatch(progressLoaderShownChanged(false))}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <div className={styles.fileLoading_root}>
        {uploadingFilesNames ??
          (uploadingFilesNames as string[]).map((fn) => (
            <FileLoading fileName={fn} />
          ))}
      </div>
      <ProgressBar
        completed={loadingProgress}
        className={styles.progressBar}
        customLabel={""}
        animateOnRender={false}
      />
    </div>
  );
};

export default ProgressModal;
