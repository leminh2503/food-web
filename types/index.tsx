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

export interface IWorkType {
  id: 1;
  name: string;
  description: string;
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

export interface IProfile {
  _id?: string;
  username?: string;
  email?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  phone?: string;
  location?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  avatar?: string;
  newEmail?: string;
}

export interface IUserLogin {
  id?: string;
  fullName?: string;
  state?: IState;
  email?: string;
  dateOfBirth?: string;
  position?: IWorkType;
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
  manager?: IProfile;
  workType?: IWorkType;
  positionId: number;
  workTypeId: number;
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

export interface ISetStateModal {
  startDate?: string;
  endDate?: string;
  quantity?: number;
  reason?: string;
  refuseReason?: string;
  title?: string;
  content?: string;
}
