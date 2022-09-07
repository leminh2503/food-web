import "./index.scss";
import {Select, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import React, {useEffect, useState} from "react";
import ApiUser from "@app/api/ApiUser";
import {IUserLogin} from "@app/types";
import {useQuery} from "react-query";
import {useRouter} from "next/router";
import baseURL from "@app/config/baseURL";
import Config from "@app/config";
import ApiSalary from "@app/api/ApiSalary";

export function Salary(): JSX.Element {
  const router = useRouter();
  const date = new Date();
  const [year, setYear] = useState<number>(date.getFullYear());
  const getUserAccount = (): Promise<IUserLogin[]> => {
    return ApiUser.getUserAccount({pageSize: 30, pageNumber: 1});
  };

  const getListTotalSalary = (): Promise<any> => {
    return ApiSalary.getMyListTotalSalary(year);
  };

  useEffect(() => {
    console.log(getListTotalSalary());
  }, []);

  const dataYear = (): JSX.Element => {
    const year = [];
    for (let i = Config.YEAR_NOW; i <= date.getFullYear(); i++) {
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

  const onRow = (record: IUserLogin): {onDoubleClick: () => void} => {
    return {
      onDoubleClick: (): void => {
        router.push({
          pathname: baseURL.SALARY.SALARY_DETAIL,
          query: {
            month: 9,
            year: 2022,
          },
        });
      },
    };
  };

  const dataUserAccount = useQuery("listUserAccount", getUserAccount);

  useEffect(() => {
    dataUserAccount.refetch();
  }, []);

  const columns: ColumnsType<IUserLogin> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Năm",
      dataIndex: "year",
      key: "year",
      align: "center",
      width: 80,
    },
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      align: "center",
    },
    {
      title: "Thưởng dự án",
      dataIndex: "projectSalary",
      key: "fullName",
      align: "center",
    },
    {
      title: "Lương làm thêm",
      dataIndex: "overTimeSalary",
      key: "overTimeSalary",
      align: "center",
    },
    {
      title: "Lương Onsite",
      dataIndex: "onsiteSalary",
      key: "onsiteSalary",
      align: "center",
    },
    {
      title: "Lương cứng",
      dataIndex: "baseSalary",
      key: "baseSalary",
      align: "center",
    },
    {
      title: "Lương khấu trừ",
      align: "center",
    },
    {
      title: "Tổng lương",
      key: "totalSalary",
      align: "center",
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
        dataSource={dataUserAccount.data}
        bordered
        className="hover-pointer mt-4"
        onRow={onRow}
      />
    </div>
  );
}
