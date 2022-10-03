import moment from "moment";
import React, {useEffect, useState} from "react";
import {FilterWorkSchedule} from "../FilterWorkSchedule";
import Table, {ColumnType} from "antd/lib/table";
import {IUserLogin, IWorkSchedule} from "@app/types";
import {EyeOutlined} from "@ant-design/icons";
import ApiUser from "@app/api/ApiUser";
import {useQuery} from "react-query";
import ApiWorkSchedule from "@app/api/ApiWorkSchedule";
import {Button, Modal, Pagination, PaginationProps} from "antd";
import {ModalWorkSchedule} from "../ModalWorkSchedule";
import "../index.scss";
import {ModalOpenSchedule} from "../ModalOpenSchedule";
import {ModalLockSchedule} from "../ModalLockSchedule";
import {IMetadata} from "@app/api/Fetcher";
import {queryKeys} from "@app/utils/constants/react-query";

export function AdminWorkSchedule(): JSX.Element {
  const [filterYear, setFilterYear] = useState<number>(moment().year());
  const [filterMonth, setFilterMonth] = useState<number>(moment().month() + 1);
  const [filterState, setFilterState] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [isModalOpenVisible, setIsModalOpenVisible] = useState<boolean>(false);
  const [isModalLockVisible, setIsModalLockVisible] = useState<boolean>(false);
  const [userId, setUserId] = useState<number[]>([]);
  const [recordData, setRecordData] = useState<IWorkSchedule>();
  const [page, setPage] = useState({
    pageCurrent: 1,
    pageSize: 10,
  });

  const renderModal = (record: IWorkSchedule): void => {
    setOpen(true);
    setRecordData(record);
  };

  const toggleModalOpen = (): void => {
    setIsModalOpenVisible(!isModalOpenVisible);
  };

  const toggleModalLock = (): void => {
    setIsModalLockVisible(!isModalLockVisible);
  };

  const columnAdmin: ColumnType<IWorkSchedule>[] = [
    {
      title: "Tên nhân viên",
      dataIndex: "user",
      key: "user",
      align: "center",
      render: (user) => <span>{user.fullName}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) =>
        record.state === 1 ? (
          <p className="not_yet_register">Chưa đăng ký</p>
        ) : record.state === 3 ? (
          <p className="pending_approval">Đang khóa</p>
        ) : (
          <p className="done_register">Đã đăng ký</p>
        ),
    },
    {
      title: "Hành động",
      dataIndex: "workingDay",
      key: "workingDay",
      align: "center",
      render: (_, record) => (
        <EyeOutlined onClick={() => renderModal(record)} className="eye_icon" />
      ),
    },
  ];

  const getUserAccount = (): Promise<{data: IUserLogin[]; meta: IMetadata}> => {
    return ApiUser.getUserAccount({
      pageSize: 100,
      pageNumber: 1,
      filter: {workType: filterState === 0 ? "" : filterState},
    });
  };

  const {data: dataUserAccount, refetch: refetchUserAccount} = useQuery(
    queryKeys.GET_LIST_ACCOUNT,
    getUserAccount
  );

  const getAllWorkSchedule = (): Promise<{
    data: IWorkSchedule[];
    meta: IMetadata;
  }> => {
    return ApiWorkSchedule.getAllWorkSchedule({
      pageSize: page.pageSize,
      pageNumber: page.pageCurrent,
      filter: {createdAt_MONTH: filterMonth, createdAt_YEAR: filterYear},
    });
  };

  const dataAllWorkSchedule = useQuery(
    queryKeys.GET_ALL_WORK_SCHEDULE,
    getAllWorkSchedule
  );
  useEffect(() => {
    dataAllWorkSchedule.refetch();
  }, [filterMonth, filterYear, page]);

  useEffect(() => {
    refetchUserAccount();
  }, [filterState]);

  useEffect(() => {
    const userIdArray: number[] = [];
    dataUserAccount?.data.forEach((item) => {
      if (item.id) {
        userIdArray.push(item.id);
      }
    });
    setUserId(userIdArray);
  }, [dataUserAccount?.data]);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setPage({
      pageCurrent: current,
      pageSize: pageSize,
    });
  };

  return (
    <div className="admin_component">
      <h6>DANH SÁCH ĐĂNG KÝ LỊCH LÀM VIỆC</h6>
      <div className="flex justify-between mt-5">
        <FilterWorkSchedule
          visible
          setFilterState={setFilterState}
          setFilterMonth={setFilterMonth}
          setFilterYear={setFilterYear}
        />
        <div>
          <Button
            onClick={() => setIsModalOpenVisible(true)}
            className="open_calender mr-5"
          >
            Mở lịch
          </Button>

          <Button
            onClick={() => setIsModalLockVisible(true)}
            className="close_calender"
          >
            Khóa lịch
          </Button>
        </div>
      </div>
      <Table
        className="mt-5"
        columns={columnAdmin}
        bordered
        pagination={false}
        dataSource={dataAllWorkSchedule?.data?.data?.filter(
          (item) => item.user?.id && userId.includes(item.user?.id)
        )}
      />
      <Pagination
        className="mt-3 float-right"
        showSizeChanger
        onChange={onShowSizeChange}
        pageSizeOptions={[10, 20, 50, 100]}
        defaultCurrent={1}
        current={page.pageCurrent}
        total={dataAllWorkSchedule.data?.meta.totalItems || 1}
      />
      <Modal
        zIndex={2000}
        title={`Đăng ký lịch làm - ${recordData?.user?.fullName} 🧑`}
        centered
        visible={open}
        onCancel={() => setOpen(false)}
        width={1100}
        footer={null}
      >
        <ModalWorkSchedule dataRecord={recordData?.workingDay} />
      </Modal>
      <ModalOpenSchedule
        isModalVisible={isModalOpenVisible}
        toggleModal={toggleModalOpen}
        dataWorkingSchedule={dataAllWorkSchedule}
      />
      <ModalLockSchedule
        isModalVisible={isModalLockVisible}
        toggleModal={toggleModalLock}
        dataWorkingSchedule={dataAllWorkSchedule}
      />
    </div>
  );
}
