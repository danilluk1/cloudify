import React from "react";
import { useAppSelector } from "../../../../../redux/hooks";
import styles from "./Header.module.scss";

interface Props {
  folderPath: string;
}

const Header: React.FC<Props> = ({ folderPath }) => {
  const user = useAppSelector((state) => state.userSlice.user);
  return (
    <div className={styles.root}>
      <h3 style={{ marginLeft: "15px" }}>
        {user.folders[user.selected_folder_index].name}
      </h3>
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
      </svg>
    </div>
  );
};

export default Header;
