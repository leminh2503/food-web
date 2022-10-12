import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect} from "react";
import ApiLeaveWork, {
  IDaysAllowedLeave,
  ILeaveWorkBody,
} from "@app/api/ApiLeaveWork";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {Button, DatePicker, Form, InputNumber, notification, Input} from "antd";
import moment from "moment";
import {queryKeys} from "@app/utils/constants/react-query";
import {defaultValidateMessages, layout} from "@app/validate/user";

interface ModalCreateLeaveWorkProps {
  isModalVisible: boolean;
  toggleModal: () => void;
}

export function ModalCreateLeaveWork({
  isModalVisible,
  toggleModal,
}: ModalCreateLeaveWorkProps): JSX.Element {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const getDaysAllowedLeave = (): Promise<IDaysAllowedLeave> => {
    return ApiLeaveWork.getDaysAllowedLeave();
  };
  const {data: daysAllowedLeave} = useQuery(
    queryKeys.GET_DAY_ALLOWS_LEAVE,
    getDaysAllowedLeave
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      startDate: moment(),
      quantity: 0.5,
    });
  }, [isModalVisible]);

  const onFinish = (fieldsValue: ILeaveWorkBody): void => {
    const data = {
      startDate: fieldsValue.startDate,
      quantity: fieldsValue.quantity,
      reason: fieldsValue.reason,
    };
    handleCreateLeaveWork(data);
  };

  const createLeaveWorkMutation = useMutation(ApiLeaveWork.createLeaveWork);
  const handleCreateLeaveWork = (data: ILeaveWorkBody): void => {
    createLeaveWorkMutation.mutate(data, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Tạo đơn xin nghỉ phép thành công!",
        });
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_LIST_LEAVE_WORK_ME,
        });
        toggleModal();
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Tạo đơn xin nghỉ phép thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-create-leave-work-form">
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
              disabledDate={(d): boolean => {
                return (
                  moment(d.format("DD/MM/YYYY"), "DD/MM/YYYY") <
                  moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY")
                );
              }}
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số ngày nghỉ"
            rules={[{required: true}]}
          >
            <InputNumber
              min={0.5}
              step={0.5}
              max={daysAllowedLeave?.quantity}
              defaultValue={0.5}
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Lý do"
            rules={[{required: true}, {whitespace: true}]}
          >
            <Input.TextArea rows={10} placeholder="Lý do" />
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
      title="Tạo đơn xin nghỉ phép"
      content={renderContent()}
      footer={null}
    />
  );
}
