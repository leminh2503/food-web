import {IRootState} from "@app/redux/store";
import "./index.scss";
import React from "react";
import {useSelector} from "react-redux";
import {AdminWorkSchedule} from "./AdminWorkSchedule";
import {UserWorkSchedule} from "./UserWorkSchedule";

export function WorkSchedule(): JSX.Element {
  const role = useSelector((state: IRootState) => state.user.role);

  return (
    <div className="container-work-schedule">
      {role ? <AdminWorkSchedule /> : <UserWorkSchedule />}
    </div>
  );
}
