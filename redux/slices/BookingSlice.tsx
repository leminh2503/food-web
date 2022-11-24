import {createSlice} from "@reduxjs/toolkit";

interface ISessionBooking {
  session: number;
}
const initialState: ISessionBooking = {
  session: 1,
};

const BookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    sessionBooking: (state, action) => {
      state.session = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {sessionBooking} = BookingSlice.actions;
const BookingReducer = BookingSlice.reducer;
export default BookingReducer;
