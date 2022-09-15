import {Position} from "@app/module/position";
import ApiUser from "@app/api/ApiUser";
import {Salary} from "@app/module/salary";

export default function index() {
  const role = ApiUser.getUserRole();
  return role?.toString() === "1" ? <Position /> : <Salary />;
}
