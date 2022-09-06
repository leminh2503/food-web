import {fetcher} from "./Fetcher";
import store from "../redux/store";
import {IAccountRole, IUserLogin, IWorkType} from "../types";

export interface ILoginBody {
  email: string;
  password: string;
}

export interface IProfileBody {
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
  personId?: number;
  address?: string;
  phoneNumber?: string;
  phoneNumberRelative?: string;
  gender?: string;
}

export interface IUploadAvatarBody {
  file: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  role?: {
    id?: number;
    roleName?: string;
  };
}

export interface IParamsGetUser {
  sort?: string[];
  searchFields?: string[];
  pageSize?: number;
  pageNumber?: number;
  disablePagination?: boolean;
  search?: string;
  searchType?: string;
}

const path = {
  login: "/auth/login",
  getMe: "/users/me",
  getUserAccount: "/users",
  uploadAvatar: "/users/set-avatar",
  workType: "/work-type",
  position: "/position",
};

function getUserAccount(params?: IParamsGetUser): Promise<IUserLogin[]> {
  return fetcher({url: path.getUserAccount, method: "get", params: params});
}

function getListPosition(): Promise<IWorkType[]> {
  return fetcher({url: path.position, method: "get"});
}

function getListWorkType(): Promise<IWorkType[]> {
  return fetcher({url: path.workType, method: "get"});
}

function getMe(): Promise<IUserLogin> {
  return fetcher({url: path.getMe, method: "get"});
}

function updateMe(data: IProfileBody): Promise<IUserLogin> {
  return fetcher({url: path.getMe, method: "put", data});
}

function updateAvatar(formData: any): Promise<IUserLogin> {
  return fetcher({url: path.uploadAvatar, method: "patch", data: formData});
}

function login(body: ILoginBody): Promise<ILoginResponse> {
  return fetcher(
    {url: path.login, method: "post", data: body},
    {displayError: true}
  );
}

function isLogin(): boolean {
  return !!getAuthToken();
}

function getUserRole(): IAccountRole | undefined {
  const {user} = store.getState();
  return user?.user?.role?.id;
}

function getAuthToken(): string | undefined {
  const {user} = store.getState();
  return user?.accessToken;
}

export default {
  login,
  isLogin,
  getAuthToken,
  getUserRole,
  getMe,
  updateMe,
  getUserAccount,
  updateAvatar,
  getListWorkType,
  getListPosition,
};
