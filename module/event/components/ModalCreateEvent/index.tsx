import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import moment from "moment";
import {useMutation, useQueryClient} from "react-query";
import ApiEvent, {IEventBody} from "@app/api/ApiEvent";
import {queryKeys} from "@app/utils/constants/react-query";
import {Button, DatePicker, Form, Input, notification} from "antd";
import {defaultValidateMessages, layout} from "@app/validate/user";

interface ModalCreateEventProps {
  isModalVisible: boolean;
  toggleModal: () => void;
}

export function ModalCreateEvent({
  isModalVisible,
  toggleModal,
}: ModalCreateEventProps): JSX.Element {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [date, setDate] = useState({
    startDate: moment().format("DD/MM/YYYY"),
    endDate: moment().format("DD/MM/YYYY"),
  });

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      startDate: moment(),
      endDate: moment(),
    });
    setDate({
      startDate: moment().format("DD/MM/YYYY"),
      endDate: moment().format("DD/MM/YYYY"),
    });
  }, [isModalVisible]);

  const onFinish = (fieldsValue: IEventBody): void => {
    const data = {
      startDate: moment(fieldsValue.startDate).format("YYYY-MM-DD"),
      endDate: moment(fieldsValue.endDate).format("YYYY-MM-DD"),
      title: fieldsValue.title,
      content: fieldsValue.content,
    };
    handleCreateLeaveWork(data);
  };

  const createEventMutation = useMutation(ApiEvent.createEvent);
  const handleCreateLeaveWork = (data: IEventBody): void => {
    createEventMutation.mutate(data, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Thêm sự kiên thành công!",
        });
        toggleModal();
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_LIST_EVENT,
        });
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Thêm sự kiện thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-create-event-form">
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{required: true}]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(value, dateString): void => {
                setDate((prev) => ({
                  ...prev,
                  startDate:
                    dateString === ""
                      ? moment().format("DD/MM/YYYY")
                      : dateString,
                }));
              }}
              disabledDate={(d): boolean => {
                if (date.endDate !== moment().format("DD/MM/YYYY")) {
                  return (
                    d.isBefore() ||
                    moment(d.format("DD/MM/YYYY"), "DD/MM/YYYY") >
                      moment(date.endDate, "DD/MM/YYYY")
                  );
                }
                return d.isBefore();
              }}
            />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{required: true}]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(value, dateString): void => {
                setDate((prev) => ({
                  ...prev,
                  endDate:
                    dateString === ""
                      ? moment().format("DD/MM/YYYY")
                      : dateString,
                }));
              }}
              disabledDate={(d): boolean => {
                return (
                  d.isBefore() ||
                  d.isBefore(moment(date.startDate, "DD/MM/YYYY"))
                );
              }}
            />
          </Form.Item>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^(?![_|-])[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ0-9\s|_|-]+$/,
                message: "Tiêu đề không được chứa ký tự đặc biệt!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ0-9\s]/,
                message: "Nội dung không được bắt đầu bởi ký tự đặc biệt!",
              },
            ]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item>
            <div className="footer-modal">
              <Button
                className="button-cancel mr-3"
                type="primary"
                onClick={toggleModal}
              >
                Hủy
              </Button>
              <Button
                className="button-confirm"
                type="primary"
                htmlType="submit"
              >
                Xác Nhận
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleCancel={toggleModal}
      title="Thêm sự kiện"
      content={renderContent()}
      footer={null}
    />
  );
}
