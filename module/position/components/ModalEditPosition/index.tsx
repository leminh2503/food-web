import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect} from "react";
import {useMutation, useQueryClient} from "react-query";
import ApiPosition, {IEditPositionBody} from "@app/api/ApiPosition";
import {Button, Form, Input, notification} from "antd";
import {IPosition} from "@app/types";
import {queryKeys} from "@app/utils/constants/react-query";
import {defaultValidateMessages, layout} from "@app/validate/user";

interface ModalEditPositionProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  position: IPosition;
}

export function ModalEditPosition({
  isModalVisible,
  toggleModal,
  position,
}: ModalEditPositionProps): JSX.Element {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: position.name,
      description: position.description,
    });
  }, [isModalVisible, position]);

  const onFinish = (fieldsValue: IEditPositionBody): void => {
    const data = {
      id: position.id,
      name: fieldsValue.name,
      description: fieldsValue.description,
    };
    handleEditPositon(data);
  };

  const editPositionMutation = useMutation(ApiPosition.editPosition);
  const handleEditPositon = (data: IEditPositionBody): void => {
    editPositionMutation.mutate(data, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Sửa thông tin chức vụ thành công!",
        });
        toggleModal();
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_LIST_POSITION_FOR_SETTING,
        });
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Sửa thông tin chức vụ thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-edit-position-form">
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
      title="Sửa thông tin chức vụ"
      content={renderContent()}
      footer={null}
    />
  );
}
