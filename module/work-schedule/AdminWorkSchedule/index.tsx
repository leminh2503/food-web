import moment from "moment";
import React, {useEffect, useState} from "react";
import {FilterWorkSchedule} from "../FilterWorkSchedule";
import Table, {ColumnType} from "antd/lib/table";
import {IUserLogin, IWorkingDaySchedule, IWorkSchedule} from "@app/types";
import {EyeOutlined} from "@ant-design/icons";
import ApiUser from "@app/api/ApiUser";
import {useMutation, useQuery} from "react-query";
import ApiWorkSchedule from "@app/api/ApiWorkSchedule";
import {Button, Modal} from "antd";
import {ModalWorkSchedule} from "../ModalWorkSchedule";
import "../index.scss";
import {ModalOpenSchedule} from "../ModalOpenSchedule";
import {ModalLockSchedule} from "../ModalLockSchedule";
import {IMetadata} from "@app/api/Fetcher";
import {queryKeys} from "@app/utils/constants/react-query";

interface RecordType {
  id: number;
  fullName?: string;
  state?: number;
  workingDay?: IWorkingDaySchedule[];
}

export function AdminWorkSchedule(): JSX.Element {
  const [filterYear, setFilterYear] = useState<number>(moment().year());
  const [filterMonth, setFilterMonth] = useState<number>(moment().month() + 1);
  const [filterState, setFilterState] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [isModalOpenVisible, setIsModalOpenVisible] = useState<boolean>(false);
  const [isModalLockVisible, setIsModalLockVisible] = useState<boolean>(false);

  const [recordType, setRecordType] = useState<RecordType[]>([]);
  const [recordData, setRecordData] = useState<RecordType>();

  const renderModal = (record: RecordType): void => {
    setOpen(true);
    setRecordData(record);
  };

  const toggleModalOpen = (): void => {
    setIsModalOpenVisible(!isModalOpenVisible);
  };

  const toggleModalLock = (): void => {
    setIsModalLockVisible(!isModalLockVisible);
  };

  const columnAdmin: ColumnType<RecordType>[] = [
    {
      title: "Tên nhân viên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) =>
        record.workingDay?.length === 0 ? (
          <p className="not_yet_register">Chưa đăng ký</p>
        ) : record.state === 0 ? (
          <p className="pending_approval">Đang chờ duyệt</p>
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
    {
      title: "Duyệt",
      dataIndex: "approval",
      key: "approval",
      align: "center",
      render: (_, record): JSX.Element => {
        return record.state === 0 ? (
          <span
            role="button"
            tabIndex={0}
            onClick={(): void => approvalBtn(record?.id)}
            className="approval"
          >
            Duyệt
          </span>
        ) : (
          <div> </div>
        );
      },
    },
  ];

  const getUserAccount = (): Promise<{data: IUserLogin[]; meta: IMetadata}> => {
    return ApiUser.getUserAccount({
      pageSize: 30,
      pageNumber: 1,
      filter: {workType: filterState === 0 ? "" : filterState},
    });
  };

  const {data: dataUserAccount, refetch: refetchUserAccount} = useQuery(
    queryKeys.GET_LIST_ACCOUNT,
    getUserAccount
  );

  const getAllWorkSchedule = (): Promise<IWorkSchedule[]> => {
    return ApiWorkSchedule.getAllWorkSchedule({
      pageSize: 30,
      pageNumber: 1,
      filter: {createdAt_MONTH: filterMonth, createdAt_YEAR: filterYear},
    });
  };

  const dataAllWorkSchedule = useQuery(
    queryKeys.GET_ALL_WORK_SCHEDULE,
    getAllWorkSchedule
  );

  const approval = useMutation(ApiWorkSchedule.updateStateWorkSchedule);

  const approvalBtn = (id: number): void => {
    approval.mutate(
      {id: id, state: 2},
      {onSuccess: () => dataAllWorkSchedule.refetch()}
    );
  };
  console.log(dataAllWorkSchedule);

  useEffect(() => {
    dataAllWorkSchedule.refetch();
  }, [filterMonth, filterYear]);

  useEffect(() => {
    refetchUserAccount();
  }, [filterState]);

  useEffect(() => {
    const records: RecordType[] = [];
    dataUserAccount?.data.forEach((item) => {
      if (dataAllWorkSchedule?.data) {
        const getWorkSchedule = (): IWorkSchedule => {
          const workScheduleData: IWorkSchedule[] = dataAllWorkSchedule?.data;
          const index = workScheduleData.findIndex(
            (work) => work.user?.id === item.id
          );
          if (index !== -1) {
            return workScheduleData[index];
          }
          return {
            id: 0,
            workingDay: [],
          };
        };
        const recordItem = {
          id: getWorkSchedule().id,
          state: getWorkSchedule().state,
          fullName: item.fullName,
          workingDay: getWorkSchedule().workingDay,
        };
        records.push(recordItem);
      }
    });
    console.log(records);
    setRecordType(records);
  }, [dataUserAccount?.data, dataAllWorkSchedule?.data]);

  return (
    <div className="admin_component">
      <h6>DANH SÁCH ĐĂNG KÝ LỊCH LÀM VIỆC</h6>
      <div className="flex justify-between mt-5">
        <FilterWorkSchedule
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
        dataSource={recordType}
      />
      <Modal
        zIndex={2000}
        title={`Đăng ký lịch làm - ${recordData?.fullName}`}
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
