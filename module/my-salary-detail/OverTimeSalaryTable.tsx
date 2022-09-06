import "./index.scss";
import React from "react";
import {Card, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import {getDayOnMonth} from "@app/utils/date/getDayOnMonth";
import {findDayOnWeek} from "@app/utils/date/findDayOnWeek";

export function OverTimeSalaryTable({
  month,
  year,
}: {
  month: number;
  year: number;
}): JSX.Element {
  const columns: ColumnsType<any[]> = [
    {
      title: "",
      dataIndex: "col1",
      key: "col1",
      align: "center",
      width: "150px",
      fixed: "left",
    },
  ];

  const data: any = [
    {col1: "Ngày"},
    {col1: "Thứ"},
    {col1: "Tên dự án"},
    {col1: "Số giờ OT"},
    {col1: "Duyệt"},
  ];

  for (let i = 1; i <= getDayOnMonth(month, year); i++) {
    columns.push({
      title: "",
      key: i,
      align: "center",
      width: "100px",
      render: (index, _item) => {
        if (index.col1 === "Ngày") {
          return <span>{i}</span>;
        }
        if (index.col1 === "Thứ") {
          return <span>{findDayOnWeek(year, month, i)}</span>;
        }
        if (index.col1 === "Tên dự án") {
          return <span>coinR4</span>;
        }
        if (index.col1 === "Số giờ OT") {
          return <span> </span>;
        }
        return <span>i</span>;
      },
    });
  }
  return (
    <Card className="max-w-full">
      <div className="mb-4 font-bold">Lương Overtime :</div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{x: 1500}}
      />
    </Card>
  );
}
