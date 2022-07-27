import IFolder from "../models/IFolder";

export const getFolderChildren = (folders: IFolder[], id: number) => {
  return folders.filter(folder => folder.parent_id === id);
}