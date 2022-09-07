import React from "react";

export interface CommonReduxAction {
  type: string;
}

export interface CommonReactProps {
  children: React.ReactNode;
}

export interface ISettingId {
  _id?: string;
  themes?: string;
  location?: string;
  region?: string;
  language?: string;
  referCode?: string;
}

export enum IAccountRole {
  USER = 0,
  ADMIN = 1,
  ANONYMOUS = 2,
}

export enum IState {
  INACTIVE,
  ACTIVE,
  DELETED,
}

export interface IUserLogin {
  id?: string;
  fullName?: string;
  state?: IState;
  email?: string;
  dateOfBirth?: string;
  positionId?: number;
  avatar?: string;
  personId?: number;
  address?: string;
  phoneNumber?: string;
  role?: {
    id?: IAccountRole;
    roleName?: string;
  };
  phoneNumberRelative?: string;
  baseSalary?: number;
  manageSalary?: number;
  gender?: string;
}

export interface IProfile {
  id?: string;
  avatar?: string;
  fullName?: string;
  email?: string;
  employeeCode?: string;
  personId?: string;
  dateOfBirth?: string;
  address?: string;
  phoneNumber?: string;
  phoneNumberRelative?: string;
  baseSalary?: number;
  manageSalary?: number;
  deductionOwn?: number;
  workRoom?: string;
  state?: number;
  gender?: string;
  englishCertificate?: string;
  englishScore?: number;
}

export interface IAccountInfo {
  user?: IUserLogin;
  accessToken?: string;
  refreshToken?: string;
  isConfirmed?: boolean;
  dataProfile?: IProfile;
  role?: {
    id?: number;
    roleName?: string;
  };
}

export interface ILeaveWork {
  id?: number;
  user?: {
    id: number;
    email: string;
    fullName: string;
  };
  startDate?: Date;
  reason?: string;
  reasonRefuse?: string;
  quantity?: number;
  state?: number;
}

export interface IEvent {
  id?: number;
  title?: string;
  content?: string;
  startDate?: string;
  endDate?: string;
}

export interface IPosition {
  id?: number;
  name?: string;
  description?: string;
}

export interface IWorkType {
  id?: number;
  name?: string;
  description?: string;
}

export interface ISetStateModal {
  startDate?: string;
  endDate?: string;
  quantity?: number;
  reason?: string;
  refuseReason?: string;
  title?: string;
  content?: string;
  name?: string;
  description?: string;
}
