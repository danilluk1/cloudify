import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { $axios } from "../../api/axios";
import UserLoginDto from "../../models/dtos/UserLoginDto";
import IFolder from "../../models/IFolder";
import IUser from "../../models/IUser";

interface UserSliceState {
  user: IUser;
  isAuth: boolean;
}

function getUserFromLS(): UserSliceState {
  let userJson = localStorage.getItem("user");
  let isAuth = userJson !== null;
  const user = JSON.parse(userJson ?? "{}");
  user.selected_folder_index = 0;

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

export const fetchFolders = createAsyncThunk<IFolder[], number>(
  "user/fetchFolders",
  async (params) => {
    const user_id = params;
    const response = await $axios.get<IFolder[]>(`/folders/${user_id}`);

    return response.data;
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
    setSelectedFolder(state, action: PayloadAction<number>) {
      state.user.selected_folder_index = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchLogin.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.user = action.payload;
        state.isAuth = true;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    );

    builder.addCase(
      fetchFolders.fulfilled,
      (state, action: PayloadAction<IFolder[]>) => {
        state.user.folders = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    );
  },
});

export const { setUser, setSelectedFolder } = userSlice.actions;
export default userSlice.reducer;
