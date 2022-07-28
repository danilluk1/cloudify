import ProgressBar from "@ramonak/react-progress-bar";
import { setFiles } from "@testing-library/user-event/dist/types/utils";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../../../../redux/hooks";
import userSlice from "../../../../redux/slice/userSlice";
import styles from "./Aside.module.scss";

const Aside = () => {
  const user = useAppSelector((state) => state.userSlice.user);
  const [files, setFiles] = useState();
  const {handleSubmit} = useForm();
  
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setFiles(event?.target?.files);
  }
  const onUploadClick = () => {

  }

  return (
    <div className={styles.root}>
      <div className={styles.foldersBlock}>
        <form onSubmit={handleSubmit(onUploadClick)}>
          <input type="file" onChange={handleChange} />
          <button type="submit">Upload</button>
        </form>
        <form>
          <button type="submit">Create</button>
        </form>
      </div>
      <div className={styles.aboutStorage}>
        <div className={styles.storageCloud}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_101_2063)">
              <path
                d="M20.0196 9.49767C18.7929 6.26195 15.667 3.96106 12.0054 3.96106C8.34375 3.96106 5.21786 6.25927 3.99107 9.49499C1.69554 10.0977 0 12.187 0 14.6753C0 17.6352 2.39732 20.0325 5.35446 20.0325H18.6455C21.6027 20.0325 24 17.6352 24 14.6753C24 12.1923 22.3098 10.103 20.0196 9.49767ZM20.992 17.0245C20.6846 17.3336 20.3189 17.5788 19.9162 17.7457C19.5134 17.9126 19.0815 17.9979 18.6455 17.9968H5.35446C4.46786 17.9968 3.63482 17.6512 3.00804 17.0245C2.69881 16.7165 2.45367 16.3504 2.28678 15.9472C2.11989 15.544 2.03456 15.1117 2.03571 14.6753C2.03571 13.9253 2.27946 13.2209 2.7375 12.6316C3.18605 12.0607 3.80709 11.6501 4.50804 11.4611L5.52321 11.1959L5.89554 10.2155C6.12589 9.60481 6.44732 9.03427 6.85179 8.51731C7.25108 8.00492 7.72407 7.5545 8.25536 7.1807C9.35625 6.4066 10.6527 5.99677 12.0054 5.99677C13.358 5.99677 14.6545 6.4066 15.7554 7.1807C16.2884 7.5557 16.7598 8.0057 17.1589 8.51731C17.5634 9.03427 17.8848 9.60749 18.1152 10.2155L18.4848 11.1932L19.4973 11.4611C20.9518 11.8495 21.9643 13.17 21.9643 14.6753C21.9643 15.562 21.6187 16.3977 20.992 17.0245Z"
                fill="black"
                fill-opacity="0.85"
              />
            </g>
            <defs>
              <clipPath id="clip0_101_2063">
                <rect width="24" height="24" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <h4>Storage</h4>
        </div>
        <p>
          {(user.space_available / 1024 / 1024 / 1024 / 1024).toFixed(3)}GB of
          15GB
        </p>
        <ProgressBar completed={60} className={styles.progress_wrapper} />
      </div>
    </div>
  );
};

export default Aside;
