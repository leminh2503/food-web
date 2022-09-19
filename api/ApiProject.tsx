import {fetcher, fetcherWithMetadata, IMetadata} from "./Fetcher";
import {ERolePosition, IProject, IProjectMember} from "../types";

export interface IProjectBody {
  name?: string;
  projectManager?: number;
  startDate?: string;
  endDate?: string;
  scale?: number;
  customer?: string;
  technicality?: string;
  use?: string;
  description?: string;
}

export interface IEditProjectBody {
  id: number;
  name?: string;
  projectManager?: number;
  endDate?: string;
  scale?: number;
  customer?: string;
  technicality?: string;
  use?: string;
  description?: string;
  projectProgress?: string | number;
}

export interface IProjectMemberBody {
  projectId: number;
  user?: number;
  role?: ERolePosition;
  contract?: number;
  startDate?: string;
  endDate?: string;
}

export interface IEditProjectMemberBody {
  projectId: number;
  userId: number;
  role?: ERolePosition;
  contract?: number;
  reality?: number;
  startDate?: string;
  endDate?: string;
}

export interface IDeleteProjectMemberBody {
  projectId: number;
  userIds: number[];
}

export interface IParamsGetProject {
  pageSize: number;
  pageNumber: number;
  searchProjectFields: string[];
  searchProjectManagerFields: string[];
  search: string;
  filter: {
    state_IN: number[];
  };
  sort: string[];
}

export interface IProjectWithMeta {
  data: IProject[];
  meta: IMetadata;
}

const path = {
  getProject: "project",
};

function getProject(params?: IParamsGetProject): Promise<IProjectWithMeta> {
  return fetcherWithMetadata({
    url: path.getProject,
    method: "get",
    params: params,
  });
}
function getProjectById(id: number): Promise<IProject> {
  return fetcher({
    url: path.getProject + "/" + id,
    method: "get",
  });
}

function createProject(body: IProjectBody): Promise<IProject> {
  return fetcher({url: path.getProject, method: "post", data: body});
}

function editProject(body: IEditProjectBody): Promise<IProject> {
  return fetcher({
    url: path.getProject + "/" + body.id,
    method: "put",
    data: {
      name: body.name,
      projectManager: body.projectManager,
      endDate: body.endDate,
      scale: body.scale,
      customer: body.customer,
      technicality: body.technicality,
      use: body.use,
      description: body.description,
      projectProgress: Number(body?.projectProgress || 0) ?? undefined,
    },
  });
}

function getProjectMember(id: number): Promise<IProjectMember[]> {
  return fetcher({
    url: path.getProject + "/" + id + "/member",
    method: "get",
  });
}

function createProjectMember(
  body: IProjectMemberBody
): Promise<IProjectMember> {
  return fetcher({
    url: path.getProject + "/" + body.projectId + "/member",
    method: "post",
    data: {
      user: body.user,
      role: body.role,
      contract: body.contract,
      startDate: body.startDate,
      endDate: body.endDate,
    },
  });
}

function editProjectMember(
  body: IEditProjectMemberBody
): Promise<IProjectMember> {
  return fetcher({
    url: path.getProject + "/" + body.projectId + "/member/" + body.userId,
    method: "put",
    data: {
      role: body.role,
      contract: body.contract,
      reality: body.reality,
      startDate: body.startDate,
      endDate: body.endDate,
    },
  });
}

function deleteProjectMember(
  body: IDeleteProjectMemberBody
): Promise<IProjectMember> {
  return fetcher({
    url: path.getProject + "/" + body.projectId + "/member",
    method: "delete",
    data: {
      ids: body.userIds,
    },
  });
}

export default {
  getProject,
  getProjectById,
  createProject,
  editProject,
  getProjectMember,
  createProjectMember,
  editProjectMember,
  deleteProjectMember,
};
