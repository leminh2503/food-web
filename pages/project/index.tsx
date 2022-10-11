import {Project} from "@app/module/project";
import {Salary} from "@app/module/salary";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export default function index() {
  return CheckPermissionEvent(
    NameEventConstant.PERMISSION_PROJECT_KEY.LIST_ALL
  ) ? (
    <Project />
  ) : (
    <Salary />
  );
}
