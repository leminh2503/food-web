/* eslint-disable prettier/prettier */
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

/* eslint-disable prettier/prettier */

import {IWorkScheduleCustom} from "@app/types";

// interface timeChange {
//   type: string;
//   value: string;
//   day: string;
// }

const data: IWorkScheduleCustom[] = [];

const WorkingDaySlice = createSlice({
  name: "workingDay",
  initialState: data,
  reducers: {
    getData: (_, action: PayloadAction<IWorkScheduleCustom[]>) => {
      return action.payload;
    },
    // changeTime: (state, action: PayloadAction<timeChange>) => {
    //   const index = state.findIndex((item) => item.day === action.payload.day);
    //   const workingDay = state[index];
    //   switch (action.payload.type) {
    //     case "start.minute":
    //       workingDay.startTime?.minute = action.payload.value;
    //       break;
    //     case "start.second":
    //       workingDay.startTime?.second = action.payload.value;
    //       break;
    //     case "end.minute":
    //       workingDay.endTime?.minute = action.payload.value;
    //       break;
    //     case "end.second":
    //       workingDay.endTime?.second = action.payload.value;
    //       break;
    //   }
    // },
  },
});

export const {getData} = WorkingDaySlice.actions;

export default WorkingDaySlice.reducer;
