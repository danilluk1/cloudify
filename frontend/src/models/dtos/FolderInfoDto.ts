import IFile from "../IFile";
import IFolder from "../IFolder";

export default interface IFolderInfoDto {
  folder: IFolder;
  folder_id: number;
  folders: IFolder[];
  files: IFile[];
}
