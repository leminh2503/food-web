import "./index.scss";
import React, {useState} from "react";
import ApiUser from "@app/api/ApiUser";
import {IFamilyCircumstance, TypeOfAction} from "@app/types";
import {Button, Modal, notification, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ModalAddFamily} from "@app/module/account-manager/ModalAddFamily";
import {useMutation, useQuery, useQueryClient} from "react-query";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleCloseModalFamily: () => void;
  idUser: number;
  accountId: string | undefined;
}

export function ModalFamilyCircumstance(props: ModalInfoProps): JSX.Element {
  const {isModalVisible, handleCloseModalFamily, idUser, accountId} = props;
  console.log(accountId);

  const [isToggleModal, setIsToggleModal] = useState(false);

  const queryClient = useQueryClient();

  const defaultValuesDetail = {
    id: null,
    userId: idUser,
    fullName: "",
    IDCode: null,
    yearOfBirth: "",
    relationship: "",
    phoneNumber: "",
  };

  const [dataDetail, setDataDetail] =
    useState<IFamilyCircumstance>(defaultValuesDetail);

  // API get family
  const getDataFamily = (): Promise<IFamilyCircumstance[]> => {
    return ApiUser.getDataFamilyOfAccount({filter: {userId: accountId}});
  };

  const {data: dataFamily, refetch} = useQuery(
    "getListDataFamily",
    getDataFamily
  );

  const handleConfirmModal = (
    data: IFamilyCircumstance,
    type: TypeOfAction
  ) => {
    Modal.confirm({
      title: "Xác nhận tạo người phụ thuộc?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        // eslint-disable-next-line no-unused-expressions
        type === TypeOfAction.ADD
          ? handleAddNewFamily(data)
          : handleEditFamily(data);
        setIsToggleModal(false);
      },
    });
  };

  const handleCancelModal = () => {
    setIsToggleModal(false);
  };

  const addNewFamily = useMutation(ApiUser.addNewFamilyCircumstance, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Thêm thành công`,
      });
      refetch();
      queryClient.refetchQueries({
        queryKey: "listUserAccount",
      });
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Thêm thất bại`,
      });
    },
  });

  const handleAddNewFamily = (data: IFamilyCircumstance): void => {
    addNewFamily.mutate(data);
  };

  const editFamily = useMutation(ApiUser.updateFamilyCircumstance, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Sửa thành công`,
      });
      refetch();
      queryClient.refetchQueries({
        queryKey: "listUserAccount",
      });
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Sửa thất bại`,
      });
    },
  });

  const handleEditFamily = (data: IFamilyCircumstance): void => {
    editFamily.mutate(data);
  };

  const deleteFamily = useMutation(ApiUser.deleteFamilyCircumstance, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Xóa thành công`,
      });
      // dataUserAccount.refetch();
      queryClient.refetchQueries({
        queryKey: "listUserAccount",
      });
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Xóa thất bại`,
      });
    },
  });

  const handleDeleteFamily = (id: number): void => {
    Modal.confirm({
      title: "Xác nhận xóa người phụ thuộc?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        deleteFamily.mutate(id);
        setIsToggleModal(false);
      },
      onCancel: () => setIsToggleModal(false),
    });
  };

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
              setIsToggleModal(true);
              setDataDetail(record);
            }}
            icon={<EditOutlined style={{color: "#1890FF"}} />}
          />
          <Button
            className=""
            onClick={(): void => {
              handleDeleteFamily(record?.id || -1);
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
          onClick={() => {
            setDataDetail(defaultValuesDetail);
            setIsToggleModal(true);
          }}
        >
          Thêm người phụ thuộc
        </Button>
        <Table
          columns={columns}
          dataSource={dataFamily || []}
          bordered
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: () => {
                setIsToggleModal(true);
                setDataDetail(record);
              },
            };
          }}
        />
        <ModalAddFamily
          isModalVisible={isToggleModal}
          handleConfirmModal={handleConfirmModal}
          handleCancelModal={handleCancelModal}
          idUser={idUser}
          dataFamily={dataDetail}
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
