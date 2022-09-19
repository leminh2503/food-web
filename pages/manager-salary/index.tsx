import {AdminSalaryTable} from "@app/module/admin-salary-table";
import {Salary} from "@app/module/salary";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export default function index() {
  return CheckPermissionEvent(
    NameEventConstant.PERMISSION_SALARY_MANAGER_KEY.LIST_ALL_SALARY
  ) ? (
    <AdminSalaryTable />
  ) : (
    <Salary />
  );
}
