import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { $axios } from "../../api/axios";
import { IFile } from "../../models/IFile";
import IFolder from "../../models/IFolder";
import { getFolderChildren } from "../../utils/parseFoldersTree";

export interface StorageState {
  folders: IFolder[];
  sf_index: number;

  files: IFile[];

  foldersStatus: "success" | "loading" | "error";
  filesStatus: "success" | "loading" | "error";
}

const initialState: StorageState = {
  folders: [],
  sf_id,
  files: [],
  foldersStatus: "loading",
  filesStatus: "loading",
};

export const fetchFolders = createAsyncThunk<IFolder[], number>(
  "user/fetchFolders",
  async (params) => {
    const user_id = params;
    const response = await $axios.get<IFolder[]>(`/folders/${user_id}`);

    return response.data;
  }
);

export const fetchFiles = createAsyncThunk<IFile[], number>(
  "user/fetchFiles",
  async (params) => {
    const folder_id = params;
    const response = await $axios.get<IFile[]>(`/folder/${folder_id}`);

    return response.data;
  }
);

export const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    setSelectedFolder(state, action: PayloadAction<number>) {
      state.sf_index = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchFolders.fulfilled,
      (state, action: PayloadAction<IFolder[]>) => {
        state.folders = getFolderChildren(
          action.payload,
          action.payload[state.sf_index].id
        );
        state.foldersStatus = "success";
      }
    );

    builder.addCase(fetchFolders.pending, (state) => {
      state.folders = [];
      state.foldersStatus = "loading";
    });

    builder.addCase(fetchFolders.rejected, (state) => {
      state.folders = [];
      state.foldersStatus = "error";
    });

    builder.addCase(
      fetchFiles.fulfilled,
      (state, action: PayloadAction<IFile[]>) => {
        state.files = action.payload;
        state.filesStatus = "success";
      }
    );

    builder.addCase(fetchFiles.pending, (state) => {
      state.files = [];
      state.filesStatus = "loading";
    });

    builder.addCase(fetchFiles.rejected, (state) => {
      state.files = [];
      state.filesStatus = "error";
    });
  },
});

export const { setSelectedFolder } = storageSlice.actions;

export default storageSlice.reducer;
