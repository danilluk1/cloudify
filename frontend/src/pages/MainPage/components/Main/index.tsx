import React from "react";
import IFolder from "../../../../models/IFolder";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import styles from "./Main.module.scss";
import File from "./File";
import {
  fetchFolders,
  fetchFolderInfo,
  fetchFile,
} from "../../../../redux/slice/storageSlice";
import Folder from "./Folder";

const Main = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.userSlice.user);
  const storage = useAppSelector((state) => state.storageSlice);

  React.useEffect(() => {
    dispatch(fetchFolders(user.id));
    dispatch(fetchFolderInfo(storage.rootFolderId));
  }, []);

  React.useEffect(() => {
    dispatch(
      fetchFolderInfo(
        storage.selectedFoldersId[storage.selectedFoldersId.length - 1]
      )
    );
  }, [storage.selectedFoldersId.length]);

  React.useEffect(() => {
    if (!storage.folder) return;

    for (let i = 0; i < storage.folder.files.length; i++) {
      dispatch(fetchFile(storage.folder.files[i].id));
    }
  }, [storage.folder?.files]);

  return (
    <div className={styles.content}>
      <div className={styles.foldersGrid}>
        {storage.folderStatus === "success" ? (
          storage.folder?.folders?.map((folder) => (
            <Folder folder={folder} id={folder.id} />
          ))
        ) : (
          <div></div>
        )}
        {storage.filesStatus === "success" ? (
          storage.folder?.files?.map((file) => <File file={file} />)
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Main;
