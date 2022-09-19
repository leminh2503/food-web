import {AccountManager} from "@app/module/account-manager";
import {Salary} from "@app/module/salary";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export default function index() {
  return CheckPermissionEvent(
    NameEventConstant.PERMISSION_USER_KEY.LIST_ALL_USER
  ) ? (
    <AccountManager />
  ) : (
    <Salary />
  );
}
