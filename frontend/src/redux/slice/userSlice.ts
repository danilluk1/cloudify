import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";
import { Stats } from "fs";
import Cookies from "js-cookie";
import { config } from "process";
import { $axios } from "../../api/axios";
import UserLoginDto from "../../models/dtos/UserLoginDto";
import IUser from "../../models/IUser";

interface UserSliceState {
  user: IUser;
  isAuth: boolean;
  theme: "light" | "dark";
  isProgressLoaderShown: boolean;
  uploadingFilesNames: string[];
  uploadingStatus: "loading" | "error" | "success";
  loadingProgress: number;
}

function getUserFromLS(): any {
  let userJson = localStorage.getItem("user");
  let isAuth = userJson !== null;
  const user = JSON.parse(userJson ?? "{}");
  return {
    isAuth: isAuth,
    user,
    theme: "light",
    isProgressLoaderShown: false,
    loadingStatus: "success",
    loadingProgress: 0,
    uploadingFilesNames: [],
  };
}

const initialState: UserSliceState = {
  ...getUserFromLS(),
};

export const fetchAvailableSpace = createAsyncThunk<number, number>(
  "user/fetchAvailableSpace",
  async (params) => {
    const id = params;
    const response = await $axios.get(`/user/${id}/space`);
    return response.data.space_available;
  }
);

export const fetchLogout = createAsyncThunk<void, void>(
  "user/fetchLogout",
  async () => {
    await $axios.post("/logout");
  }
);

export const fetchLogin = createAsyncThunk<IUser, UserLoginDto>(
  "user/fetchLogin",
  async (params) => {
    const { password, email } = params;
    const response = await $axios.post<IUser>("/login", { email, password });
    return response.data;
  }
);

export const fetchRegister = createAsyncThunk<IUser, UserLoginDto>(
  "user/fetchRegister",
  async (params) => {
    const { password, email } = params;
    const response = await $axios.post<IUser>("/register", { email, password });
    return response.data;
  }
);

export const fetchUploadFiles = createAsyncThunk<any, any>(
  "user/fetchUploadFiles",
  async (formData: FormData, thunkAPI) => {
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: ProgressEvent) => {
        let progressPercentage =
          (progressEvent.loaded / progressEvent.total) * 100;
        thunkAPI.dispatch(
          uploadingProgressUpdate(Number(progressPercentage.toFixed(0)))
        );
        thunkAPI.dispatch(progressLoaderShownChanged(true));
      },
    };
    const response = await $axios.post("/upload", formData, config);
  }
);

export const fetchCreateFolder = createAsyncThunk<any, any>(
  "user/fetchCreateFolder",
  async (path: string) => {
    await $axios.post("/folder", {
      folderPath: path,
    });
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
      state.user.selected_folder_index = 0;
      state.isAuth = true;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    changeTheme(state) {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    uploadingProgressUpdate(state, action: PayloadAction<number>) {
      state.loadingProgress = action.payload;
    },
    newUploadingFiles(state, action: PayloadAction<string[]>) {
      state.uploadingFilesNames = action.payload;
    },
    progressLoaderShownChanged(state, action: PayloadAction<boolean>) {
      state.isProgressLoaderShown = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchLogin.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
        state.isAuth = true;
        state.user.selected_folder_index = 0;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    );
    builder.addCase(
      fetchRegister.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
        state.isAuth = true;
        state.user.selected_folder_index = 0;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    );
    builder.addCase(
      fetchAvailableSpace.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.user.space_available = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    );
    builder.addCase(fetchLogout.fulfilled, (state) => {
      state.user = {
        email: "",
        folders: [],
        access_token: "",
        id: 0,
        selected_folder_index: 0,
        space_available: 0,
        max_space: 0,
      };
      state.isAuth = false;
      localStorage.clear();
    });

    builder.addCase(
      fetchUploadFiles.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.uploadingStatus = "success";
      }
    );
    builder.addCase(fetchUploadFiles.rejected, (state) => {
      state.uploadingStatus = "error";
    });
    builder.addCase(fetchUploadFiles.pending, (state) => {
      state.uploadingStatus = "loading";
    });
  },
});

export const {
  progressLoaderShownChanged,
  newUploadingFiles,
  setUser,
  changeTheme,
  uploadingProgressUpdate,
} = userSlice.actions;
export default userSlice.reducer;
