import {IWorkingDaySchedule, IWorkSchedule} from "@app/types";
import {fetcher} from "./Fetcher";

const path = {
  getWorkSchedule: "work-schedule/user",
  createWorkSchedule: "work-schedule/",
  getAllWorkSchedule: "work-schedule",
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

function getAllWorkSchedule(params?: IParams): Promise<IWorkSchedule[]> {
  return fetcher({url: path.getAllWorkSchedule, method: "get", params: params});
}

export default {
  getWorkSchedule,
  createWorkSchedule,
  updateWorkSchedule,
  getAllWorkSchedule,
  updateStateWorkSchedule,
};
