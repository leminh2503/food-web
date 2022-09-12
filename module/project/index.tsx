import "./index.scss";
import React, {useEffect, useState} from "react";
import {Filter} from "@app/components/Filter";
import {Button, Table} from "antd";
import moment from "moment";
import ApiProject, {IProjectWithMeta} from "@app/api/ApiProject";
import {useQuery} from "react-query";
import {ModalCreateProject} from "./components/ModalCreateProject";
import {useRouter} from "next/router";

export function Project(): JSX.Element {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState("");
  const [pageSize, setPageSize] = useState<number>(50);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchString, setSearchString] = useState("");
  const [onSearch, setOnSerch] = useState(false);

  const showModalCreateProject = (): void => {
    setIsModalVisible("modalCreateProject");
  };

  const toggleModal = (): void => {
    setIsModalVisible("");
  };

  const getProject = (): Promise<IProjectWithMeta> => {
    return ApiProject.getProject({
      pageSize: pageSize,
      pageNumber: pageNumber,
      searchFields: ["name"],
      search: searchString,
    });
  };
  const {data: dataProject, refetch} = useQuery("listProject", getProject);

  useEffect(() => {
    refetch();
  }, [pageSize, pageNumber, onSearch]);

  return (
    <div className="container">
      <div className="flex justify-between mb-5">
        <Filter
          listSearch={[
            {
              visible: true,
              isSearch: true,
              placeholder: "Nhập từ khóa tìm kiếm",
              handleOnChangeSearch: (e): void => {
                setSearchString(e.target.value);
              },
              handleOnSearch: (value): void => {
                setSearchString(value);
                setOnSerch(!onSearch);
              },
            },
          ]}
        />
        <Button className="btn-primary w-48" onClick={showModalCreateProject}>
          Thêm dự án
        </Button>
      </div>
      <Table
        columns={[
          {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            width: 100,
            render: (_, record, index) => <div>{index + 1}</div>,
          },
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
            title: "PM dự án",
            dataIndex: "projectManager",
            key: "projectManager",
            align: "center",
            render: (_, record) => record.projectManager?.fullName,
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
        dataSource={dataProject?.data}
        bordered
        pagination={{
          total: dataProject?.meta?.totalItems,
          defaultPageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ["50", "100", "150", "200"],
          onChange: (page, numberPerPage): void => {
            setPageNumber(page);
            setPageSize(numberPerPage);
          },
        }}
        onRow={(record) => {
          return {
            onDoubleClick: (): void => {
              router.push({
                pathname: "/project/project-detail",
                query: {
                  name: record.name,
                  customer: record.customer,
                  startDate: record.startDate,
                  endDate: record.endDate,
                  technicality: record.technicality,
                  use: record.use,
                  description: record.description,
                  state: record.state,
                },
              });
            },
          };
        }}
      />
      <ModalCreateProject
        isModalVisible={isModalVisible === "modalCreateProject"}
        toggleModal={toggleModal}
        dataRefetch={refetch}
      />
    </div>
  );
}
