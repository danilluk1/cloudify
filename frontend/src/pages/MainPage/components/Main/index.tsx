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
  setFiles,
  fetchFile,
} from "../../../../redux/slice/storageSlice";
import Folder from "./Folder";
import { $axios } from "../../../../api/axios";
import { IFile } from "../../../../models/IFile";
import { resolve } from "node:path/win32";

const Main = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.user);
  const storage = useAppSelector((state) => state.storageSlice);

  React.useEffect(() => {
    dispatch(fetchFolders(user.id));
    if (storage.folders.length === 0) return;
    dispatch(fetchFiles(storage.sf_id));
  }, [storage.sf_id]);

  React.useEffect(() => {
    if (storage.files.length === 0) return;

    for (let i = 0; i < storage.files.length; i++) {
      dispatch(fetchFile(storage.files[i].id));
    }
  }, [storage.files.length]);

  return (
    <div className={styles.content}>
      <div className={styles.foldersGrid}>
        {storage.foldersStatus === "success" ? (
          storage.folders.map((folder) => (
            <Folder folder={folder} id={folder.id} />
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
