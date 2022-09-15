import "./index.scss";
import {Button, Image, Input, Modal, notification, Select, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {IDataSalaryToTalOfUser} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import baseURL from "@app/config/baseURL";
import {LeftOutlined, PlusCircleFilled} from "@ant-design/icons";

export function TableSalaryTotalOfUser(): JSX.Element {
  const router = useRouter();
  const {month} = router.query;
  const {year} = router.query;
  const [searchValue, setSearchValue] = useState<string>();
  const [state, setState] = useState<number>();

  const getListSalaryTotalUser = (): Promise<IDataSalaryToTalOfUser[]> => {
    return ApiSalary.getListSalaryTotalUser(
      Number(year || 0),
      Number(month || 0),
      state,
      searchValue === "" ? undefined : searchValue
    );
  };
  const {data, refetch} =
    useQuery("listSalaryTotalUser" + month, getListSalaryTotalUser, {
      enabled: false,
    }) || [];

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
          title: "Thuế thu nhập cá nhân",
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
                  : "Đã khoá"}
              </span>
            );
          },
        },
      ],
    },
  ];

  useEffect(() => {
    refetch();
  }, [state]);

  return (
    <div className="account-manager-page">
      <div className="flex items-center mb-6">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
      </div>
      <div className="flex items-center justify-between bg-white mb-4 p-4">
        <div className="flex items-center">
          <Input.Search
            className="w-[300px] mr-4"
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={() => {
              refetch();
            }}
          />
          <span>Trạng thái : </span>
          <Select
            placeholder="trạng thái"
            className="w-[120px] ml-4"
            onChange={(e) => {
              if (e === "-1") {
                setState(undefined);
              } else {
                setState(Number(e));
              }
            }}
          >
            <Select.Option key={1} value="-1">
              {" "}
            </Select.Option>
            <Select.Option key={1} value="0">
              Chưa duyệt
            </Select.Option>
            <Select.Option key={2} value="1">
              Đã duyệt
            </Select.Option>
            <Select.Option key={3} value="3">
              Đã khoá
            </Select.Option>
          </Select>
        </div>
        <Button
          type="primary"
          onClick={(): void => {
            Modal.confirm({
              title: "Bạn chắc chắn muốn taọ lương cho toàn bộ nhân viên ?",
              onOk: () => {
                ApiSalary.createSalaryAllEmployee(
                  Number(year),
                  Number(month)
                ).then((r) => {
                  notification.success({message: "create success"});
                  refetch();
                });
              },
            });
          }}
          className="bg-blue-500 items-center flex"
          icon={<PlusCircleFilled />}
        >
          Tạo lương tất cả nhân viên
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        className="hover-pointer"
        bordered
        scroll={{y: "calc(100vw - 300px)"}}
        pagination={{pageSize: 100}}
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: () => {
              router.push({
                pathname: baseURL.SALARY.CREATE_SALARY,
                query: {
                  month: month,
                  year: year,
                  userId: record.user.id,
                  id: record.id,
                  total: record.totalSalary,
                  tax: record.taxSalary,
                },
              });
            },
          };
        }}
      />
    </div>
  );
}
