import "./index.scss";
import React, {useState} from "react";
import ApiUser from "@app/api/ApiUser";
import {IFamilyCircumstance, TypeOfAction} from "@app/types";
import {Button, Modal, notification, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ModalAddFamily} from "@app/module/account-manager/ModalAddFamily";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {queryKeys} from "@app/utils/constants/react-query";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleCloseModalFamily: () => void;
  idUser: number;
  accountId: number | undefined;
}

export function ModalFamilyCircumstance(props: ModalInfoProps): JSX.Element {
  const {isModalVisible, handleCloseModalFamily, idUser, accountId} = props;
  const [isToggleModal, setIsToggleModal] = useState(false);

  const queryClient = useQueryClient();

  const defaultValuesDetail = {
    id: null,
    userId: idUser,
    fullName: "",
    personId: null,
    dateOfBirth: null,
    relationship: "",
    phoneNumber: "",
  };

  const [dataDetail, setDataDetail] =
    useState<IFamilyCircumstance>(defaultValuesDetail);

  // API get family
  const getDataFamily = (): Promise<IFamilyCircumstance[]> => {
    return ApiUser.getDataFamilyOfAccount({filter: {userId: accountId + ""}});
  };

  const {
    data: dataFamily,
    refetch,
    isFetching,
  } = useQuery(queryKeys.GET_LIST_DATA_FAMILY, getDataFamily);

  const handleConfirmModal = (
    data: IFamilyCircumstance,
    type: TypeOfAction
  ): void => {
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

  const handleCancelModal = (): void => {
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
        queryKey: queryKeys.GET_LIST_ACCOUNT,
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
        queryKey: queryKeys.GET_LIST_ACCOUNT,
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
      refetch();
      queryClient.refetchQueries({
        queryKey: queryKeys.GET_LIST_ACCOUNT,
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
      dataIndex: "personId",
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
        {CheckPermissionEvent(
          NameEventConstant.PERMISSION_USER_KEY.ADD_USER_DEPENDENTS
        ) && (
          <Button
            style={{backgroundColor: "#1890FF", color: "#fff"}}
            className="mb-4 float-right"
            onClick={(): void => {
              setDataDetail(defaultValuesDetail);
              setIsToggleModal(true);
            }}
          >
            Thêm người phụ thuộc
          </Button>
        )}
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={dataFamily || []}
          bordered
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: (): void => {
                if (
                  CheckPermissionEvent(
                    NameEventConstant.PERMISSION_USER_KEY.UPDATE_USER_DEPENDENTS
                  )
                ) {
                  setIsToggleModal(true);
                  setDataDetail(record);
                }
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
