import "../my-salary-detail/index.scss";
import React, {useEffect, useState} from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {IDataDeductionDay} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {CloseCircleOutlined, EditFilled} from "@ant-design/icons";
import ModalDeductionSalary from "@app/module/DeductionSalaryTable/ModalDeductionSalary";
import ModalDeductionHourSalary from "@app/module/DeductionSalaryTable/ModalDeductionHourSalary";

export default function DeductionSalaryTable({
  month,
  year,
  isAdmin,
  userId,
  baseSalary,
  setDeductionSalary,
}: {
  setDeductionSalary?: (val: number) => void;
  baseSalary: number;
  userId?: number;
  isAdmin?: boolean;
  month: number;
  year: number;
}): JSX.Element {
  const [isModalVisibleDay, setIsModalVisibleDay] = useState(false);
  const [isModalVisibleHour, setIsModalVisibleHour] = useState(false);

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

  const columns: ColumnsType<IDataDeductionDay> = isAdmin
    ? [
        {
          title: "Ngày nghỉ",
          dataIndex: "dayOffWork",
          key: "dayOffWork",
          align: "center",
          render: (_, record, index) => (
            <div>{(record?.dayOffWork || "") + " (" + record.date + ")"}</div>
          ),
        },
        {
          title: "số tiền trừ",
          dataIndex: "deductionSalaryDay",
          key: "deductionSalaryDay",
          align: "center",
          render: (_, record, index) => (
            <div>{record?.deductionSalaryDay?.toLocaleString("en-US")} VND</div>
          ),
        },
        {
          title: (
            <EditFilled
              onClick={showModalDay}
              className="text-[20px] text-[#0092ff] mr-3"
            />
          ),
          align: "center",
          width: "100px",
          render: (index, _record): JSX.Element => {
            return (
              <CloseCircleOutlined
                onClick={(): void => {
                  ApiSalary.deleteDeductionDaySalary(_record?.id || 0).then(
                    (r) => dayRefetch()
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
          title: "Ngày nghỉ",
          dataIndex: "dayOffWork",
          key: "dayOffWork",
          align: "center",
          render: (_, record, index) => (
            <div>{(record?.dayOffWork || "") + " (" + record.date + ")"}</div>
          ),
        },
        {
          title: "số tiền trừ",
          dataIndex: "deductionSalaryDay",
          key: "deductionSalaryDay",
          align: "center",
          render: (_, record, index) => (
            <div>{record?.deductionSalaryDay?.toLocaleString("en-US")} VND</div>
          ),
        },
      ];

  const columns2: ColumnsType<IDataDeductionDay> = isAdmin
    ? [
        {
          title: "giờ đi muộn",
          dataIndex: "hourLateWork",
          key: "hourLateWork",
          align: "center",
        },
        {
          title: "số tiền trừ",
          dataIndex: "deductionSalaryHour",
          key: "deductionSalaryHour",
          align: "center",
          render: (_, record, index) => (
            <div>
              {record?.deductionSalaryHour?.toLocaleString("en-US")} VND
            </div>
          ),
        },
        {
          title: (
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
          title: "giờ đi muộn",
          dataIndex: "hourLateWork",
          key: "hourLateWork",
          align: "center",
        },
        {
          title: "số tiền trừ",
          dataIndex: "deductionSalaryHour",
          key: "deductionSalaryHour",
          align: "center",
          render: (_, record, index) => (
            <div>
              {record?.deductionSalaryHour?.toLocaleString("en-US")} VND
            </div>
          ),
        },
      ];

  const data: IDataDeductionDay[] =
    dataDeduction?.map((el) => {
      return {
        id: el.id,
        date: el?.date,
        dayOffWork: el?.dayOffWork,
        deductionSalaryDay: (Number(el?.dayOffWork || 0) * baseSalary) / 24,
      };
    }) || [];
  const data2: IDataDeductionDay[] =
    dataDeductionHour?.map((el) => {
      return {
        id: el.id,
        date: el?.date,
        hourLateWork: el?.hourLateWork,
        deductionSalaryHour:
          (Number(el?.hourLateWork || 0) * baseSalary) / 24 / 8,
      };
    }) || [];

  const totalSalaryDay =
    data?.reduce(function (accumulator, element) {
      return accumulator + (Number(element?.deductionSalaryDay) || 0);
    }, 0) || 0;

  const totalSalaryHour =
    data2?.reduce(function (accumulator, element) {
      return accumulator + (Number(element?.deductionSalaryHour) || 0);
    }, 0) || 0;
  useEffect(() => {
    const totalSalary2 = totalSalaryDay + totalSalaryHour;
    if (setDeductionSalary) {
      setDeductionSalary(totalSalary2);
    }
  }, [isRefetchingD, isRefetchingH]);
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
        <Table
          className="w-full"
          columns={columns}
          dataSource={data || []}
          bordered
          pagination={false}
        />
        <Table
          className="w-full ml-4"
          columns={columns2}
          dataSource={data2 || []}
          bordered
          pagination={false}
        />
      </div>
    </Card>
  );
}
