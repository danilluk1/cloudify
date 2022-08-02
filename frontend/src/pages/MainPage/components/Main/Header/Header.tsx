import React from "react";
import IFolder from "../../../../../models/IFolder";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { folderClosed } from "../../../../../redux/slice/storageSlice";
import styles from "./Header.module.scss";

interface Props {
  folderPath: string;
}

const Header: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const storage = useAppSelector((state) => state.storageSlice);
  const [folderPath, setFolderPath] = React.useState("");
  React.useEffect(() => {
    setFolderPath(storage.folder?.folder?.local_path);
  }, [storage.folder.folder]);

  const onBackClick = () => {
    dispatch(folderClosed());
  };

  return (
    <div className={styles.root}>
      <div className={styles.upperBlock}>
        <svg
          onClick={onBackClick}
          width="22"
          height="16"
          viewBox="0 0 22 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M7.07283 0.49712C6.70791 0.176698 6.23886 0 5.75323 0H2C0.89543 0 0 0.895431 0 2V2.34668V3.84V14C0 15.1046 0.895433 16 2 16H19.3333C20.4379 16 21.3333 15.1046 21.3333 14V4.34668C21.3333 3.24211 20.4379 2.34668 19.3333 2.34668H9.93271C9.44708 2.34668 8.97803 2.16998 8.61311 1.84956L7.07283 0.49712Z"
            fill="#40A9FF"
          />
        </svg>
        <h1>Cloudify</h1>
      </div>
      <h3 style={{ marginLeft: "15px" }}>{folderPath}</h3>
      <svg
        onClick={() => onBackClick()}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
      </svg>
    </div>
  );
};

export default Header;
