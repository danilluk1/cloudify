import IFolder from "./IFolder";
export default interface IUser {
  folders: IFolder[];
  email: string;
  access_token: string;
  id: number;
  selected_folder_index: number;
  space_available: number;
  max_space: number;
}
