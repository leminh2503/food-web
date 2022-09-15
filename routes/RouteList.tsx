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
    role: "1",
    isPrivate: true,
    icon: "Users",
    isSidebar: true,
  },
  {
    path: "/manager-salary",
    name: "Quản lý bảng lương",
    role: "1",
    isPrivate: true,
    icon: "Payroll",
    isSidebar: true,
  },
  {
    path: "/",
    name: "Bảng lương",
    icon: "Payroll",
    role: "0",
    isPrivate: true,
    isSidebar: true,
  },
  {
    path: "/salary-user",
    name: "Duyệt lương nhân viên",
    role: "1",
    isPrivate: true,
    icon: "Users",
    isSidebar: true,
  },
  {
    path: "/leave-work",
    name: "Quản lý nghỉ phép",
    role: "1",
    isPrivate: true,
    icon: "MangeLeave",
    isSidebar: true,
  },
  {
    path: "/leave-work",
    name: "Đơn xin nghỉ phép",
    role: "0",
    isPrivate: true,
    icon: "MangeLeave",
    isSidebar: true,
  },
  {
    path: "/event",
    name: "Sự kiện công ty",
    isPrivate: true,
    icon: "Event",
    isSidebar: true,
  },
  {
    path: "/birthday",
    name: "Sinh nhật",
    isPrivate: true,
    icon: "Birthday",
    isSidebar: true,
  },
  {
    path: "/profile-account",
    name: "Thông tin tài khoản",
    isPrivate: true,
    icon: "User",
    isSidebar: true,
  },
  {
    path: "/rule",
    name: "Nội quy - Quy định",
    isPrivate: true,
    icon: "Rules",
    isSidebar: true,
  },
  {
    path: "/work-schedule",
    name: "Lịch làm việc",
    isPrivate: true,
    icon: "CalenderWork",
    isSidebar: true,
  },
  {
    path: "/project",
    name: "Dự án",
    icon: "Project",
    isPrivate: true,
    isSidebar: true,
    role: "1",
  },
  {
    path: "",
    name: "Cài đặt",
    icon: "Setting",
    role: "1",
    isSidebar: true,
    isPrivate: true,
    children: [
      {
        path: "/position",
        name: "Chức vụ",
        icon: "",
        role: "1",
        isSidebar: true,
      },
      {
        path: "/work-type",
        name: "Loại hình làm việc",
        icon: "",
        isPrivate: true,
        role: "1",
        isSidebar: true,
      },
    ],
  },
];

export default routes;
