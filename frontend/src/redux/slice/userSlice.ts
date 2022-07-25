import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { $axios } from "../../api/axios";
import UserLoginDto from "../../models/dtos/UserLoginDto";
import IUser from "../../models/IUser";

const getUserFromLS = (): UserSliceState => {
  let userJson = localStorage.getItem("user");
  let isAuth = userJson !== null;

  return { isAuth, ...JSON.parse(userJson ?? "{}") };
};

interface UserSliceState {
  user: IUser;
  isAuth: boolean;
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

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload;
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
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    );
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
