import {Position} from "@app/module/position";
import {Salary} from "@app/module/salary";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export default function index() {
  return CheckPermissionEvent(
    NameEventConstant.PERMISSION_POSITION_KEY.LIST_ALL
  ) ? (
    <Position />
  ) : (
    <Salary />
  );
}
