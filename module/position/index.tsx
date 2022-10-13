import "./index.scss";
import React, {useEffect, useState} from "react";
import {Button, Modal, notification, Table} from "antd";
import {IPosition} from "@app/types";
import ApiPosition from "@app/api/ApiPosition";
import {useMutation, useQuery} from "react-query";
import Icon from "@app/components/Icon/Icon";
import {ModalCreatePosition} from "@app/module/position/components/ModalCreatePosition";
import {ModalEditPosition} from "@app/module/position/components/ModalEditPosition";
import {queryKeys} from "@app/utils/constants/react-query";
import {IMetadata} from "@app/api/Fetcher";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export function Position(): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState("");
  const [position, setPosition] = useState<IPosition>();
  const [pageSize, setPageSize] = useState<number>(100);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const showModalCreatePosition = (): void => {
    setIsModalVisible("modalCreatePosition");
  };

  const showModalEditPosition = (): void => {
    setIsModalVisible("modalEditPosition");
  };

  const toggleModal = (): void => {
    setIsModalVisible("");
  };

  const getPosition = (): Promise<{data: IPosition[]; meta: IMetadata}> => {
    return ApiPosition.getPosition({
      pageSize: pageSize,
      pageNumber: pageNumber,
      sort: ["name"],
    });
  };
  const {
    data: dataPosition,
    refetch,
    isLoading,
  } = useQuery(queryKeys.GET_LIST_POSITION_FOR_SETTING, getPosition);

  useEffect(() => {
    refetch();
  }, [pageSize, pageNumber]);

  const deletePositionMutation = useMutation(ApiPosition.deletePosition);
  const handleDeletePosition = (record: IPosition): void => {
    Modal.confirm({
      title: "Bạn có muốn xóa chức vụ?",
      content: "Chức vụ sẽ bị xóa vĩnh viễn!",
      okType: "primary",
      cancelText: "Huỷ",
      okText: "Xóa",
      onOk: () => {
        if (record.id) {
          deletePositionMutation.mutate(record.id, {
            onSuccess: () => {
              notification.success({
                duration: 1,
                message: "Xóa chức vụ thành công!",
              });
              refetch();
            },
            onError: () => {
              notification.error({
                duration: 1,
                message: "Xóa chức vụ thất bại!",
              });
            },
          });
        }
      },
    });
  };

  return (
    <div className="container-position">
      <div className="mb-5 flex justify-end">
        {CheckPermissionEvent(
          NameEventConstant.PERMISSION_POSITION_KEY.ADD
        ) && (
          <Button
            className="btn-primary w-48"
            onClick={showModalCreatePosition}
          >
            Thêm chức vụ
          </Button>
        )}
      </div>
      <Table
        columns={[
          {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            width: 100,
            render: (_, __, index) => <div>{index + 1}</div>,
          },
          {
            title: "Chức vụ",
            dataIndex: "name",
            key: "name",
            align: "center",
          },
          {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            align: "center",
          },
          {
            title: "Hành động",
            align: "center",
            width: 200,
            render: (_, record) => (
              <>
                <Button
                  className="mr-2"
                  icon={<Icon icon="Edit" size={20} color="#0092ff" />}
                  onClick={(): void => {
                    if (
                      CheckPermissionEvent(
                        NameEventConstant.PERMISSION_POSITION_KEY.UPDATE
                      )
                    ) {
                      setPosition(record);
                      showModalEditPosition();
                    }
                  }}
                />
                <Button
                  icon={<Icon icon="Delete" size={20} color="#cb2131" />}
                  onClick={(): void => {
                    if (
                      CheckPermissionEvent(
                        NameEventConstant.PERMISSION_POSITION_KEY.DELETE
                      )
                    ) {
                      handleDeletePosition(record);
                    }
                  }}
                />
              </>
            ),
          },
        ]}
        dataSource={dataPosition?.data}
        bordered
        loading={isLoading}
        pagination={{
          total: dataPosition?.meta.totalItems,
          defaultPageSize: 100,
          showSizeChanger: true,
          pageSizeOptions: ["50", "100"],
          onChange: (page, numberPerPage): void => {
            setPageNumber(page);
            setPageSize(numberPerPage);
          },
        }}
      />
      <ModalCreatePosition
        isModalVisible={isModalVisible === "modalCreatePosition"}
        toggleModal={toggleModal}
      />
      {position && (
        <ModalEditPosition
          isModalVisible={isModalVisible === "modalEditPosition"}
          toggleModal={toggleModal}
          position={position}
        />
      )}
    </div>
  );
}
