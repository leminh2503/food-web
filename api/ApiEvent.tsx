import {fetcher, fetcherWithMetadata, IMetadata} from "./Fetcher";
import {IEvent} from "../types";

export interface IEventBody {
  startDate?: string;
  endDate?: string;
  title?: string;
  content?: string;
}

export interface IParamsGetEvent {
  pageSize?: number;
  pageNumber?: number;
  sort?: string[];
}

const path = {
  getEvent: "event",
};

function getEvent(
  params?: IParamsGetEvent
): Promise<{data: IEvent[]; meta: IMetadata}> {
  return fetcherWithMetadata({
    url: path.getEvent,
    method: "get",
    params: params,
  });
}

function createEvent(body?: IEventBody): Promise<IEvent> {
  return fetcher({url: path.getEvent, method: "post", data: body});
}

function deleteEvent(id: number): Promise<IEvent> {
  return fetcher({url: path.getEvent + "/" + id, method: "delete"});
}

export default {
  getEvent,
  createEvent,
  deleteEvent,
};
