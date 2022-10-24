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
  // {
  //   path: Config.PATHNAME.LOGIN,
  //   name: "Auth",
  //   isAuth: true,
  // },
  // {
  //   path: "/approve-news",
  //   name: "sidebar.approve_new",
  //   role: ["admin"],
  //   icon: "usd_coin_usdc",
  //   isPrivate: true,
  //   isSidebar: true,
  // },
  {
    path: "/",
    name: "Quản lý tài khoản",
    role: NameEventConstant.PERMISSION_USER_KEY.LIST_ALL_USER,
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
    path: "/salary",
    name: "Bảng lương cá nhân",
    icon: "Payroll",
    isPrivate: true,
    isSidebar: true,
  },
];

export default routes;
