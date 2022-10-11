import ApiWorkSchedule from "@app/api/ApiWorkSchedule";
import {IMetadata} from "@app/api/Fetcher";
import {ModalCustom} from "@app/components/ModalCustom";
import {IWorkSchedule} from "@app/types";
import {Checkbox, Table} from "antd";
import React, {useState} from "react";
import {useMutation, UseQueryResult} from "react-query";

interface IModalOpenScheduleProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  dataWorkingSchedule?: UseQueryResult<
    {data: IWorkSchedule[]; meta: IMetadata},
    unknown
  >;
}

export function ModalOpenSchedule({
  isModalVisible,
  toggleModal,
  dataWorkingSchedule,
}: IModalOpenScheduleProps): JSX.Element {
  const [scheduleOpenId, setScheduleOpenId] = useState<number[]>([]);

  const handleCheckOpen = (checked: boolean, id: number): void => {
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
  const renderContentOpenModal = (): JSX.Element => {
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
                onChange={(e): void =>
                  handleCheckOpen(e.target.checked, record.id)
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
          (item) => item.state === 3
        )}
      />
    );
  };
  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleCancel={toggleModal}
      title="Mở lịch với nhân viên 😉"
      content={renderContentOpenModal()}
      handleOk={okBtn}
    />
  );
}
