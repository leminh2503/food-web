import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect} from "react";
import {useMutation, useQueryClient} from "react-query";
import ApiWorkType, {IEditWorkTypeBody} from "@app/api/ApiWorkType";
import {Button, Form, Input, notification} from "antd";
import {IWorkType} from "@app/types";
import {queryKeys} from "@app/utils/constants/react-query";
import {defaultValidateMessages, layout} from "@app/validate/user";

interface ModalEditWorkTypeProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  workType: IWorkType;
}

export function ModalEditWorkType({
  isModalVisible,
  toggleModal,
  workType,
}: ModalEditWorkTypeProps): JSX.Element {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: workType.name,
      description: workType.description,
    });
  }, [isModalVisible, workType]);

  const onFinish = (fieldsValue: IEditWorkTypeBody): void => {
    const data = {
      id: workType.id,
      name: fieldsValue.name,
      description: fieldsValue.description,
    };
    handleEditPositon(data);
  };

  const editWorkTypeMutation = useMutation(ApiWorkType.editWorkType);
  const handleEditPositon = (data: IEditWorkTypeBody): void => {
    editWorkTypeMutation.mutate(data, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Sửa thông tin loại hình làm việc thành công!",
        });
        toggleModal();
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_LIST_WORK_TYPE_FOR_SETTING,
        });
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Sửa thông tin loại hình làm việc thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-edit-work-type-form">
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item
            name="name"
            label="Tên loại hình làm việc"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ\s]+$/,
                message:
                  "Tên loại hình làm việc không được chứa ký tự đặc biệt!",
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
      title="Sửa thông tin loại hình làm việc"
      content={renderContent()}
      footer={null}
    />
  );
}
