import {fetcher} from "./Fetcher";
import {
  IDataBonus,
  IDataDeductionDay,
  IDataOnsite,
  IDataOverTime,
  IDataProject,
  IDataSalary,
} from "@app/types";

const path = {
  getListTotalSalary: "/total-salary/me",
  getMyListOnsiteSalary: "/onsite-salary/me",
  deleteOnsiteSalary: "/onsite-salary/",
  getMyListOTSalary: "/overtime-salary/me",
  deleteOTSalary: "/overtime-salary/",
  getMyProjectSalary: "/project-salary/me",
  getMyBonusSalary: "/bonus-salary/me",
  getMyDeductionDaySalary: "/deduction-day-off",
  getMyDeductionHourSalary: "/deduction-hour-late",
};

function getMyListTotalSalary(year: number): Promise<IDataSalary[]> {
  return fetcher({
    url: path.getListTotalSalary,
    method: "get",
    params: {filter: {date_year: year}},
  });
}

function getMyListOnsiteSalary(
  year: number,
  month: number
): Promise<IDataOnsite[]> {
  return fetcher({
    url: path.getMyListOnsiteSalary,
    method: "get",
    params: {filter: {date_month: month, date_year: year}},
  });
}

function deleteOnsiteSalary(id: number): Promise<any> {
  return fetcher({
    url: path.deleteOnsiteSalary + id,
    method: "delete",
  });
}

function getMyListOTSalary(
  year: number,
  month: number
): Promise<IDataOverTime[]> {
  return fetcher({
    url: path.getMyListOTSalary,
    method: "get",
    params: {filter: {date_month: month, date_year: year}},
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

export default {
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
