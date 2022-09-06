import "./index.scss";
import React from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";

interface IDataBonusSalary {
  bonusSalary: string | number;
  reason: string;
}

export function OtherSalaryTable(): JSX.Element {
  const columns: ColumnsType<IDataBonusSalary> = [
    {
      title: "Số tiền",
      dataIndex: "bonusSalary",
      key: "bonusSalary",
      align: "center",
    },
    {
      title: "lý do",
      dataIndex: "reason",
      key: "reason",
      align: "center",
    },
  ];

  const data: IDataBonusSalary[] = [
    {bonusSalary: "100.000", reason: ""},
    {bonusSalary: "100.000", reason: ""},
  ];

  return (
    <Card className="w-full">
      <div className="mb-4 font-bold">Lương Khác :</div>
      <Table columns={columns} dataSource={data} bordered pagination={false} />
    </Card>
  );
}
