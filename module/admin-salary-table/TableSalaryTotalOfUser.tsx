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
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export function TableSalaryTotalOfUser(): JSX.Element {
  const router = useRouter();
  const {month} = router.query;
  const {year} = router.query;
  const [searchValue, setSearchValue] = useState<string>();
  const [state, setState] = useState<number>();
  const [pageSize, setPageSize] = useState<number>(100);

  const getListSalaryTotalUser = (): Promise<IDataSalaryToTalOfUser[]> => {
    return ApiSalary.getListSalaryTotalUser(
      Number(year || 0),
      Number(month || 0),
      state,
      searchValue === "" ? undefined : searchValue,
      pageSize
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
                  src={
                    "http://13.215.91.199:8000/uploads/" +
                      (record?.user?.avatar || "") || "../img/avatar/avatar.jpg"
                  }
                  fallback="../img/avatar/avatar.jpg"
                  preview={false}
                />
              </div>
            );
          },
        },
        {
          title: "Email",
          fixed: "left",
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
          sorter: (a, b) => a.baseSalary - b.baseSalary,
        },
        {
          title: "Lương quản lý",
          dataIndex: "manageSalary",
          key: "address",
          align: "center",
          render: (_, record, index) => (
            <div>{record.manageSalary.toLocaleString("en-US")}</div>
          ),
          filters: [{text: "quản lý", value: 0}],
          sorter: (a, b) => a.manageSalary - b.manageSalary,
          onFilter: (value: any, record) => record.manageSalary > value,
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
            <div>
              {record?.detailTaxSalary?.taxSalary?.toLocaleString("en-US")}
            </div>
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
          sorter: (a, b) => a.totalSalary - b.totalSalary,
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
            className="w-[120px] ml-3 mr-4"
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
        {CheckPermissionEvent(
          NameEventConstant.PERMISSION_SALARY_MANAGER_KEY.CREATE_ALL_SALARY
        ) && (
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
        )}
      </div>
      <Table
        columns={columns}
        dataSource={data}
        className="hover-pointer"
        bordered
        pagination={{
          showSizeChanger: true,
          defaultPageSize: 100,
          onChange: (page, ps) => setPageSize(ps),
        }}
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: () => {
              if (
                CheckPermissionEvent(
                  NameEventConstant.PERMISSION_SALARY_MANAGER_KEY
                    .GET_DETAIL_SALARY
                )
              ) {
                router.push({
                  pathname: baseURL.SALARY.CREATE_SALARY,
                  query: {
                    month: month,
                    year: year,
                    userId: record.user.id,
                    id: record.id,
                    total: record.totalSalary,
                    taxSalary: record.taxSalary,
                    deductionTaxMe: record?.detailTaxSalary?.deductionOwn,
                    deductionFamilyTaxMe:
                      record?.detailTaxSalary?.deductionFamilyCircumstances,
                    taxableSalary: record.detailTaxSalary?.taxableSalary,
                    tax: record?.detailTaxSalary?.tax,
                    dailyOnsiteRate: record?.dailyOnsiteRate,
                  },
                });
              }
            },
          };
        }}
      />
    </div>
  );
}
