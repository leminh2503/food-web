import {fetcher, fetcherWithMetadata, IMetadata} from "./Fetcher";
import store from "../redux/store";
import {
  IPermission,
  EnglishCertificate,
  IAccountInfo,
  IFamilyCircumstance,
  IUserLogin,
  IWorkType,
} from "../types";
import axios from "axios";
import Config from "@app/config";

export interface ILoginBody {
  username: string;
  password: string;
}
type UserGender = "Other" | "Male" | "Female";

export interface IRegisterAccountBody {
  password?: string;
  gender?: UserGender;
  englishCertificate?: EnglishCertificate;
  englishScore?: string;
  workRoom?: string;
  personId?: string;
  dateOfBirth?: string;
  position: number | null;
  workType: number | null;
  address?: string;
  phoneNumber?: string;
  phoneNumberRelative?: string;
  baseSalary: number;
  manageSalary: number;
  manager?: number;
  email: string;
  employeeCode: string;
  fullName: string;
  deductionOwn?: number;
  role: number;
}

export interface IProfileBody {
  id?: number;
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
  personId?: string;
  address?: string;
  phoneNumber?: string;
  phoneNumberRelative?: string;
  gender?: string;
}

export interface IInformationAccountBody {
  id?: number;
  gender?: string;
  englishCertificate?: string;
  englishScore?: string;
  workRoom?: string;
  personId?: string;
  dateOfBirth?: string;
  position?: number;
  workType?: number;
  address?: string;
  phoneNumber?: string;
  phoneNumberRelative?: string;
  baseSalary?: number;
  manageSalary?: number;
  manager?: number;
  deductionOwn?: number;
  state?: number;
  email?: string;
  employeeCode?: string;
  fullName?: string;
  role?: number;
}

export interface IResetPasswordBody {
  id?: number;
  newPassword?: string;
}

export interface IUploadAvatarBody {
  file: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  role?: {
    id: number;
    roleName: string;
    permissions: IPermission[];
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
  filter?: {
    state?: number | string;
    position?: number | string;
    workType?: number | string;
  };
}

export interface IForgotPassword {
  email: string;
}

export interface ISetPassword {
  email: string;
  otp: string;
  newPassword: string;
  confirmPass: string;
}

const path = {
  login: "/auth/login",
  forgotpassword: "/auth/forgot-password",
  setpassword: "/auth/set-password",
  getMe: "/users/me",
  getUserAccount: "/users",
  uploadAvatar: "/users/set-avatar",
  workType: "/work-type",
  position: "/position",
  updateInformationAccount: "/users",
  resetPasswordForAccount: "/users/set-password",
  addNewEmployee: "/auth/register",
  familyCircumstance: "/family-circumstances",
  exportListAccount: "/users/export-list-user",
};

function getUserAccount(
  params?: IParamsGetUser
): Promise<{data: IUserLogin[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getUserAccount,
    method: "get",
    params: params,
  });
}

function getUserInfo(params: {id: number}): Promise<IUserLogin> {
  return fetcher({
    url: path.getUserAccount + "/" + params.id,
    method: "get",
    params: params,
  });
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

function updateInformationAccount(
  data: IInformationAccountBody
): Promise<IUserLogin> {
  const {id} = data;
  delete data.id;
  return fetcher({
    url: path.updateInformationAccount + `/${id}`,
    method: "put",
    data,
  });
}

function resetPasswordForAccount(
  data: IResetPasswordBody
): Promise<IUserLogin> {
  const {id} = data;
  delete data.id;
  return fetcher({
    url: `/users/${id}/set-password`,
    method: "post",
    data,
  });
}

function updateAvatar(formData: any): Promise<IUserLogin> {
  return fetcher({url: path.uploadAvatar, method: "patch", data: formData});
}

function login(body: ILoginBody): Promise<IAccountInfo> {
  return fetcher(
    {url: path.login, method: "post", data: body},
    {displayError: true}
  );
}

function forgotPassword(body: IForgotPassword): Promise<IUserLogin> {
  return fetcher({url: path.forgotpassword, method: "post", data: body});
}

function setPassword(body: ISetPassword): Promise<IUserLogin> {
  return fetcher({
    url: path.setpassword,
    method: "post",
    data: {
      email: body.email,
      newPassword: body.newPassword,
      otp: body.otp,
    },
  });
}
function addNewEmployee(body: IRegisterAccountBody): Promise<IUserLogin> {
  return fetcher({url: path.addNewEmployee, method: "post", data: body});
}

function getDataFamilyOfAccount(params: {
  filter: {userId?: string};
}): Promise<IFamilyCircumstance[]> {
  return fetcher({url: path.familyCircumstance, method: "get", params: params});
}

function addNewFamilyCircumstance(
  body: IFamilyCircumstance
): Promise<IUserLogin> {
  delete body.id;
  return fetcher({
    url: path.familyCircumstance,
    method: "post",
    data: body,
  });
}

function updateFamilyCircumstance(
  data: IFamilyCircumstance
): Promise<IFamilyCircumstance> {
  const {id} = data;
  delete data.id;
  return fetcher({
    url: path.familyCircumstance + `/${id}`,
    method: "patch",
    data,
  });
}

function deleteFamilyCircumstance(id: number) {
  return fetcher({
    url: path.familyCircumstance + `/${id}`,
    method: "delete",
  });
}

function exportListAccount() {
  const baseURL = Config.NETWORK_CONFIG.API_BASE_URL;
  const accessToken = getAuthToken();
  return axios({
    url: baseURL + path.exportListAccount,
    method: "get",
    responseType: "blob",
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
}

function isLogin(): boolean {
  return !!getAuthToken();
}

export function getUserRole(): string | null {
  const role = localStorage.getItem("role");
  return role;
}

function getInfoMe(): IUserLogin | undefined {
  const {user} = store.getState();
  return user?.user;
}

function getAuthToken(): string | undefined {
  const {user} = store.getState();
  return user?.accessToken;
}

export default {
  login,
  forgotPassword,
  setPassword,
  isLogin,
  getAuthToken,
  getInfoMe,
  getUserRole,
  getMe,
  updateMe,
  getUserAccount,
  updateAvatar,
  getListWorkType,
  getListPosition,
  updateInformationAccount,
  resetPasswordForAccount,
  addNewEmployee,
  addNewFamilyCircumstance,
  updateFamilyCircumstance,
  deleteFamilyCircumstance,
  getDataFamilyOfAccount,
  exportListAccount,
  getUserInfo,
};
