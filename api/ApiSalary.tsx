import {fetcher} from "./Fetcher";

const path = {
  getListTotalSalary: "/total-salary/me",
};

function getMyListTotalSalary(year: number): Promise<any> {
  return fetcher({
    url: path.getListTotalSalary,
    method: "get",
    params: {filter: {date_year: year}},
  });
}

export default {
  getMyListTotalSalary,
};
