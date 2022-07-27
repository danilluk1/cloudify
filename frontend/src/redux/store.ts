import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import storageSlice from './slice/storageSlice';
import userSlice from './slice/userSlice';

export const store = configureStore({
  reducer: {
    userSlice,
    storageSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
