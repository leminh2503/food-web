import "./index.scss";
import React from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
// eslint-disable-next-line import/named
import {IDataProjectSalary} from "@app/types";

export function ProjectSalaryTable(): JSX.Element {
  const columns: ColumnsType<IDataProjectSalary> = [
    {
      title: "Dự án",
      dataIndex: "projectName",
      key: "projectName",
      align: "center",
    },
    {
      title: "Lương thưởng dự án",
      dataIndex: "projectSalary",
      key: "projectSalary",
      align: "center",
    },
  ];

  const data: IDataProjectSalary[] = [
    {projectSalary: "100.000", projectName: "Amoga"},
    {projectSalary: "100.000", projectName: "Amoga"},
  ];

  return (
    <Card className="w-full">
      <div className="mb-4 font-bold">Lương dự án :</div>
      <Table columns={columns} dataSource={data} bordered pagination={false} />
    </Card>
  );
}
