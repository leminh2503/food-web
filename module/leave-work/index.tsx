import "./index.scss";
import {Button, Image, Modal, notification, Table} from "antd";
import React, {useEffect, useState} from "react";
import type {ColumnsType} from "antd/es/table";
import Icon from "@app/components/Icon/Icon";
import moment from "moment";
import ApiLeaveWork from "@app/api/ApiLeaveWork";
import {ELeaveWork, ILeaveWork} from "@app/types";
import {useMutation, useQuery} from "react-query";
import {IRootState} from "@app/redux/store";
import {useSelector} from "react-redux";
import {ModalCreateLeaveWork} from "@app/module/leave-work/components/ModalCreateLeaveWork";
import {ModalRefuseLeaveWork} from "@app/module/leave-work/components/ModalRefuseLeaveWork";
import {FilterLeaveWork} from "@app/module/leave-work/components/FilterLeaveWork";
import {queryKeys} from "@app/utils/constants/react-query";
import {IMetadata} from "@app/api/Fetcher";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export function LeaveWork(): JSX.Element {
  const role = useSelector((state: IRootState) => state.user.role);
  const [refuseWorkLeaveId, setRefuseWorkLeaveId] = useState<number>();
  const [isModalVisible, setIsModalVisible] = useState("");
  const [filter, setFilter] = useState({
    state: [0, 1, 2],
    month: moment().month() + 1,
    year: moment().year(),
  });
  const [pageSize, setPageSize] = useState<number>(50);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const showModalCreateLeaveWork = (): void => {
    setIsModalVisible("modalCreateLeaveWork");
  };

  const showModalRefuseLeaveWork = (): void => {
    setIsModalVisible("refuseLeaveWork");
  };

  const toggleModal = (): void => {
    setIsModalVisible("");
  };

  const getLeaveWork = (): Promise<{data: ILeaveWork[]; meta: IMetadata}> => {
    return ApiLeaveWork.getLeaveWork({
      pageSize: pageSize,
      pageNumber: pageNumber,
      filter: {
        state_IN: filter.state,
        createdAt_MONTH: filter.month,
        createdAt_YEAR: filter.year,
      },
      sort: ["-startDate"],
    });
  };

  const getLeaveWorkMe = (): Promise<{data: ILeaveWork[]; meta: IMetadata}> => {
    return ApiLeaveWork.getLeaveWorkMe({
      pageSize: pageSize,
      pageNumber: pageNumber,
      filter: {
        state_IN: filter.state,
        createdAt_MONTH: filter.month,
        createdAt_YEAR: filter.year,
      },
      sort: ["-startDate"],
    });
  };
  const {data: dataLeaveWork, refetch: refetchLeaveWork} = useQuery(
    queryKeys.GET_LIST_LEAVE_WORK,
    getLeaveWork
  );

  const {data: dataLeaveWorkMe, refetch: refetchLeaveWorkMe} = useQuery(
    queryKeys.GET_LIST_LEAVE_WORK_ME,
    getLeaveWorkMe
  );

  useEffect(() => {
    if (role) {
      refetchLeaveWork();
    } else {
      refetchLeaveWorkMe();
    }
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
              if (role) {
                refetchLeaveWork();
              } else {
                refetchLeaveWorkMe();
              }
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

  const approvalLeaveWorkMutation = useMutation(ApiLeaveWork.approvalLeaveWork);
  const handleApprovalLeaveWork = (record: ILeaveWork): void => {
    Modal.confirm({
      title: "Bạn muốn chấp nhận đơn xin nghỉ phép?",
      okType: "primary",
      cancelText: "Hủy",
      okText: "Xác nhận",
      onOk: () => {
        if (record.id) {
          approvalLeaveWorkMutation.mutate(record.id, {
            onSuccess: () => {
              notification.success({
                duration: 1,
                message: "Chấp nhận đơn xin nghỉ phép thành công!",
              });
              if (role) {
                refetchLeaveWork();
              } else {
                refetchLeaveWorkMe();
              }
            },
            onError: () => {
              notification.error({
                duration: 1,
                message: "Chấp nhận đơn xin nghỉ phép thất bại!",
              });
            },
          });
        }
      },
    });
  };

  const columnsAdmin: ColumnsType<ILeaveWork> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, __, index) => <div>{index + 1}</div>,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
      render: (_, record) => <div>{record.user?.fullName}</div>,
    },
    {
      title: "Ảnh",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      width: 80,
      render: (url) => (
        <div>
          <Image src={url ?? "/img/avatar/avatar.jpg"} />
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      render: (_, record) => <div>{record.user?.email}</div>,
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
                if (
                  CheckPermissionEvent(
                    NameEventConstant.PERMISSION_ON_LEAVE_KEY.LIST_ALL_ON_LEAVE
                  )
                ) {
                  handleApprovalLeaveWork(record);
                }
              }}
              icon={<Icon icon="Accept" size={20} />}
            />
            <Button
              className="mr-1"
              onClick={(): void => {
                if (
                  CheckPermissionEvent(
                    NameEventConstant.PERMISSION_ON_LEAVE_KEY.LIST_ALL_ON_LEAVE
                  )
                ) {
                  showModalRefuseLeaveWork();
                  setRefuseWorkLeaveId(record.id);
                }
              }}
              icon={<Icon icon="CloseRed" size={20} />}
            />
          </div>
        ) : (
          <div />
        ),
    },
  ];

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
        {!role ? (
          <Button
            className="btn-primary"
            type="primary"
            onClick={(): void => {
              showModalCreateLeaveWork();
            }}
          >
            Tạo đơn xin nghỉ phép
          </Button>
        ) : null}
      </div>
      {role ? (
        <Table
          columns={columnsAdmin}
          bordered
          dataSource={dataLeaveWork?.data ?? []}
          pagination={{
            total: dataLeaveWork?.meta.totalItems,
            defaultPageSize: 50,
            showSizeChanger: true,
            pageSizeOptions: ["50", "100", "150", "200"],
            onChange: (page, numberPerPage): void => {
              setPageNumber(page);
              setPageSize(numberPerPage);
            },
          }}
        />
      ) : (
        <Table
          columns={columnsUser}
          bordered
          dataSource={dataLeaveWorkMe?.data ?? []}
          pagination={{
            total: dataLeaveWorkMe?.meta.totalItems,
            defaultPageSize: 50,
            showSizeChanger: true,
            pageSizeOptions: ["50", "100", "150", "200"],
            onChange: (page, numberPerPage): void => {
              setPageNumber(page);
              setPageSize(numberPerPage);
            },
          }}
        />
      )}
      <ModalCreateLeaveWork
        isModalVisible={isModalVisible === "modalCreateLeaveWork"}
        toggleModal={toggleModal}
        role={role}
      />
      {refuseWorkLeaveId && (
        <ModalRefuseLeaveWork
          isModalVisible={isModalVisible === "refuseLeaveWork"}
          toggleModal={toggleModal}
          refuseWorkLeaveId={refuseWorkLeaveId}
          role={role}
        />
      )}
    </div>
  );
}
