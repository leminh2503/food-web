import ApiWorkSchedule from "@app/api/ApiWorkSchedule";
import {IMetadata} from "@app/api/Fetcher";
import {ModalCustom} from "@app/components/ModalCustom";
import {IWorkSchedule} from "@app/types";
import {Checkbox, Table} from "antd";
import React, {useState} from "react";
import {useMutation, UseQueryResult} from "react-query";

interface IModalLockScheduleProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  dataWorkingSchedule?: UseQueryResult<
    {data: IWorkSchedule[]; meta: IMetadata},
    unknown
  >;
}

export function ModalLockSchedule({
  isModalVisible,
  toggleModal,
  dataWorkingSchedule,
}: IModalLockScheduleProps): JSX.Element {
  const [scheduleLockId, setScheduleLockId] = useState<number[]>([]);

  const handleCheckLock = (checked: boolean, id: number): void => {
    if (checked) {
      if (!scheduleLockId.includes(id)) {
        setScheduleLockId([...scheduleLockId, id]);
      }
    } else {
      const newArray = scheduleLockId.filter((item) => item !== id);
      setScheduleLockId(newArray);
    }
  };

  const lockWorkSchedule = useMutation(ApiWorkSchedule.updateStateWorkSchedule);

  const okBtn = (): void => {
    toggleModal();
    scheduleLockId.forEach((item) => {
      lockWorkSchedule.mutate(
        {state: 3, id: item},
        {
          onSuccess: () => {
            dataWorkingSchedule?.refetch();
          },
        }
      );
    });
  };

  const renderContentLockModal = (): JSX.Element => {
    return (
      <Table
        columns={[
          {
            title: "Chọn",
            dataIndex: "check",
            key: "check",
            align: "center",
            render: (_, record: IWorkSchedule) => (
              <Checkbox
                onChange={(e): void =>
                  handleCheckLock(e.target.checked, record.id)
                }
              >
                {" "}
              </Checkbox>
            ),
          },
          {
            title: "Tên nhân viên",
            dataIndex: "fullName",
            key: "fullName",
            align: "center",
            render: (_, record: IWorkSchedule) => (
              <span>{record.user?.fullName}</span>
            ),
          },
        ]}
        dataSource={dataWorkingSchedule?.data?.data?.filter(
          (item) => item.state === 2 || item.state === 0
        )}
      />
    );
  };
  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleCancel={toggleModal}
      title="Khóa lịch với nhân viên 🙃"
      content={renderContentLockModal()}
      handleOk={okBtn}
    />
  );
}
