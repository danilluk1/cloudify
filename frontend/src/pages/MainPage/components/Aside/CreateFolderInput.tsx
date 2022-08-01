import React from "react";
import { useAppSelector } from "../../../../redux/hooks";
import styles from "./Aside.module.scss";

type Props = {
  onAddClick: (name: string) => void;
};

const CreateFolderInput: React.FC<Props> = ({ onAddClick }) => {
  const [folderName, setFolderName] = React.useState<string>("");

  return (
    <div className={styles.crFolder__root}>
      <input
        className={styles.crFolder__input}
        onChange={(e) => setFolderName(e.target.value)}
        value={folderName}
      />
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        onClick={() => onAddClick(folderName)}
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  );
};

export default CreateFolderInput;
