import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect} from "react";
import ApiLeaveWork, {IRefuseLeaveWorkBody} from "@app/api/ApiLeaveWork";
import {useMutation, useQueryClient} from "react-query";
import {Button, Form, Input, notification} from "antd";
import {queryKeys} from "@app/utils/constants/react-query";
import {defaultValidateMessages, layout} from "@app/validate/user";
import {IPermission} from "@app/types";

interface ModalRefuseLeaveWorkProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  refuseWorkLeaveId: number;
  role?: {id: number; roleName: string; permissions: IPermission[]};
}

export function ModalRefuseLeaveWork({
  isModalVisible,
  toggleModal,
  refuseWorkLeaveId,
  role,
}: ModalRefuseLeaveWorkProps): JSX.Element {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const onFinish = (fieldsValue: IRefuseLeaveWorkBody): void => {
    const data = {
      id: refuseWorkLeaveId,
      refuseReason: fieldsValue.refuseReason,
    };
    handleRefuseLeaveWork(data);
  };

  const refuseLeaveWorkMutation = useMutation(ApiLeaveWork.refuseLeaveWork);
  const handleRefuseLeaveWork = (data: IRefuseLeaveWorkBody): void => {
    refuseLeaveWorkMutation.mutate(data, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Từ chối đơn xin nghỉ phép thành công!",
        });
        if (role) {
          queryClient.refetchQueries({
            queryKey: queryKeys.GET_LIST_LEAVE_WORK,
          });
        } else {
          queryClient.refetchQueries({
            queryKey: queryKeys.GET_LIST_LEAVE_WORK_ME,
          });
        }
        toggleModal();
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Từ chối đơn xin nghỉ phép thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-refuse-leave-work-form">
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item
            name="refuseReason"
            label="Lý do"
            rules={[{required: true}, {whitespace: true}]}
          >
            <Input.TextArea rows={10} placeholder="Lý do từ chối" />
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
      title="Lý do từ chối"
      content={renderContent()}
      footer={null}
    />
  );
}
