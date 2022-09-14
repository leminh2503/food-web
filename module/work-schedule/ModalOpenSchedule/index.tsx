import ApiWorkSchedule from "@app/api/ApiWorkSchedule";
import {ModalCustom} from "@app/components/ModalCustom";
import {IWorkSchedule} from "@app/types";
import {Checkbox, Table} from "antd";
import React, {useState} from "react";
import {useMutation, UseQueryResult} from "react-query";

interface IModalOpenScheduleProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  dataWorkingSchedule?: UseQueryResult<IWorkSchedule[], unknown>;
}

export function ModalOpenSchedule({
  isModalVisible,
  toggleModal,
  dataWorkingSchedule,
}: IModalOpenScheduleProps): JSX.Element {
  const [scheduleOpenId, setScheduleOpenId] = useState<number[]>([]);

  const handleCheck = (checked: boolean, id: number): void => {
    if (checked) {
      if (!scheduleOpenId.includes(id)) {
        setScheduleOpenId([...scheduleOpenId, id]);
      }
    } else {
      const newArray = scheduleOpenId.filter((item) => item !== id);
      setScheduleOpenId(newArray);
    }
  };

  const openWorkSchedule = useMutation(ApiWorkSchedule.updateStateWorkSchedule);

  const okBtn = (): void => {
    toggleModal();
    scheduleOpenId.forEach((item) => {
      openWorkSchedule.mutate(
        {state: 2, id: item},
        {
          onSuccess: () => {
            dataWorkingSchedule?.refetch();
          },
        }
      );
    });
  };
  const renderContent = (): JSX.Element => {
    return (
      <Table
        columns={[
          {
            title: "Chọn",
            dataIndex: "check",
            key: "check",
            align: "center",
            render: (_, record) => (
              <Checkbox
                onChange={(e): void => handleCheck(e.target.checked, record.id)}
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
        dataSource={dataWorkingSchedule?.data?.filter(
          (item) => item.state === 3
        )}
      />
    );
  };
  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleCancel={toggleModal}
      title="Mở lịch với nhân viên"
      content={renderContent()}
      handleOk={okBtn}
    />
  );
}
