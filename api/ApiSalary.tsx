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
  IDataSalaryToTalOfUser,
} from "@app/types";

const path = {
  getListSalaryTotalUser: "/total-salary",
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
  createTotalSalary: "/total-salary",
  getUserOfProject: "/salary",
  updateOnsiteSalary: "/onsite-salary/update-salaries",
  updateOTSalary: "/overtime-salary/update-salaries",
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

function getListSalaryTotalUser(
  year: number,
  month: number
): Promise<IDataSalaryToTalOfUser[]> {
  return fetcher({
    url: path.getListSalaryTotalUser,
    method: "get",
    params: {filter: {date_month: month, date_year: year}},
  });
}

function getMyListTotalSalary(year: number): Promise<IDataSalary[]> {
  return fetcher({
    url: path.getMyListTotalSalary,
    method: "get",
    params: {filter: {date_year: year}},
  });
}

function createTotalSalary(id: number, date: string): Promise<IDataSalary[]> {
  return fetcher({
    url: path.createTotalSalary,
    method: "post",
    data: {user: id, date},
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

function updateOnsiteSalary(data: IDataOnsite[]): Promise<any> {
  return fetcher({
    url: path.updateOnsiteSalary,
    method: "post",
    data,
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

function updateOTSalary(data: IDataOverTime[]): Promise<any> {
  return fetcher({
    url: path.updateOTSalary,
    method: "post",
    data,
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

function createSalaryProject(data: {
  user: number;
  project: number;
  salary: number;
  date: string;
}): Promise<any> {
  return fetcher({
    url: path.updateOTSalary,
    method: "post",
    data,
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

function getUserOfProject(projectId: number, month: number, year: number) {
  return fetcher({
    url: path.getUserOfProject,
    method: "get",
    params: {projectId, month, year},
  });
}

export default {
  createTotalSalary,
  createSalaryProject,
  getUserOfProject,
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
  updateOnsiteSalary,
  updateOTSalary,
  getListSalaryTotalUser,
};
