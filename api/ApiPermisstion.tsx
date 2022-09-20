import {fetcher, fetcherWithMetadata, IMetadata} from "@app/api/Fetcher";

const path = {
  getAllPermission: "/permission",
  getAllRole: "/roles",
  role: "/roles",
};

export interface IPermission {
  id: number;
  permissionName: string;
  permissionKey: string;
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

function getAllPermission(): Promise<{data: IPermission[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getAllPermission,
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

export default {
  getAllPermission,
  getAllRole,
  deleteRoleGroup,
};
