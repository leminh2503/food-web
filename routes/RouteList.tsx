import NameEventConstant from "@app/check_event/NameEventConstant";

export interface IRoute {
  path: string;
  name: string;
  role?: string;
  icon?: string;
  isSidebar?: boolean;
  isPrivate?: boolean;
  isPublic?: boolean;
  isUpdating?: boolean;
  isAuth?: boolean;
  isSSR?: boolean;
  children?: IRoute[];
}

const routes: IRoute[] = [
  {
    path: "/users",
    name: "Quản lý tài khoản",
    isPrivate: true,
    icon: "Users",
    isSidebar: true,
  },
  {
    path: "/manager-salary",
    name: "Quản lý bảng lương",
    role: NameEventConstant.PERMISSION_SALARY_MANAGER_KEY.LIST_ALL_SALARY,
    isPrivate: true,
    icon: "Payroll",
    isSidebar: true,
  },
  {
    path: "/booking",
    name: "Booking",
    icon: "Payroll",
    isPrivate: true,
    isSidebar: true,
  },
];

export default routes;
