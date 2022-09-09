import {fetcher} from "./Fetcher";
import {
  IDataBonus,
  IDataCost,
  IDataDeductionDay,
  IDataOnsite,
  IDataOverTime,
  IDataProject,
  IDataProjectList,
  IDataSalary,
} from "@app/types";

const path = {
  getMyListTotalSalary: "/total-salary/me",
  getListTotalSalary: "/total-salary/total-cost",
  getMyListOnsiteSalary: "/onsite-salary/me",
  getListOnsiteSalary: "/onsite-salary",
  deleteOnsiteSalary: "/onsite-salary/",
  getMyListOTSalary: "/overtime-salary/me",
  getListOTSalary: "/overtime-salary",
  deleteOTSalary: "/overtime-salary/",
  getMyProjectSalary: "/project-salary/me",
  getMyBonusSalary: "/bonus-salary/me",
  getMyDeductionDaySalary: "/deduction-day-off",
  getMyDeductionHourSalary: "/deduction-hour-late",
  getListProject: "/project",
  createOTSalary: "/overtime-salary",
  createOnsiteSalary: "/onsite-salary",
};

interface IBodyOTSalary {
  user: number | string;
  project: number;
  hour: number;
  date: string;
}

interface IBodyOnsiteSalary {
  user: number | string;
  onsitePlace: string;
  date: string;
}

function getMyListTotalSalary(year: number): Promise<IDataSalary[]> {
  return fetcher({
    url: path.getMyListTotalSalary,
    method: "get",
    params: {filter: {date_year: year}},
  });
}

function getListTotalSalary(year: number): Promise<IDataCost> {
  return fetcher({
    url: path.getListTotalSalary,
    method: "post",
    data: {year},
  });
}

function createOnsiteSalary(data: IBodyOnsiteSalary[]): Promise<IDataOnsite[]> {
  return fetcher({
    url: path.createOnsiteSalary,
    method: "post",
    data,
  });
}

function getMyListOnsiteSalary(
  year: number,
  month: number,
  userId?: number
): Promise<IDataOnsite[]> {
  return fetcher({
    url: userId ? path.getListOnsiteSalary : path.getMyListOnsiteSalary,
    method: "get",
    params: {filter: {date_month: month, date_year: year, userId}},
  });
}

function deleteOnsiteSalary(id: number): Promise<any> {
  return fetcher({
    url: path.deleteOnsiteSalary + id,
    method: "delete",
  });
}

function createOTSalary(data: IBodyOTSalary[]): Promise<IDataOnsite[]> {
  return fetcher({
    url: path.createOTSalary,
    method: "post",
    data,
  });
}

function getMyListOTSalary(
  year: number,
  month: number,
  userId?: number
): Promise<IDataOverTime[]> {
  return fetcher({
    url: userId ? path.getListOTSalary : path.getMyListOTSalary,
    method: "get",
    params: {filter: {date_month: month, date_year: year, userId}},
  });
}

function deleteOTSalary(id: number): Promise<any> {
  return fetcher({
    url: path.deleteOTSalary + id,
    method: "delete",
  });
}

function getMyProjectSalary(
  year: number,
  month: number
): Promise<IDataProject[]> {
  return fetcher({
    url: path.getMyProjectSalary,
    method: "get",
    params: {filter: {date_month: month, date_year: year}},
  });
}

function getMyBonusSalary(year: number, month: number): Promise<IDataBonus[]> {
  return fetcher({
    url: path.getMyBonusSalary,
    method: "get",
    params: {filter: {date_month: month, date_year: year}},
  });
}

function getMyDeductionDaySalary(
  year: number,
  month: number
): Promise<IDataDeductionDay[]> {
  return fetcher({
    url: path.getMyDeductionDaySalary,
    method: "get",
    params: {filter: {date_month: month, date_year: year}},
  });
}

function getMyDeductionHourSalary(
  year: number,
  month: number
): Promise<IDataDeductionDay[]> {
  return fetcher({
    url: path.getMyDeductionHourSalary,
    method: "get",
    params: {filter: {date_month: month, date_year: year}},
  });
}

function getListProject(
  name?: string,
  projectId?: number,
  userId?: number
): Promise<IDataProjectList[]> {
  return fetcher({
    url: path.getListProject,
    method: "get",
    params: {filter: {name, projectId: projectId, userId: userId}},
  });
}

function getListProjectOfMe(id?: number): Promise<IDataProjectList[]> {
  return fetcher({
    url: `/project/${id}/project-participate`,
    method: "get",
    params: {id},
  });
}

export default {
  createOnsiteSalary,
  getListProjectOfMe,
  createOTSalary,
  getListTotalSalary,
  getListProject,
  getMyDeductionDaySalary,
  getMyDeductionHourSalary,
  getMyBonusSalary,
  getMyProjectSalary,
  deleteOTSalary,
  getMyListOTSalary,
  deleteOnsiteSalary,
  getMyListOnsiteSalary,
  getMyListTotalSalary,
};
