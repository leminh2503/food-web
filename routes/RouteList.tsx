import {IAccountRole} from "../types";

export interface IRoute {
  path: string;
  name: string;
  role?: Array<IAccountRole>;
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
    name: "Home",
    icon: "Homepage",
    isSSR: true,
    isSidebar: true,
  },
  {
    path: "/account-manager",
    name: "Quản lý tài khoản",
    role: [IAccountRole.ADMIN],
    icon: "Homepage",
    isSidebar: true,
  },
  {
    path: "/salary",
    name: "Bảng lương",
    icon: "Homepage",
    isSidebar: true,
  },
  {
    path: "/leave-work",
    name: IAccountRole.ADMIN ? "Quản lý nghỉ phép" : "Đơn xin nghỉ phép",
    role: [IAccountRole.USER, IAccountRole.ADMIN],
    icon: "Homepage",
    isSidebar: true,
  },
  {
    path: "/events",
    name: "Sự kiện công ty",
    icon: "Homepage",
    isSidebar: true,
  },
  {
    path: "/birthday",
    name: "Sinh nhật",
    icon: "Homepage",
    isSidebar: true,
  },
  {
    path: "/accout",
    name: "Thông tin tài khoản",
    icon: "Homepage",
    isSidebar: true,
  },
  {
    path: "/rules",
    name: "Nội quy - Quy định",
    icon: "Homepage",
    isSidebar: true,
  },
  {
    path: "/work-schedule",
    name: "Lịch làm việc",
    icon: "Homepage",
    isSidebar: true,
  },
  {
    path: "/project",
    name: "Dự án",
    icon: "Homepage",
    isSidebar: true,
    role: [IAccountRole.ADMIN],
  },
  {
    path: "/settings",
    name: "Cài đặt",
    icon: "Homepage",
    role: [IAccountRole.ADMIN],
    isSidebar: true,
  },
];

export default routes;
