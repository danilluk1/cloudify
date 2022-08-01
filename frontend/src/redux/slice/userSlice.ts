import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { $axios } from "../../api/axios";
import UserLoginDto from "../../models/dtos/UserLoginDto";
import IUser from "../../models/IUser";

interface UserSliceState {
  user: IUser;
  isAuth: boolean;
}

function getUserFromLS(): any {
  let userJson = localStorage.getItem("user");
  let isAuth = userJson !== null;
  const user = JSON.parse(userJson ?? "{}");
  return { isAuth: isAuth, user };
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
  async (formData: any) => {
    const config = {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    };
    const response = await $axios.post("/upload", formData);
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
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
