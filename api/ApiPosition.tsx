import {fetcher, fetcherWithMetadata, IMetadata} from "./Fetcher";
import {IPosition} from "../types";

export interface IPositionBody {
  name?: string;
  description?: string;
}

export interface IEditPositionBody {
  id: number;
  name?: string;
  description?: string;
}

export interface IParamsGetPosition {
  pageSize?: number;
  pageNumber?: number;
  sort?: string[];
}

const path = {
  getPosition: "position",
};

function getPosition(
  params?: IParamsGetPosition
): Promise<{data: IPosition[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getPosition,
    method: "get",
    params: params,
  });
}

function createPosition(body?: IPositionBody): Promise<IPosition> {
  return fetcher({url: path.getPosition, method: "post", data: body});
}

function editPosition(body: IPosition): Promise<IPosition> {
  return fetcher({
    url: path.getPosition + "/" + body.id,
    method: "put",
    data: {name: body?.name, description: body?.description},
  });
}

function deletePosition(id: number): Promise<IPosition> {
  return fetcher({url: path.getPosition + "/" + id, method: "delete"});
}

export default {
  getPosition,
  createPosition,
  editPosition,
  deletePosition,
};
