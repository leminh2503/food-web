import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import moment from "moment";
import {IEvent} from "@app/types";
import {useMutation, useQuery, useQueryClient} from "react-query";
import ApiEvent from "@app/api/ApiEvent";
import {Modal, notification, Table} from "antd";
import {queryKeys} from "@app/utils/constants/react-query";
import {IMetadata} from "@app/api/Fetcher";

interface ModalDeleteEventProps {
  isModalVisible: boolean;
  toggleModal: () => void;
}

export function ModalDeleteEvent({
  isModalVisible,
  toggleModal,
}: ModalDeleteEventProps): JSX.Element {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageNumber: 1,
  });

  const getEventForDelete = (): Promise<{data: IEvent[]; meta: IMetadata}> => {
    return ApiEvent.getEvent({
      pageSize: pagination.pageSize,
      pageNumber: pagination.pageNumber,
      sort: ["-startDate"],
    });
  };

  const {data: dataEventForDelete, refetch} = useQuery(
    queryKeys.GET_LIST_EVENT_FOR_DELETE,
    getEventForDelete
  );

  useEffect(() => {
    refetch();
  }, [pagination]);

  useEffect(() => {
    setPagination({
      pageSize: 5,
      pageNumber: 1,
    });
    refetch();
  }, [isModalVisible]);

  const deleteEventMutation = useMutation(ApiEvent.deleteEvent);
  const handleDeleteEvent = (id: number): void => {
    deleteEventMutation.mutate(id, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Xóa sự kiện thành công!",
        });
        toggleModal();
        refetch();
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_LIST_EVENT,
        });
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Xóa sự kiện thất bại!",
        });
      },
    });
  };

  const handleConfirmDeleteEvent = (id: number): void => {
    Modal.confirm({
      title: "Bạn muốn xóa sự kiện?",
      content: "Sự kiện sẽ bị xóa vĩnh viễn!",
      okType: "primary",
      cancelText: "Hủy",
      okText: "Xác nhận",
      onOk: () => {
        handleDeleteEvent(id);
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <Table
        columns={[
          {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            render: (_, record, index) => <div>{index + 1}</div>,
          },
          {
            title: "Ngày bắt đầu",
            dataIndex: "startDate",
            key: "startDate",
            align: "center",
            render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
          },
          {
            title: "Ngày kết thúc",
            dataIndex: "endDate",
            key: "endDate",
            align: "center",
            render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
          },
          {
            title: "Tiêu đề",
            dataIndex: "title",
            key: "title",
            align: "center",
          },
          {
            title: "Trạng thái",
            dataIndex: "state",
            key: "state",
            align: "center",
            render: (_, record) => (
              <button
                className="btn-primary"
                type="button"
                onClick={(): void => {
                  if (record.id) {
                    handleConfirmDeleteEvent(record.id);
                  }
                }}
              >
                Delete
              </button>
            ),
          },
        ]}
        dataSource={dataEventForDelete?.data}
        bordered
        pagination={{
          total: dataEventForDelete?.meta.totalItems,
          defaultPageSize: 5,
          onChange: (page, numberPerPage): void => {
            setPagination((prev) => ({...prev, pageNumber: page}));
          },
        }}
      />
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleCancel={toggleModal}
      title="Xóa sự kiện"
      content={renderContent()}
      width="1000px"
      footer={null}
    />
  );
}
