import {fetcher, fetcherWithMetadata, IMetadata} from "./Fetcher";
import {ILeaveWork, IProfile} from "../types";

export interface ILeaveWorkBody {
  startDate: string;
  quantity: number;
  reason: string;
}

export interface IRefuseLeaveWorkBody {
  id: number;
  refuseReason: string;
}

export interface ILeaveWorkResponse {
  id: number;
  userId: number;
  startDate?: string;
  reason: string;
  reasonRefuse?: string;
  quantity: number;
  state?: number;
}

export interface IDaysAllowedLeave {
  id: number;
  quantity: number;
  user: IProfile;
}

export interface IParamsGetLeaveWork {
  pageSize?: number;
  pageNumber?: number;
  filter?: {
    state_IN: number[];
    startDate_MONTH: number;
    startDate_YEAR: number;
  };
  sort?: string[];
}

const path = {
  getLeaveWork: "letter-leave",
};

function getLeaveWork(
  params?: IParamsGetLeaveWork
): Promise<{data: ILeaveWork[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getLeaveWork,
    method: "get",
    params: params,
  });
}

function getLeaveWorkMe(
  params?: IParamsGetLeaveWork
): Promise<{data: ILeaveWork[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getLeaveWork + "/me",
    method: "get",
    params: params,
  });
}

function getDaysAllowedLeave(): Promise<IDaysAllowedLeave> {
  return fetcher({
    url: path.getLeaveWork + "/days-allowed-leave",
    method: "get",
  });
}

function getDaysAllowedLeaveById(id: number): Promise<IDaysAllowedLeave> {
  return fetcher({
    url: path.getLeaveWork + "/days-allowed-leave/" + id,
    method: "get",
  });
}

function createLeaveWork(body: ILeaveWorkBody): Promise<ILeaveWorkResponse> {
  return fetcher({url: path.getLeaveWork, method: "post", data: body});
}

function deleteLeaveWork(id: number): Promise<ILeaveWork[]> {
  return fetcher({url: path.getLeaveWork + "/" + id, method: "delete"});
}

function refuseLeaveWork(
  body: IRefuseLeaveWorkBody
): Promise<ILeaveWorkResponse> {
  return fetcher({
    url: path.getLeaveWork + "/" + body.id + "/refuse",
    method: "put",
    data: {reasonRefuse: body.refuseReason},
  });
}

function approvalLeaveWork(id: number): Promise<ILeaveWork[]> {
  return fetcher({
    url: path.getLeaveWork + "/" + id + "/approval",
    method: "put",
  });
}

export default {
  getLeaveWork,
  getLeaveWorkMe,
  getDaysAllowedLeave,
  getDaysAllowedLeaveById,
  createLeaveWork,
  deleteLeaveWork,
  refuseLeaveWork,
  approvalLeaveWork,
};
