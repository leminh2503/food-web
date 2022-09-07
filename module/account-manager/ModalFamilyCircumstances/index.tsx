import "./index.scss";
import React, {useState} from "react";
import {IRegisterAccountBody} from "@app/api/ApiUser";
import {IFamilyCircumstance} from "@app/types";
import {Button, Modal, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ModalAddFamily} from "@app/module/account-manager/ModalAddFamily";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleConfirmAddEmployee: (data: IRegisterAccountBody) => void;
  handleCloseModalFamily: () => void;
  data: IFamilyCircumstance[];
}

export function ModalFamilyCircumstance(props: ModalInfoProps): JSX.Element {
  const {
    isModalVisible,
    handleConfirmAddEmployee,
    handleCloseModalFamily,
    data,
  } = props;

  const [isToggleModal, setIsToggleModal] = useState(false);

  const columns: ColumnsType<IFamilyCircumstance> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Họ & Tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "CMND/CCCD",
      dataIndex: "IDCode",
      key: "IDCode",
      align: "center",
    },
    {
      title: "Quan hệ",
      dataIndex: "relationship",
      key: "relationship",
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <Button
            className="mr-2"
            onClick={(): void => {
              console.log(123);
            }}
            icon={<EditOutlined style={{color: "#1890FF"}} />}
          />
          <Button
            className=""
            onClick={(): void => {
              console.log(123);
            }}
            icon={<DeleteOutlined style={{color: "red"}} />}
          />
        </>
      ),
    },
  ];

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info-family">
        <Button
          style={{backgroundColor: "#1890FF", color: "#fff"}}
          className="mb-4 float-right"
          onClick={() => setIsToggleModal(true)}
        >
          Thêm người phụ thuộc
        </Button>
        <Table
          columns={columns}
          dataSource={data || []}
          bordered
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: () => {
                // setDataDetail(record);
                // setIsModalVisible(true);
                console.log(123);
              },
            };
          }}
        />
        <ModalAddFamily
          listPositionConvert={[]}
          listWorkTypeConvert={[]}
          isModalVisible={isToggleModal}
          handleConfirmAddEmployee={handleConfirmAddEmployee}
          handleCancelAddEmployee={() => setIsToggleModal(false)}
        />
      </div>
    );
  };

  return (
    <Modal
      centered
      title="Danh sách số người phụ thuộc"
      visible={isModalVisible}
      onCancel={handleCloseModalFamily}
      className="modal-ant modal-family-circumstances"
      footer={null}
    >
      {renderContent()}
    </Modal>
  );
}
