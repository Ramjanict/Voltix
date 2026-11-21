import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types";

export interface UserState {
  user: User | any;
}

const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
  },
});

export const { setUserDetails } = userSlice.actions;

export default userSlice.reducer;
