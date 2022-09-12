import "./index.scss";
import {Image, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import {IDataSalaryToTalOfUser} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import baseURL from "@app/config/baseURL";
import {LeftOutlined} from "@ant-design/icons";

export function TableSalaryTotalOfUser(): JSX.Element {
  const router = useRouter();
  const {month} = router.query;
  const {year} = router.query;
  const getListSalaryTotalUser = (): Promise<IDataSalaryToTalOfUser[]> => {
    return ApiSalary.getListSalaryTotalUser(
      Number(year || 0),
      Number(month || 0)
    );
  };
  const {data, refetch} =
    useQuery("listSalaryTotalUser", getListSalaryTotalUser, {enabled: false}) ||
    [];

  useEffect(() => {
    if (year && month) {
      refetch();
    }
  }, [year, month]);

  const columns: ColumnsType<IDataSalaryToTalOfUser> = [
    {
      title: "Lương tổng quát tháng : " + month + "/" + year,
      align: "center",
      children: [
        {
          title: "STT",
          dataIndex: "index",
          key: "index",
          align: "center",
          render: (_, record, index) => <div>{index + 1}</div>,
        },
        {
          title: "Họ tên",
          dataIndex: "fullName",
          key: "fullName",
          align: "center",
          render: (_, record) => {
            return <div>{record?.user?.fullName}</div>;
          },
        },
        {
          title: "Ảnh",
          dataIndex: "avatar",
          key: "avatar",
          align: "center",
          width: 80,
          render: (_, record) => {
            return (
              <div>
                <Image
                  src={"../" + record.user.avatar || "../img/avatar/avatar.jpg"}
                  fallback="../img/avatar/avatar.jpg"
                  preview={false}
                />
              </div>
            );
          },
        },
        {
          title: "Email",
          dataIndex: "email",
          key: "email",
          align: "center",
          render: (_, record) => {
            return <div>{record?.user?.email}</div>;
          },
        },
        {
          title: "Lương cứng",
          dataIndex: "baseSalary",
          key: "baseSalary",
          align: "center",
          render: (_, record, index) => (
            <div>{record.baseSalary.toLocaleString("en-US")}</div>
          ),
        },
        {
          title: "Lương quản lý",
          dataIndex: "manageSalary",
          key: "address",
          align: "center",
          render: (_, record, index) => (
            <div>{record.manageSalary.toLocaleString("en-US")}</div>
          ),
        },
        {
          title: "Lương dự án",
          dataIndex: "projectSalary",
          key: "projectSalary",
          align: "center",
          render: (_, record, index) => (
            <div>{record.projectSalary.toLocaleString("en-US")}</div>
          ),
        },
        {
          title: "Lương overtime",
          children: [
            {
              title: "số giờ",
              dataIndex: "manager",
              key: "manager",
              align: "center",
            },
            {
              title: "số tiền",
              dataIndex: "manager",
              key: "manager",
              align: "center",
              render: (_, record, index) => (
                <div>{record?.overtimeSalary.toLocaleString("en-US")}</div>
              ),
            },
          ],
        },
        {
          title: "Lương Onsite",
          children: [
            {
              title: "số ngày",
              dataIndex: "manager",
              key: "manager",
              align: "center",
            },
            {
              title: "số tiền",
              dataIndex: "onsiteSalary",
              key: "onsiteSalary",
              align: "center",
              render: (_, record, index) => (
                <div>{record?.onsiteSalary.toLocaleString("en-US")}</div>
              ),
            },
          ],
        },
        {
          title: "Lương khác",
          dataIndex: "bonusSalary",
          key: "bonusSalary",
          align: "center",
          render: (_, record, index) => (
            <div>{record?.bonusSalary.toLocaleString("en-US")}</div>
          ),
        },
        {
          title: "Lương khấu trừ",
          dataIndex: "deductionSalary",
          key: "deductionSalary",
          align: "center",
          render: (_, record, index) => (
            <div>{record?.deductionSalary.toLocaleString("en-US")}</div>
          ),
        },
        {
          title: "Thuế",
          align: "center",
          key: "taxSalary",
          dataIndex: "taxSalary",
          render: (_, record, index) => (
            <div>{record?.taxSalary.toLocaleString("en-US")}</div>
          ),
        },
        {
          title: "Tổng",
          dataIndex: "totalSalary",
          key: "totalSalary",
          align: "center",
          render: (_, record, index) => (
            <div>{record?.totalSalary.toLocaleString("en-US")}</div>
          ),
        },
        {
          title: "Trạng thái",
          dataIndex: "state",
          key: "state",
          align: "center",
          render: (index, _item) => {
            return (
              <span
                className={
                  _item.state === 0
                    ? "text-[#c4c2c2]"
                    : _item.state === 1
                    ? "text-[#0092ff]"
                    : "text-[#cb2131]"
                }
              >
                {_item.state === 0
                  ? "Chưa duyệt"
                  : _item.state === 1
                  ? "Đã duyệt"
                  : "Đã huỷ"}
              </span>
            );
          },
        },
      ],
    },
  ];

  return (
    <div className="account-manager-page">
      <div className="flex items-center mb-6">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        className="hover-pointer"
        bordered
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: () => {
              router.push({
                pathname: baseURL.SALARY.CREATE_SALARY,
                query: {
                  month: month,
                  year: year,
                  userId: record.user.id,
                },
              });
            },
          };
        }}
      />
    </div>
  );
}
