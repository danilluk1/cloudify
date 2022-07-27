import React from "react";
import IFolder from "../../../../models/IFolder";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { getFolderChildren } from "../../../../utils/parseFoldersTree";
import Header from "./Header/Header";
import styles from "./Main.module.scss";
import File from "./File";
import {
  fetchFolders,
  fetchFiles,
  setSelectedFolder,
} from "../../../../redux/slice/storageSlice";
import Folder from "./Folder";

const Main = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.user);
  const storage = useAppSelector((state) => state.storageSlice);

  React.useEffect(() => {
    dispatch(fetchFolders(user.id));
    if (storage.folders.length === 0) return;
    dispatch(fetchFiles(storage.folders[storage.sf_index].id));
  }, [storage.sf_index]);

  const selectFolder = (index: number) => {
    dispatch(setSelectedFolder(index));
  };

  return (
    <div className={styles.content}>
      <div className={styles.foldersGrid}>
        {storage.foldersStatus === "success" ? (
          storage.folders.map((folder, index) => (
            <Folder folder={folder} index={index} />
          ))
        ) : (
          <div></div>
        )}
        {storage.filesStatus === "success" ? (
          storage.files.map((file) => <File file={file} />)
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Main;
