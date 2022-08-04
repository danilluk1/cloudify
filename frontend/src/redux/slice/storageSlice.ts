import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { $axios } from "../../api/axios";
import IFolderInfoDto from "../../models/dtos/FolderInfoDto";
import IFolder from "../../models/IFolder";

export interface StorageState {
  //Contains all user folders from db
  folder: IFolderInfoDto;

  //Stack of user last opened folders
  selectedFoldersId: number[];

  rootFolderId: number;

  folderStatus: "success" | "loading" | "error";
  filesStatus: "success" | "loading" | "error";
}

const initialState: StorageState = {
  folderStatus: "loading",
  filesStatus: "loading",
  selectedFoldersId: [],
  folder: {
    folder: {
      name: "",
      parent_id: 0,
      id: 0,
      is_root: false,
      local_path: "",
      files: [],
      folders: [],
    },
    folder_id: 0,
    folders: [],
    files: [],
  },
  rootFolderId: 0,
};

export const deleteFolder = createAsyncThunk<any, number>(
  "user/deleteFolder",
  async (params) => {
    const id = params;

    const response = await $axios.delete(`/folder/${id}`);

    return response.data;
  }
);

export const fetchFolders = createAsyncThunk<IFolder[], number>(
  "user/fetchFolders",
  async (params) => {
    const user_id = params;

    const response = await $axios.get(`/folders/${user_id}`);

    return response.data.folders;
  }
);

export const fetchFolderInfo = createAsyncThunk<IFolderInfoDto, number>(
  "user/fetchFolderInfo",
  async (params) => {
    const folder_id = params;
    const response = await $axios.get(`/folder/${folder_id}`);
    return response.data;
  }
);

export const fetchFile = createAsyncThunk<any, number>(
  "user/fetchFile",
  async (params) => {
    const id = params;
    const response = await $axios.get(`/file/${id}`, {
      responseType: "blob",
    });
    const resp = {
      data: URL.createObjectURL(response.data),
      file_id: id,
      type: response.data.type,
    };
    return resp;
  }
);

export const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    newFolderOpened(state, action: PayloadAction<number>) {
      state.selectedFoldersId.push(action.payload);
      state.folder.files = [];
      state.filesStatus = "loading";
    },
    folderClosed(state) {
      if (state.selectedFoldersId.length > 0) {
        state.selectedFoldersId.pop();
      } else {
        state.selectedFoldersId.push(state.rootFolderId);
      }
      state.folder.files = [];
      state.filesStatus = "loading";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchFolderInfo.fulfilled,
      (state, action: PayloadAction<IFolderInfoDto>) => {
        state.folder = action.payload;
        state.folderStatus = "success";
        state.filesStatus = "success";
      }
    );

    builder.addCase(fetchFolderInfo.pending, (state) => {
      state.folderStatus = "loading";
    });

    builder.addCase(fetchFolderInfo.rejected, (state) => {
      state.folderStatus = "error";
    });

    builder.addCase(
      fetchFolders.fulfilled,
      (state, action: PayloadAction<IFolder[]>) => {
        state.rootFolderId = action.payload[0].id;
      }
    );

    builder.addCase(
      fetchFile.fulfilled,
      (state, action: PayloadAction<any>) => {
        let data = action.payload.data;
        let type = action.payload.type;
        let id = action.payload.file_id;

        let currentFileIndex = state.folder.files.findIndex((f) => f.id === id);
        if (currentFileIndex === -1) {
          console.log(id);
          console.log("??");
          return;
        }
        state.folder.files[currentFileIndex].data = action.payload.data;
        state.folder.files[currentFileIndex].type = action.payload.type;
      }
    );
    builder.addCase(fetchFile.pending, (state) => {});

    builder.addCase(fetchFile.rejected, (state) => {});

    builder.addCase(deleteFolder.fulfilled, (state, action: PayloadAction<any>) => {
      
    });
  },
});
export const { newFolderOpened, folderClosed } = storageSlice.actions;

export default storageSlice.reducer;
