import "./index.scss";
import React, {useEffect, useState} from "react";
import {Button, Modal, notification, Table} from "antd";
import {IWorkType} from "@app/types";
import ApiWorkType from "@app/api/ApiWorkType";
import {useMutation, useQuery} from "react-query";
import Icon from "@app/components/Icon/Icon";
import {ModalCreateWorkType} from "@app/module/work-type/components/ModalCreateWorkType";
import {ModalEditWorkType} from "@app/module/work-type/components/ModalEditWorkType";
import {queryKeys} from "@app/utils/constants/react-query";
import {IMetadata} from "@app/api/Fetcher";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export function WorkType(): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState("");
  const [workType, setWorkType] = useState<IWorkType>();
  const [pageSize, setPageSize] = useState<number>(50);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const showModalCreateWorkType = (): void => {
    setIsModalVisible("modalCreateWorkType");
  };

  const showModalEditWorkType = (): void => {
    setIsModalVisible("modalEditWorkType");
  };

  const toggleModal = (): void => {
    setIsModalVisible("");
  };

  const getWorkType = (): Promise<{data: IWorkType[]; meta: IMetadata}> => {
    return ApiWorkType.getWorkType({
      pageSize: pageSize,
      pageNumber: pageNumber,
      sort: ["name"],
    });
  };
  const {data: dataWorkType, refetch} = useQuery(
    queryKeys.GET_LIST_WORK_TYPE_FOR_SETTING,
    getWorkType
  );

  useEffect(() => {
    refetch();
  }, [pageSize, pageNumber]);

  const deleteWorkTypeMutation = useMutation(ApiWorkType.deleteWorkType);
  const handleDeleteWorkType = (record: IWorkType): void => {
    Modal.confirm({
      title: "Bạn có muốn xóa loại hình làm việc?",
      content: "Loại hình làm việc sẽ bị xóa vĩnh viễn!",
      okType: "primary",
      cancelText: "Huỷ",
      okText: "Xóa",
      onOk: () => {
        if (record.id) {
          deleteWorkTypeMutation.mutate(record.id, {
            onSuccess: () => {
              notification.success({
                duration: 1,
                message: "Xóa loại hình làm việc thành công!",
              });
              refetch();
            },
            onError: () => {
              notification.error({
                duration: 1,
                message: "Xóa loại hình làm việc thất bại!",
              });
            },
          });
        }
      },
    });
  };

  return (
    <div className="container-work-type">
      <div className="mb-5 flex justify-end">
        {CheckPermissionEvent(NameEventConstant.PERMISSION_WORK_TYPE.ADD) && (
          <Button
            className="btn-primary w-48"
            onClick={showModalCreateWorkType}
          >
            Thêm loại hình làm việc
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
            title: "Loại hình làm việc",
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
                {CheckPermissionEvent(
                  NameEventConstant.PERMISSION_WORK_TYPE.UPDATE
                ) && (
                  <Button
                    className="mr-2"
                    icon={<Icon icon="Edit" size={20} color="#0092ff" />}
                    onClick={(): void => {
                      setWorkType(record);
                      showModalEditWorkType();
                    }}
                  />
                )}
                {CheckPermissionEvent(
                  NameEventConstant.PERMISSION_WORK_TYPE.DELETE
                ) && (
                  <Button
                    icon={<Icon icon="Delete" size={20} color="#cb2131" />}
                    onClick={(): void => handleDeleteWorkType(record)}
                  />
                )}
              </>
            ),
          },
        ]}
        dataSource={dataWorkType?.data}
        bordered
        pagination={{
          total: dataWorkType?.meta.totalItems,
          defaultPageSize: 50,
          showSizeChanger: true,
          pageSizeOptions: ["50", "100", "150", "200"],
          onChange: (page, numberPerPage): void => {
            setPageNumber(page);
            setPageSize(numberPerPage);
          },
        }}
      />
      <ModalCreateWorkType
        isModalVisible={isModalVisible === "modalCreateWorkType"}
        toggleModal={toggleModal}
      />
      {workType && (
        <ModalEditWorkType
          isModalVisible={isModalVisible === "modalEditWorkType"}
          toggleModal={toggleModal}
          workType={workType}
        />
      )}
    </div>
  );
}
