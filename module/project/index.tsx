import "./index.scss";
import React, {useEffect, useState} from "react";
import {Filter} from "@app/components/Filter";
import {Button, Table} from "antd";
import moment from "moment";
import ApiProject, {IProjectWithMeta} from "@app/api/ApiProject";
import {useQuery} from "react-query";
import {ModalCreateProject} from "./components/ModalCreateProject";
import {useRouter} from "next/router";
import {queryKeys} from "@app/utils/constants/react-query";
import baseURL from "@app/config/baseURL";
import {renameKeys} from "@app/utils/convert/ConvertHelper";
import {EProjectState, IUserLogin} from "@app/types";
import {IMetadata} from "@app/api/Fetcher";
import ApiUser from "@app/api/ApiUser";

export function Project(): JSX.Element {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState("");
  const [pageSize, setPageSize] = useState<number>(100);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchString, setSearchString] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [filterState, setFilterState] = useState<number[]>([0, 1, 2, 3]);

  const getProject = (): Promise<IProjectWithMeta> => {
    return ApiProject.getProject({
      pageSize: pageSize,
      pageNumber: pageNumber,
      searchProjectFields: ["name", "customer"],
      searchProjectManagerFields: ["fullName"],
      search: searchString,
      filter: {
        state_IN: filterState,
      },
      sort: ["startDate"],
    });
  };

  const getUser = (): Promise<{data: IUserLogin[]; meta: IMetadata}> => {
    return ApiUser.getUserAccount();
  };

  const {data: dataProject, refetch} = useQuery(
    queryKeys.GET_LIST_PROJECT,
    getProject
  );

  const {data: dataUser} = useQuery(
    queryKeys.GET_LIST_USER_FOR_PROJECT,
    getUser
  );

  const showModalCreateProject = (): void => {
    setIsModalVisible("modalCreateProject");
  };

  const toggleModal = (): void => {
    setIsModalVisible("");
  };

  useEffect(() => {
    refetch();
  }, [pageSize, pageNumber, onSearch, filterState]);

  const newKeys = {id: "value", fullName: "label"};
  const listUserConvert: {value: number; label: string}[] = [];
  dataUser?.data?.map((item) => {
    const renamedObj = renameKeys(item || {}, newKeys);
    listUserConvert.push(renamedObj);
    return listUserConvert;
  });

  const listState = [
    {
      value: -1,
      title: "Tất cả",
      default: true,
    },
    {
      value: EProjectState.MOI_KHOI_TAO,
      title: "Mới khởi tạo",
    },
    {
      value: EProjectState.DANG_THUC_HIEN,
      title: "Đang thực hiện",
    },
    {
      value: EProjectState.DA_KET_THUC,
      title: "Đã kết thúc",
    },
    {
      value: EProjectState.DA_HUY,
      title: "Đã hủy",
    },
  ];

  return (
    <div className="container-project">
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
                setOnSearch(!onSearch);
              },
            },
            {
              visible: true,
              isSelect: true,
              data: listState,
              handleOnChange: (value: number): void => {
                if (value === -1) {
                  setFilterState([0, 1, 2, 3]);
                } else {
                  setFilterState([value]);
                }
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
            title: "Ngày kết thúc dự kiến",
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
              state === EProjectState.MOI_KHOI_TAO
                ? "Mới khởi tạo"
                : state === EProjectState.DANG_THUC_HIEN
                ? "Đang thực hiện"
                : state === EProjectState.DA_KET_THUC
                ? "Đã kết thúc"
                : state === EProjectState.DA_HUY
                ? "Đã hủy"
                : "",
          },
        ]}
        dataSource={dataProject?.data}
        bordered
        pagination={{
          total: dataProject?.meta.totalItems,
          defaultPageSize: 100,
          showSizeChanger: true,
          pageSizeOptions: [
            "100",
            "200",
            "300",
            "400",
            "500",
            "600",
            "700",
            "800",
            "900",
            "1000",
          ],
          onChange: (page, numberPerPage): void => {
            setPageNumber(page);
            setPageSize(numberPerPage);
          },
        }}
        onRow={(record): {onDoubleClick: () => void} => {
          return {
            onDoubleClick: (): void => {
              router.push({
                pathname: baseURL.PROJECT.PROJECT_DETAIL,
                query: {
                  id: record.id,
                },
              });
            },
          };
        }}
      />
      <ModalCreateProject
        isModalVisible={isModalVisible === "modalCreateProject"}
        toggleModal={toggleModal}
        listUserConvert={listUserConvert}
      />
    </div>
  );
}
