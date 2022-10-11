import {fetcher, fetcherWithMetadata, IMetadata} from "./Fetcher";
import {IWorkType} from "../types";

export interface IWorkTypeBody {
  name?: string;
  description?: string;
}

export interface IEditWorkTypeBody {
  id: number;
  name?: string;
  description?: string;
}

export interface IParamsGetWorkType {
  pageSize?: number;
  pageNumber?: number;
  sort?: string[];
}

const path = {
  getWorkType: "work-type",
};

function getWorkType(
  params?: IParamsGetWorkType
): Promise<{data: IWorkType[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getWorkType,
    method: "get",
    params: params,
  });
}

function createWorkType(body?: IWorkTypeBody): Promise<IWorkType> {
  return fetcher({url: path.getWorkType, method: "post", data: body});
}

function editWorkType(body: IEditWorkTypeBody): Promise<IWorkType> {
  return fetcher({
    url: path.getWorkType + "/" + body.id,
    method: "put",
    data: {name: body?.name, description: body?.description},
  });
}

function deleteWorkType(id: number): Promise<IWorkType> {
  return fetcher({url: path.getWorkType + "/" + id, method: "delete"});
}

export default {
  getWorkType,
  createWorkType,
  editWorkType,
  deleteWorkType,
};
