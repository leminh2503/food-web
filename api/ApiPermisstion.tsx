import {fetcher, fetcherWithMetadata, IMetadata} from "@app/api/Fetcher";

const path = {
  getAllPermission: "/permission",
  getAllRole: "/roles",
  role: "/roles",
  getAllPermissionModify: "/permission/group",
};

export interface IPermission {
  id: number;
  permissionName: string;
  permissionKey: string;
}

export interface IPermissionModify {
  permissionGroup: string;
  permissions: IPermission[];
}

export interface IRole {
  id: number;
  roleName: string;
  permissions: IPermission[];
}

export interface IParamsGetAllRole {
  pageSize: number;
  pageNumber: number;
  searchFields: string[];
  search: string;
}

export interface IAddRoleGroupBody {
  id?: number;
  roleName: string;
  permissions: number[];
}

function getAllPermission(): Promise<{data: IPermission[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getAllPermission,
    method: "get",
  });
}

function getAllPermissionModify(): Promise<IPermissionModify[]> {
  return fetcher({
    url: path.getAllPermissionModify,
    method: "get",
  });
}

function getAllRole(
  params: IParamsGetAllRole
): Promise<{data: IRole[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getAllRole,
    method: "get",
    params: params,
  });
}

function deleteRoleGroup(id: number) {
  return fetcher({
    url: path.role + `/${id}`,
    method: "delete",
  });
}

function addNewRoleGroup(body: IAddRoleGroupBody): Promise<IRole> {
  delete body.id;
  return fetcher({
    url: path.role,
    method: "post",
    data: body,
  });
}

function updateRoleGroup(body: IAddRoleGroupBody): Promise<IRole> {
  const {id} = body;
  delete body.id;
  return fetcher({
    url: path.role + `/${id}`,
    method: "put",
    data: body,
  });
}

export default {
  getAllPermission,
  getAllRole,
  deleteRoleGroup,
  getAllPermissionModify,
  addNewRoleGroup,
  updateRoleGroup,
};
