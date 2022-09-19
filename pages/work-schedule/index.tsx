import {WorkSchedule} from "@app/module/work-schedule";
import {Salary} from "@app/module/salary";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export default function index() {
  return CheckPermissionEvent(
    NameEventConstant.PERMISSION_WORK_CALENDAR_KEY.LIST_ALL
  ) ? (
    <WorkSchedule />
  ) : (
    <Salary />
  );
}
