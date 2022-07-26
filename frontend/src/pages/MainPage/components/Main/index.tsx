import React, { useRef } from "react";
import IFolder from "../../../../models/IFolder";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  fetchFolders,
  setSelectedFolder,
} from "../../../../redux/slice/userSlice";
import { parseFoldersTree } from "../../../../utils/parseFoldersTree";
import Header from "./Header/Header";
import styles from "./Main.module.scss";

const Main = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.user);
  const [folders, setFolders] = React.useState<IFolder[]>([]);

  React.useEffect(() => {
    dispatch(fetchFolders(user.id));
  }, []);

  React.useEffect(() => {
    if (!user.folders) return;
    setFolders(
      parseFoldersTree(
        user.folders,
        user.folders[user.selected_folder_index].id
      )
    );
    console.log(folders);
  }, [user.selected_folder_index]);

  const folderClick = (id: number) => {
    dispatch(setSelectedFolder(user.folders.findIndex((f) => f.id === id)));
  };

  return (
    <div className={styles.content}>
      <Header folderPath="content/videos" />
      <div className={styles.foldersGrid}>
        {folders?.map((folder) => (
          <>
            <div
              className={styles.folder}
              onClick={() => folderClick(folder.id)}
            >
              <svg
                width="100"
                height="75"
                viewBox="0 0 100 75"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M4 0C1.79086 0 0 1.79086 0 4V14C0 14.1693 0.0105217 14.3362 0.0309469 14.5C0.0105217 14.6638 0 14.8307 0 15V71C0 73.2091 1.79086 75 4 75H96C98.2091 75 100 73.2091 100 71V15C100 12.7909 98.2091 11 96 11H43.0278C43.0256 10.9981 43.0234 10.9962 43.0212 10.9942L31.6323 0.994239C30.9025 0.353396 29.9644 0 28.9931 0H4Z"
                  fill="#52C41A"
                />
              </svg>
              <p>{folder.name}</p>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Main;
