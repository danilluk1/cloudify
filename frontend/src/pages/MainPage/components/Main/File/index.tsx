import React from "react";
import { IFile } from "../../../../../models/IFile";
import styles from "./File.module.scss";
import defIcon from "./../../../../../assets/icons/defFile.svg";
interface Props {
  file: IFile;
}
const File: React.FC<Props> = ({ file }) => {
  const [image, setImage] = React.useState();

  React.useEffect(() => {
    if (!file.type.includes("image")) {
      setImage(defIcon);
    } else {
      setImage(file.data);
    }
  }, []);
  function folderClick(id: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className={styles.root} onClick={() => folderClick(file.id)}>
      <img src={image} alt="hahd" />
      <p>{file.name}</p>
    </div>
  );
};

export default File;
