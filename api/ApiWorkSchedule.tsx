import store from "@app/redux/store";
import {IWorkingDaySchedule, IWorkSchedule} from "@app/types";
import axios from "axios";
import {fetcher, fetcherWithMetadata, IMetadata} from "./Fetcher";

const path = {
  getWorkSchedule: "work-schedule/user",
  createWorkSchedule: "work-schedule/",
  getAllWorkSchedule: "work-schedule",
  exportListAccount: "work-schedule/export",
};

interface IWorkingDayScheduleUpdate {
  id?: number;
  workingDay?: IWorkingDaySchedule[];
}

interface IWorkingDayScheduleUpdateState {
  id: number;
  state: number;
}

interface IParams {
  sort?: string[];
  searchFields?: string[];
  pageSize?: number;
  pageNumber?: number;
  disablePagination?: boolean;
  search?: string;
  searchType?: string;
  filter?: object;
}

function getWorkSchedule(): Promise<IWorkSchedule> {
  return fetcher({url: path.getWorkSchedule, method: "get"});
}

function createWorkSchedule(
  body: IWorkingDaySchedule[]
): Promise<IWorkSchedule> {
  return fetcher({
    url: path.createWorkSchedule,
    method: "post",
    data: {workingDay: body},
  });
}

function updateWorkSchedule(
  body: IWorkingDayScheduleUpdate
): Promise<IWorkSchedule> {
  return fetcher({
    url: path.createWorkSchedule + body.id,
    method: "put",
    data: {workingDay: body.workingDay},
  });
}

function updateStateWorkSchedule(
  body: IWorkingDayScheduleUpdateState
): Promise<IWorkSchedule> {
  return fetcher({
    url: path.createWorkSchedule + body.id + "/state",
    method: "put",
    data: {state: body.state},
  });
}

function getAllWorkSchedule(
  params?: IParams
): Promise<{data: IWorkSchedule[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getAllWorkSchedule,
    method: "get",
    params: params,
  });
}

function getAuthToken(): string | undefined {
  const {user} = store.getState();
  return user?.accessToken;
}

function exportWorkSchedule(params: IParams) {
  const accessToken = getAuthToken();
  return axios({
    url: "http://13.215.91.199:8000/api/v1/" + path.exportListAccount,
    params: params,
    method: "get",
    responseType: "blob",
    headers: {
      authorization: "Bearer " + accessToken,
    },
  });
}

export default {
  getWorkSchedule,
  createWorkSchedule,
  updateWorkSchedule,
  getAllWorkSchedule,
  updateStateWorkSchedule,
  exportWorkSchedule,
};
