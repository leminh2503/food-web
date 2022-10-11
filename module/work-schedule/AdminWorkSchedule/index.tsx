import moment from "moment";
import React, {useEffect, useState} from "react";
import {FilterWorkSchedule} from "../FilterWorkSchedule";
import Table, {ColumnType} from "antd/lib/table";
import {IWorkSchedule} from "@app/types";
import {EyeOutlined, FileExcelFilled} from "@ant-design/icons";
import {useQuery} from "react-query";
import ApiWorkSchedule from "@app/api/ApiWorkSchedule";
import {Button, Modal, Pagination, PaginationProps, Tooltip} from "antd";
import {ModalWorkSchedule} from "../ModalWorkSchedule";
import "../index.scss";
import {ModalOpenSchedule} from "../ModalOpenSchedule";
import {ModalLockSchedule} from "../ModalLockSchedule";
import {IMetadata} from "@app/api/Fetcher";
import {queryKeys} from "@app/utils/constants/react-query";
import fileDownload from "js-file-download";

export function AdminWorkSchedule(): JSX.Element {
  const [filterYear, setFilterYear] = useState<number>(moment().year());
  const [filterMonth, setFilterMonth] = useState<number>(moment().month() + 1);
  const [filterState, setFilterState] = useState<number>(-1);
  const [open, setOpen] = useState<boolean>(false);
  const [isModalOpenVisible, setIsModalOpenVisible] = useState<boolean>(false);
  const [isModalLockVisible, setIsModalLockVisible] = useState<boolean>(false);
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

  const getAllWorkSchedule = (): Promise<{
    data: IWorkSchedule[];
    meta: IMetadata;
  }> => {
    return ApiWorkSchedule.getAllWorkSchedule({
      pageSize: page.pageSize,
      pageNumber: page.pageCurrent,
      filter: {
        createdAt_MONTH: filterMonth,
        createdAt_YEAR: filterYear,
        state: filterState === -1 ? "" : filterState,
      },
    });
  };

  const dataAllWorkSchedule = useQuery(
    queryKeys.GET_ALL_WORK_SCHEDULE,
    getAllWorkSchedule
  );
  useEffect(() => {
    dataAllWorkSchedule.refetch();
  }, [filterMonth, filterYear, page, filterState]);

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setPage({
      pageCurrent: current,
      pageSize: pageSize,
    });
  };

  const exportExcelFile = async (): Promise<any> => {
    const response = await ApiWorkSchedule.exportWorkSchedule({
      filter: {
        createdAt_MONTH: filterMonth,
        createdAt_YEAR: filterYear,
        state: filterState === -1 ? "" : filterState,
      },
    });
    fileDownload(
      response.data,
      response.headers["x-file-name"] || "all-work-schedule.xlsx"
    );
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
        <div className="flex ">
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
          {dataAllWorkSchedule?.data?.data.length !== 0 ? (
            <Tooltip title="Xuất excel" placement="top">
              <FileExcelFilled
                onClick={exportExcelFile}
                className="excel_icon ml-4 mt-0.5"
              />
            </Tooltip>
          ) : (
            " "
          )}
        </div>
      </div>
      <Table
        className="mt-5"
        columns={columnAdmin}
        bordered
        pagination={false}
        dataSource={dataAllWorkSchedule?.data?.data}
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
