import "./index.scss";
import {Select, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import React, {useState} from "react";
import {IDataCost} from "@app/types";
import {useQuery} from "react-query";
import Config from "@app/config";
import ApiSalary from "@app/api/ApiSalary";
import {formatNumber} from "@app/utils/fomat/FormatNumber";
import baseURL from "@app/config/baseURL";
import {useRouter} from "next/router";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export function AdminSalaryTable(): JSX.Element {
  const router = useRouter();
  const date = new Date();
  const [year, setYear] = useState<number>(date.getFullYear());

  const getListTotalSalary = (): Promise<IDataCost> => {
    return ApiSalary.getListTotalSalary(year);
  };

  const {data} = useQuery("listTotalSalaryAdmin", getListTotalSalary) || [];

  const dataYear = (): JSX.Element => {
    const year = [];
    for (let i = Config.NOW.YEAR; i <= date.getFullYear(); i++) {
      year.push(i);
    }
    return (
      <>
        {year.map((el, index) => (
          <Select.Option key={index} value={el}>
            {el}
          </Select.Option>
        ))}
      </>
    );
  };

  const onRow = (record: any): {onDoubleClick: () => void} => {
    return {
      onDoubleClick: (): void => {
        if (
          CheckPermissionEvent(
            NameEventConstant.PERMISSION_SALARY_MANAGER_KEY.LIST_ALL_SALARY
          )
        ) {
          router.push({
            pathname: baseURL.SALARY.LIST_EMPLOYEE,
            query: {
              month: record.month,
              year: year,
            },
          });
        }
      },
    };
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      align: "center",
      render: (_, record, index) => {
        return <div>{formatNumber(record?.month)}</div>;
      },
    },
    {
      title: "Tổng lương",
      dataIndex: "totalSalary",
      key: "totalSalary",
      align: "center",
      render: (_, record, index) => (
        <div>{record?.totalSalary?.toLocaleString("en-US")} VND</div>
      ),
    },
  ];

  const dataSource = [
    {
      month: 1,
      totalSalary: data?.January,
    },
    {
      month: 2,
      totalSalary: data?.February,
    },
    {
      month: 3,
      totalSalary: data?.March,
    },
    {
      month: 4,
      totalSalary: data?.April,
    },
    {
      month: 5,
      totalSalary: data?.May,
    },
    {
      month: 6,
      totalSalary: data?.June,
    },
    {
      month: 7,
      totalSalary: data?.July,
    },
    {
      month: 8,
      totalSalary: data?.August,
    },
    {
      month: 9,
      totalSalary: data?.September,
    },
    {
      month: 10,
      totalSalary: data?.October,
    },
    {
      month: 11,
      totalSalary: data?.November,
    },
    {
      month: 12,
      totalSalary: data?.December,
    },
  ];

  return (
    <div>
      <Select
        defaultValue={date.getFullYear().toString()}
        style={{width: 120}}
        onChange={(e) => setYear(Number(e))}
      >
        {dataYear()}
      </Select>
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        className="hover-pointer mt-4"
        onRow={onRow}
        pagination={false}
      />
    </div>
  );
}
