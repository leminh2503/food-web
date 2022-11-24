import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IAccountInfo, IEditUser} from "@app/types";

const initialState: IAccountInfo = {};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (_, action: PayloadAction<IAccountInfo>) => {
      return action.payload;
    },
    editAcountMe: (state, action: PayloadAction<IEditUser>) => {
      console.log(state);
      if (state.user) {
        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
      }
    },
    logoutUser: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {loginUser, editAcountMe, logoutUser} = UserSlice.actions;

export default UserSlice.reducer;
