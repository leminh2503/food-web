import {LeftOutlined} from "@ant-design/icons";
import {Table} from "antd";
import moment from "moment";
import {useRouter} from "next/router";
import React from "react";
import Icon from "@app/components/Icon/Icon";

export function ProjectDetail(): JSX.Element {
  const router = useRouter();

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-5">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
        <button type="button">
          <Icon icon="Edit" size={30} color="#0092ff" />
        </button>
      </div>
      <div>
        <Table
          columns={[
            {
              title: "Tên dự án",
              dataIndex: "name",
              key: "name",
              align: "center",
            },
            {
              title: "Khách hàng",
              dataIndex: "customer",
              key: "customer",
              align: "center",
            },
            {
              title: "Ngày bắt đầu",
              dataIndex: "startDate",
              key: "startDate",
              align: "center",
              render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
            },
            {
              title: "Ngày kết thúc",
              dataIndex: "endDate",
              key: "endDate",
              align: "center",
              render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
            },
            {
              title: "Kỹ thuật",
              dataIndex: "technicality",
              key: "technicality",
              align: "center",
            },
            {
              title: "Công cụ sử dụng",
              dataIndex: "use",
              key: "use",
              align: "center",
            },
            {
              title: "Mô tả",
              dataIndex: "description",
              key: "description",
              align: "center",
            },
            {
              title: "Trạng thái",
              dataIndex: "state",
              key: "state",
              align: "center",
              render: (state) =>
                state === 0
                  ? "Mới khởi tạo"
                  : state === 1
                  ? "Đang phát triển"
                  : state === 2
                  ? "Đã kết thúc"
                  : "Đã hủy",
            },
          ]}
          dataSource={[router.query]}
          bordered
          pagination={false}
        />
      </div>
      <div className="mt-8">
        <Table
          columns={[
            {
              title: "DANH SÁCH THÀNH VIÊN TRON DỰ ÁN",
              align: "center",
              children: [
                {
                  title: "STT",
                  align: "center",
                },
                {
                  title: "Tên",
                  align: "center",
                },
                {
                  title: "Vai trò",
                  align: "center",
                },
                {
                  title: "Công số",
                  align: "center",
                  children: [
                    {
                      title: "Hợp đồng",
                      align: "center",
                    },
                    {
                      title: "Thực tế",
                      align: "center",
                    },
                    {
                      title: "OT",
                      align: "center",
                    },
                  ],
                },
                {
                  title: "Thời gian",
                  align: "center",
                  children: [
                    {
                      title: "Bắt đầu",
                      align: "center",
                    },
                    {
                      title: "Kết thúc",
                      align: "center",
                    },
                  ],
                },
              ],
            },
          ]}
          bordered
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
              );
            },
            getCheckboxProps: (record) => ({
              disabled: record.name === "Disabled User",
              name: record.name,
            }),
          }}
        />
      </div>
    </div>
  );
}
