import "../my-salary-detail/index.scss";
import React, {useEffect, useState} from "react";
import {Card, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import {getDayOnMonth} from "@app/utils/date/getDayOnMonth";
import {findDayOnWeek} from "@app/utils/date/findDayOnWeek";
import ModalCreateOverTime from "./ModalCreateOverTime";
import {CheckCircleFilled, EditFilled} from "@ant-design/icons";
import {IDataOverTime, IDataProjectList} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {formatNumber} from "@app/utils/fomat/FormatNumber";

export default function OverTimeSalaryTable({
  month,
  year,
  isManager,
  idUser,
  listProject,
}: {
  listProject?: IDataProjectList[];
  idUser: number | string;
  isManager?: boolean;
  month: number;
  year: number;
}): JSX.Element {
  const [disableCheck, setDisableCheck] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (): void => {
    setIsModalVisible(true);
  };

  const handleOk = (): void => {
    setIsModalVisible(false);
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const getListOTSalary = (): Promise<IDataOverTime[]> => {
    if (isManager) {
      return ApiSalary.getMyListOTSalary(year, month, Number(idUser));
    }
    return ApiSalary.getMyListOTSalary(year, month);
  };

  const {
    data: dataOT,
    refetch,
    isRefetching,
  } = useQuery("listOTSalaryUser" + isManager, getListOTSalary) || [];

  const handleUpdate = (): void => {
    //
  };

  const columns: ColumnsType<IDataOverTime[]> = [
    {
      title: (
        <>
          <EditFilled
            onClick={showModal}
            className="text-[20px] text-[#0092ff] mr-3"
          />
          {isManager && (
            <CheckCircleFilled
              className={
                disableCheck
                  ? "text-[20px] text-[#ADE597FF] hover:cursor-not-allowed"
                  : "text-[20px] text-[green]"
              }
              onClick={handleUpdate}
              disabled={disableCheck}
            />
          )}
        </>
      ),
      dataIndex: "col1",
      key: "col1",
      align: "center",
      width: "150px",
      fixed: "left",
    },
  ];

  useEffect(() => {
    setDisableCheck(true);
    dataOT?.map((el) => {
      if (el.state === 0) {
        setDisableCheck(false);
      }
      return el;
    });
  }, [isRefetching]);

  const data: any = [
    {col1: "Ngày"},
    {col1: "Thứ"},
    {col1: "Tên dự án"},
    {col1: "Số giờ OT"},
    {col1: "Duyệt"},
  ];

  for (let i = 1; i <= getDayOnMonth(month, year); i++) {
    let check = 0;
    dataOT?.map((el) => {
      if (
        el.date ===
        year + "-" + formatNumber(month) + "-" + formatNumber(i)
      ) {
        check++;
        columns.push({
          title: "",
          key: i,
          align: "center",
          width: "130px",
          render: (index, _item) => {
            if (index.col1 === "Ngày") {
              return <span>{i}</span>;
            }
            if (index.col1 === "Thứ") {
              return <span>{findDayOnWeek(year, month, i)}</span>;
            }
            if (index.col1 === "Tên dự án") {
              return <span>{el?.project?.name}</span>;
            }
            if (index.col1 === "Số giờ OT") {
              return <span>{el?.hour}</span>;
            }
            return (
              <span
                className={
                  el.state === 0
                    ? "text-[#c4c2c2]"
                    : el.state === 1
                    ? "text-[#0092ff]"
                    : "text-[#cb2131]"
                }
              >
                {el.state === 0
                  ? "Chưa duyệt"
                  : el.state === 1
                  ? "Đã duyệt"
                  : "Đã huỷ"}
              </span>
            );
          },
        });
      }
      return el;
    });
    if (check === 0) {
      columns.push({
        title: "",
        key: i,
        align: "center",
        width: "130px",
        render: (index, _item) => {
          if (index.col1 === "Ngày") {
            return <span>{i}</span>;
          }
          if (index.col1 === "Thứ") {
            return <span>{findDayOnWeek(year, month, i)}</span>;
          }
          if (index.col1 === "Tên dự án") {
            return <span> </span>;
          }
          if (index.col1 === "Số giờ OT") {
            return <span> </span>;
          }
          return <span> </span>;
        },
      });
    }
  }
  return (
    <Card className="max-w-full">
      <ModalCreateOverTime
        listProject={listProject}
        idUser={Number(idUser)}
        dataOverTime={dataOT || []}
        month={month}
        refetchDataOT={refetch}
        year={year}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
      />
      <div className="mb-4 font-bold">Lương Overtime :</div>
      <Table
        loading={isModalVisible}
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{x: 1500}}
      />
    </Card>
  );
}
