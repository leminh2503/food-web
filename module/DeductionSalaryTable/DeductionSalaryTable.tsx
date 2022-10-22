import "../my-salary-detail/index.scss";
import React, {useEffect, useState} from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {ELeaveWork, IDataDeductionDay, ILeaveWork} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {CloseCircleOutlined, EditFilled} from "@ant-design/icons";
import ModalDeductionSalary from "@app/module/DeductionSalaryTable/ModalDeductionSalary";
import ModalDeductionHourSalary from "@app/module/DeductionSalaryTable/ModalDeductionHourSalary";
import {IMetadata} from "@app/api/Fetcher";
import ApiLeaveWork from "@app/api/ApiLeaveWork";
import {queryKeys} from "@app/utils/constants/react-query";
import moment from "moment";

export default function DeductionSalaryTable({
  month,
  year,
  isAdmin,
  userId,
  baseSalary,
  setDeductionSalary,
  state,
  daysAllowedLeaveById,
}: {
  setDeductionSalary?: (val: number) => void;
  baseSalary: number;
  userId?: number;
  isAdmin?: boolean;
  month: number;
  year: number;
  state?: number;
  daysAllowedLeaveById: number;
}): JSX.Element {
  const [isModalVisibleDay, setIsModalVisibleDay] = useState(false);
  const [isModalVisibleHour, setIsModalVisibleHour] = useState(false);
  const [remainDayOff, setRemainDayOff] = useState<number>();

  const showModalDay = (): void => {
    setIsModalVisibleDay(true);
  };

  const handleOkDay = (): void => {
    setIsModalVisibleDay(false);
  };

  const handleCancelDay = (): void => {
    setIsModalVisibleDay(false);
  };

  const showModalHour = (): void => {
    setIsModalVisibleHour(true);
  };

  const handleOkHour = (): void => {
    setIsModalVisibleHour(false);
  };

  const handleCancelHour = (): void => {
    setIsModalVisibleHour(false);
  };

  const getDeductionSalary = (): Promise<IDataDeductionDay[]> => {
    return ApiSalary.getMyDeductionDaySalary(year, month, userId);
  };

  const {
    data: dataDeduction,
    refetch: dayRefetch,
    isRefetching: isRefetchingD,
  } = useQuery("deductionDaySalary" + userId, getDeductionSalary) || [];

  const getDeductionHourSalary = (): Promise<IDataDeductionDay[]> => {
    return ApiSalary.getMyDeductionHourSalary(year, month, userId);
  };

  const {
    data: dataDeductionHour,
    refetch: hourRefetch,
    isRefetching: isRefetchingH,
  } = useQuery("deductionHourSalary" + userId, getDeductionHourSalary) || [];

  const getLeaveWork = (): Promise<{data: ILeaveWork[]; meta: IMetadata}> => {
    return ApiLeaveWork.getLeaveWork();
  };

  const {data: dataLeaveWork} = useQuery(
    queryKeys.GET_LIST_LEAVE_WORK,
    getLeaveWork
  );

  const dataLeaveWorkByUser = dataLeaveWork?.data.filter(
    (item: ILeaveWork) =>
      Number(item.user?.id) === Number(userId) &&
      item.state === ELeaveWork.DA_CHAP_NHAN &&
      moment(item.startDate).month() + 1 === Number(month)
  );

  const columns: ColumnsType<IDataDeductionDay> = isAdmin
    ? [
        {
          title: "Ngày bắt đầu nghỉ",
          dataIndex: "date",
          key: "date",
          align: "center",
          render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
          title: "Số ngày nghỉ",
          dataIndex: "dayOffWork",
          key: "dayOffWork",
          align: "center",
        },
        {
          title: state !== 3 && (
            <EditFilled
              onClick={showModalDay}
              className="text-[20px] text-[#0092ff] mr-3"
            />
          ),
          align: "center",
          width: "100px",
          render: (_, record) => {
            return (
              record.type === "leaveWorkAdded" && (
                <CloseCircleOutlined
                  onClick={(): void => {
                    ApiSalary.deleteDeductionDaySalary(record?.id || 0).then(
                      (r) => dayRefetch()
                    );
                  }}
                  className="text-[red] text-[20px] hover-pointer"
                />
              )
            );
          },
        },
      ]
    : [
        {
          title: "Ngày bắt đầu nghỉ",
          dataIndex: "date",
          key: "date",
          align: "center",
          render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
          title: "Số ngày nghỉ",
          dataIndex: "dayOffWork",
          key: "dayOffWork",
          align: "center",
        },
      ];

  const columns2: ColumnsType<IDataDeductionDay> = isAdmin
    ? [
        {
          title: "Ngày",
          dataIndex: "date",
          key: "date",
          align: "center",
          render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
          title: "Số giờ đi muộn",
          dataIndex: "hourLateWork",
          key: "hourLateWork",
          align: "center",
        },
        {
          title: state !== 3 && (
            <EditFilled
              onClick={showModalHour}
              className="text-[20px] text-[#0092ff] mr-3"
            />
          ),
          width: "100px",
          align: "center",
          render: (index, _record): JSX.Element => {
            return (
              <CloseCircleOutlined
                onClick={(): void => {
                  ApiSalary.deleteDeductionHourSalary(_record?.id || 0).then(
                    (r) => hourRefetch()
                  );
                }}
                className="text-[red] text-[20px] hover-pointer"
              />
            );
          },
        },
      ]
    : [
        {
          title: "Ngày",
          dataIndex: "date",
          key: "date",
          align: "center",
          render: (date) => moment(date).format("DD/MM/YYYY"),
        },
        {
          title: "Số giờ đi muộn",
          dataIndex: "hourLateWork",
          key: "hourLateWork",
          align: "center",
        },
      ];

  const data = () => {
    const leaveWorkAccepted: IDataDeductionDay[] =
      dataLeaveWorkByUser?.map((item) => {
        return {
          id: undefined,
          date: item?.startDate,
          dayOffWork: item?.quantity,
          type: "leaveWorkAccepted",
        };
      }) || [];

    const leaveWorkAdded: IDataDeductionDay[] =
      dataDeduction?.map((item) => {
        return {
          id: item.id,
          date: item?.date,
          dayOffWork: item?.dayOffWork,
          type: "leaveWorkAdded",
        };
      }) || [];

    return [...leaveWorkAccepted, ...leaveWorkAdded];
  };

  const data2: IDataDeductionDay[] =
    dataDeductionHour?.map((el) => {
      return {
        id: el.id,
        date: el?.date,
        hourLateWork: el?.hourLateWork,
        deductionSalaryHour: Math.round(
          (Number(el?.hourLateWork || 0) * baseSalary) / 24 / 8
        ),
      };
    }) || [];

  const acountLeaveWorkDay = data()?.reduce(
    (accumulator, element) =>
      accumulator +
      (element.type === "leaveWorkAdded" ? element?.dayOffWork ?? 0 : 0),
    0
  );

  const totalSalaryDay = Math.floor(
    (Math.abs(remainDayOff ?? 0) * baseSalary) / 24
  );

  const totalSalaryHour =
    data2?.reduce(function (accumulator, element) {
      return accumulator + (Number(element?.deductionSalaryHour) || 0);
    }, 0) || 0;

  useEffect(() => {
    const totalSalary2 = totalSalaryDay + totalSalaryHour;
    if (setDeductionSalary) {
      setDeductionSalary(totalSalary2);
    }
  }, [isRefetchingH, totalSalaryDay, totalSalaryHour]);

  useEffect(() => {
    setRemainDayOff((daysAllowedLeaveById ?? 0) - acountLeaveWorkDay);
  }, [isRefetchingD, acountLeaveWorkDay]);

  return (
    <Card className="w-full">
      {isAdmin && (
        <ModalDeductionSalary
          handleRefetch={dayRefetch}
          isModalVisible={isModalVisibleDay}
          handleOk={handleOkDay}
          handleCancel={handleCancelDay}
          userId={Number(userId)}
        />
      )}
      <ModalDeductionHourSalary
        handleRefetch={hourRefetch}
        isModalVisible={isModalVisibleHour}
        handleOk={handleOkHour}
        handleCancel={handleCancelHour}
        userId={Number(userId)}
      />
      <div className="mb-4 font-bold">
        Lương khấu trừ :{" "}
        {(totalSalaryHour + totalSalaryDay)?.toLocaleString("en-US")} VND
      </div>
      <div className="flex">
        <Card className="w-full">
          <Table
            className="w-full"
            columns={columns}
            dataSource={data() ?? []}
            bordered
            pagination={false}
          />
          <p className="font-bold mt-2">
            Số ngày nghỉ còn lại: {remainDayOff} ngày
          </p>
          <p className="font-bold mt-2">
            Tiền trừ: {totalSalaryDay.toLocaleString("en-US")} VND
          </p>
        </Card>
        <Card className="w-full">
          <Table
            className="w-full"
            columns={columns2}
            dataSource={data2 || []}
            bordered
            pagination={false}
          />
          <p className="font-bold mt-2">
            Tiền trừ: {totalSalaryHour.toLocaleString("en-US")} VND
          </p>
        </Card>
      </div>
    </Card>
  );
}
