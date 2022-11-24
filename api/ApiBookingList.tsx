import {fetcher} from "./Fetcher";
import {IGetBookingList} from "@app/types";

const path = {
  getMyBookingList: "/booking",
};
// export interface IParamsGetBookingList {
//   sort?: string[];
//   searchFields?: string[];
//   pageSize?: number;
//   pageNumber?: number;
//   disablePagination?: boolean;
//   search?: string;
//   searchType?: string;
//   filter?: {
//     bookDate: string;
//     session?: number;
//   };
// }

function getMyBookingList(): Promise<{
  data: IGetBookingList[];
  // meta: IMetadata;
}> {
  const today = new Date();
  let getDate = today.getDate().toString();
  let getMonth = (today.getMonth() + 1).toString();
  if (getDate.length === 1) getDate = "0" + getDate;
  if (getMonth.length === 1) getMonth = "0" + getMonth;
  const dateNow = today.getFullYear() + "-" + getMonth + "-" + getDate;
  return fetcher({
    url: path.getMyBookingList,
    method: "get",
    params: {filter: {bookDate: dateNow, session: 1}},
  });
}
export default {
  getMyBookingList,
};
