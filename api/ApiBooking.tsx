import {fetcher} from "./Fetcher";
import {IGetBookingList} from "@app/types";

const path = {
  getBooking: "/booking",
};
export interface ISessionOrder {
  session: number;
}
function Booking(body: ISessionOrder): Promise<IGetBookingList> {
  return fetcher(
    {url: path.getBooking, method: "post", data: body},
    {displayError: true}
  );
}
export default {
  Booking,
};
