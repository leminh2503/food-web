import "./index.scss";
import {Button, Modal, notification, Table} from "antd";
import React, {useEffect, useState} from "react";
import type {ColumnsType} from "antd/es/table";
import Icon from "@app/components/Icon/Icon";
import moment from "moment";
import ApiLeaveWork from "@app/api/ApiLeaveWork";
import {ELeaveWork, ILeaveWork} from "@app/types";
import {useMutation, useQuery} from "react-query";
import {ModalCreateLeaveWork} from "@app/module/leave-work-user/components/ModalCreateLeaveWork";
import {FilterLeaveWork} from "@app/module/leave-work/components/FilterLeaveWork";
import {queryKeys} from "@app/utils/constants/react-query";
import {IMetadata} from "@app/api/Fetcher";

export function LeaveWorkUser(): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState("");
  const [filter, setFilter] = useState({
    state: [0, 1, 2],
    month: moment().month() + 1,
    year: moment().year(),
  });
  const [pageSize, setPageSize] = useState<number>(100);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const showModalCreateLeaveWork = (): void => {
    setIsModalVisible("modalCreateLeaveWork");
  };

  const toggleModal = (): void => {
    setIsModalVisible("");
  };

  const getLeaveWorkMe = (): Promise<{data: ILeaveWork[]; meta: IMetadata}> => {
    return ApiLeaveWork.getLeaveWorkMe({
      pageSize: pageSize,
      pageNumber: pageNumber,
      filter: {
        state_IN: filter.state,
        startDate_MONTH: filter.month,
        startDate_YEAR: filter.year,
      },
      sort: ["-startDate"],
    });
  };

  const {data: dataLeaveWorkMe, refetch} = useQuery(
    queryKeys.GET_LIST_LEAVE_WORK_ME,
    getLeaveWorkMe
  );

  useEffect(() => {
    refetch();
  }, [filter, pageSize, pageNumber]);

  const deleteLeaveWorkMutation = useMutation(ApiLeaveWork.deleteLeaveWork);
  const handleDeleteLeaveWork = (record: ILeaveWork): void => {
    Modal.confirm({
      title: "Bạn có muốn xóa đơn xin nghỉ phép?",
      content: "Đơn xin nghỉ phép sẽ bị xóa vĩnh viễn!",
      okType: "primary",
      cancelText: "Huỷ",
      okText: "Xóa",
      onOk: () => {
        if (record.id) {
          deleteLeaveWorkMutation.mutate(record.id, {
            onSuccess: () => {
              notification.success({
                duration: 1,
                message: "Xóa đơn xin nghỉ phép thành công!",
              });
              refetch();
            },
            onError: () => {
              notification.error({
                duration: 1,
                message: "Xóa đơn xin nghỉ phép thất bại!",
              });
            },
          });
        }
      },
    });
  };

  const columnsUser: ColumnsType<ILeaveWork> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Ngày bắt đầu nghỉ",
      dataIndex: "startDate",
      key: "startDate",
      align: "center",
      render: (date) => <>{moment(new Date(date)).format("DD-MM-YYYY")}</>,
    },
    {
      title: "Số ngày nghỉ",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "state",
      key: "state",
      align: "center",
      render: (state) =>
        state === ELeaveWork.DANG_CHO_DUYET
          ? "Đang chờ duyệt"
          : state === ELeaveWork.DA_CHAP_NHAN
          ? "Đã chấp nhận"
          : state === ELeaveWork.BI_TU_CHOI
          ? "Bị từ chối"
          : "",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record): JSX.Element =>
        record.state === 0 ? (
          <div>
            <Button
              className="mr-1"
              onClick={(): void => {
                handleDeleteLeaveWork(record);
              }}
              icon={<Icon icon="CloseRed" size={20} />}
            />
          </div>
        ) : (
          <div />
        ),
    },
  ];

  return (
    <div className="container-leave-work">
      <div className="flex justify-between mb-5">
        <FilterLeaveWork setFilter={setFilter} />
        <Button
          className="btn-primary"
          type="primary"
          onClick={(): void => {
            showModalCreateLeaveWork();
          }}
        >
          Tạo đơn xin nghỉ phép
        </Button>
      </div>
      <Table
        columns={columnsUser}
        bordered
        dataSource={dataLeaveWorkMe?.data ?? []}
        pagination={{
          total: dataLeaveWorkMe?.meta.totalItems,
          defaultPageSize: 100,
          showSizeChanger: true,
          pageSizeOptions: ["50", "100"],
          onChange: (page, numberPerPage): void => {
            setPageNumber(page);
            setPageSize(numberPerPage);
          },
        }}
      />
      <ModalCreateLeaveWork
        isModalVisible={isModalVisible === "modalCreateLeaveWork"}
        toggleModal={toggleModal}
      />
    </div>
  );
}
