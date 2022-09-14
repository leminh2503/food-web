import {fetcher} from "./Fetcher";
import {IProfile} from "../types";

export interface IParamsGetBirthday {
  sort?: string[];
  pageSize?: number;
  pageNumber?: number;
  disablePagination?: boolean;
  filter?: {
    dateOfBirth_MONTH?: number;
  };
}

const path = {
  getEvent: "birthday",
};

function getBirthday(params?: IParamsGetBirthday): Promise<IProfile[]> {
  return fetcher({url: path.getEvent, method: "get", params: params});
}

export default {
  getBirthday,
};
