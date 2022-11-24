import "./index.scss";
import {Button, Row} from "antd";
import {useEffect, useState} from "react";

interface HeaderBookingProps {
  numberOfOrders: number;
  totalPrice: number;
  handleOnOrderNow: () => void;
  handleRefresh: () => void;
}
export function HeaderBooking({
  numberOfOrders,
  totalPrice,
  handleOnOrderNow,
  handleRefresh,
}: HeaderBookingProps): JSX.Element {
  const date = new Date();
  const [dateNow, setDateNow] = useState<string>("");
  useEffect(() => {
    setInterval(() => {
      const now = new Date();
      const newTimeString = now.toLocaleString();
      setDateNow(newTimeString);
    }, 1000);
  }, [date]);
  return (
    <Row className="headerBooking">
      <div className="headerBooking-numberOrder">
        Number of orders : {numberOfOrders}
      </div>
      <div className="headerBooking-total">Total Price : {totalPrice}</div>
      <div className="headerBooking-time">{dateNow}</div>
      <Button
        className="button mr-3"
        type="primary"
        htmlType="submit"
        onClick={handleOnOrderNow}
      >
        Order
      </Button>
      <Button
        className="button"
        type="primary"
        htmlType="submit"
        onClick={handleRefresh}
      >
        Refresh
      </Button>
    </Row>
  );
}
