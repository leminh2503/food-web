import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect} from "react";
import {useMutation, useQueryClient} from "react-query";
import ApiPosition, {IPositionBody} from "@app/api/ApiPosition";
import {Button, Form, Input, notification} from "antd";
import {queryKeys} from "@app/utils/constants/react-query";
import {defaultValidateMessages, layout} from "@app/validate/user";

interface ModalCreatePositionProps {
  isModalVisible: boolean;
  toggleModal: () => void;
}

export function ModalCreatePosition({
  isModalVisible,
  toggleModal,
}: ModalCreatePositionProps): JSX.Element {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const onFinish = (fieldsValue: IPositionBody): void => {
    const data = {
      name: fieldsValue.name,
      description: fieldsValue.description,
    };
    handleCreatePositon(data);
  };

  const createPositionMutation = useMutation(ApiPosition.createPosition);
  const handleCreatePositon = (data: IPositionBody): void => {
    createPositionMutation.mutate(data, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Thêm chức vụ thành công!",
        });
        toggleModal();
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_LIST_POSITION_FOR_SETTING,
        });
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Thêm chức vụ thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-create-position-form">
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item
            name="name"
            label="Tên chức vụ"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ\s]+$/,
                message: "Tên chức vụ không được chứa ký tự đặc biệt!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {
                pattern:
                  /^[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ0-9\s]/,
                message: "Mô tả không được bắt đầu bởi ký tự đặc biệt!",
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
      title="Thêm chức vụ"
      content={renderContent()}
      footer={null}
    />
  );
}
