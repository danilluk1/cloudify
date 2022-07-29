import { IFile } from "./IFile";

export default interface IFolder {
  name: string;
  parent_id: number;
  id: number;
  is_root: boolean;
  files: IFile[];
  local_path: string;
}
