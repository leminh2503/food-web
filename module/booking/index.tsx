import "./index.scss";
import {Modal, Spin, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import React from "react";
import {IGetBookingList} from "@app/types";
import ApiBooking from "@app/api/ApiBooking";
import ApiBookingList from "@app/api/ApiBookingList";
import {queryKeys} from "@app/utils/constants/react-query";
import {DeleteOutlined} from "@ant-design/icons";
import {IRootState, persistor} from "@app/redux/store";
import {HeaderBooking} from "@app/components/HeaderBooking";
import {useQuery} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {sessionBooking} from "@app/redux/slices/BookingSlice";

export function Booking(): JSX.Element {
  const getListBooking = (): Promise<{
    data: IGetBookingList[] | undefined;
    // meta: IMetadata;
  }> => {
    return ApiBookingList.getMyBookingList();
  };
  const {data, isRefetching, refetch} =
    useQuery(queryKeys.GET_LIST_BOOKING, getListBooking, {
      refetchOnWindowFocus: false,
      enabled: true,
    }) || [];
  console.log(data);
  const handleDeleteBooking = (): void => {
    Modal.confirm({
      title: "Delete Booking",
      content: "Bạn có chắc chắn muốn xóa booking?",
    });
  };
  const columns: ColumnsType<IGetBookingList> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "UserName",
      dataIndex: "UserName",
      key: "UserName",
      align: "center",
      render: (_, record) => <div>{record.createdBy.username}</div>,
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
      align: "center",
      render: (_, record) => <div>{record.session * 25}</div>,
    },
    {
      title: "Room",
      dataIndex: "Room",
      key: "Room",
      align: "center",
      render: () => <div>{1405}</div>,
    },
    {
      title: "Food",
      dataIndex: "Food",
      key: "Food",
      align: "center",
      render: () => <div>Cơm</div>,
    },
    {
      title: "Order At",
      dataIndex: "OrderAt",
      key: "OrderAt",
      align: "center",
      render: (_, record) => (
        <div>{new Date(record.createdAt).toLocaleString()}</div>
      ),
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      align: "center",
      render: () => (
        <DeleteOutlined
          onClick={handleDeleteBooking}
          style={{color: "red", margin: "0 5px"}}
          // onClick={handleDeleteUser}
        />
      ),
    },
  ];
  const handleNumberOfOrders = (data: IGetBookingList[]): number =>
    data && data.length;
  const handleTotalPrice = (data: IGetBookingList[]): number =>
    data &&
    data.map((item) => item.session).reduce((a, b) => a + (b * 25 || 0), 0);
  const router = useRouter();
  const dispatch = useDispatch();
  const sessionBookingOrder = useSelector(
    (state: IRootState) => state.booking.session
  );
  const setSessionOrder = (): number => {
    const currentTime = new Date();
    const timeCompare = new Date();
    timeCompare.setHours(12, 0, 0);
    if (currentTime >= timeCompare) return 2;
    return 1;
  };
  console.log(setSessionOrder());
  // console.log(sessionBookingOrder);
  const handleOnOrderNow = (): void => {
    Modal.confirm({
      title: "Confirm Order",
      content: "Are you sure you want to order now?",
      onOk: () => {
        persistor
          .purge()
          .then(() => {
            dispatch(sessionBooking(setSessionOrder()));
            ApiBooking.Booking({session: sessionBookingOrder})
              .then((value) => console.log(value))
              .catch((e) => console.log(e));
          })
          .catch(() => {
            // eslint-disable-next-line no-alert
            window.alert(
              "Trình duyệt bị lỗi. Xóa Cookie trình duyệt và thử lại"
            );
          });
        router.push("/").then((r) => console.log(r));
      },
    });
  };
  const handleRefresh = (): void => {
    refetch();
  };
  return (
    <div>
      <HeaderBooking
        numberOfOrders={handleNumberOfOrders(data as never)}
        totalPrice={handleTotalPrice(data as never)}
        handleOnOrderNow={handleOnOrderNow}
        handleRefresh={handleRefresh}
      />
      {data && (
        <Table
          columns={columns}
          dataSource={data as never}
          bordered
          loading={{
            indicator: (
              <div>
                <Spin />
              </div>
            ),
            spinning: isRefetching,
          }}
          className="hover-pointer mt-4"
        />
      )}
    </div>
  );
}
