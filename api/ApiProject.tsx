import {fetcher, fetcherWithMetadata, IMetadata} from "./Fetcher";
import {IProject} from "../types";

export interface IProjectBody {
  name?: string;
  projectManager?: number;
  startDate?: string;
  endDate?: string;
  scale?: string;
  customer?: string;
  technicality?: string;
  use?: string;
  description?: string;
}

export interface IParamsGetProject {
  pageSize?: number;
  pageNumber?: number;
  searchFields?: string[];
  search?: string;
}

export interface IProjectWithMeta {
  data: IProject[];
  meta: IMetadata;
}

const path = {
  getProject: "Project",
};

function getProject(params?: IParamsGetProject): Promise<IProjectWithMeta> {
  return fetcherWithMetadata({
    url: path.getProject,
    method: "get",
    params: params,
  });
}

function createProject(body?: IProjectBody): Promise<IProject[]> {
  return fetcher({url: path.getProject, method: "post", data: body});
}

export default {
  getProject,
  createProject,
};
