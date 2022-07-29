import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
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

export const fetchLogin = createAsyncThunk<IUser, UserLoginDto>(
  "user/fetchLogin",
  async (params) => {
    const { password, email } = params;
    const response = await $axios.post<IUser>("/login", { email, password });

    return response.data;
  }
);

export const fetchUploadFiles = createAsyncThunk<any, any>(
  "user/fetchUploadFiles",
  async (params) => {
    const {files} = params;
    const config = {
      headers: {
        'content-type' : 'multipart/form-data',
      },
    };
    const response = await axios.post()
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
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
