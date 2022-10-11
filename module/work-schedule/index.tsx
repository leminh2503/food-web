import "./index.scss";
import React from "react";
import {AdminWorkSchedule} from "./AdminWorkSchedule";
import {UserWorkSchedule} from "./UserWorkSchedule";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export function WorkSchedule(): JSX.Element {
  return (
    <div className="container-work-schedule">
      {CheckPermissionEvent(
        NameEventConstant.PERMISSION_WORK_CALENDAR_KEY.LIST_ALL
      ) ? (
        <AdminWorkSchedule />
      ) : (
        <UserWorkSchedule />
      )}
    </div>
  );
}
