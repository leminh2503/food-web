import {Project} from "@app/module/project";
import ApiUser from "@app/api/ApiUser";
import {Salary} from "@app/module/salary";

export default function index() {
  const role = ApiUser.getUserRole();
  return role?.toString() === "1" ? <Project /> : <Salary />;
}
