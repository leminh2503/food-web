import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect} from "react";
import {IFamilyCircumstance, TypeOfAction} from "@app/types";
import {defaultValidateMessages, layout} from "@app/validate/user";
import {Form, Input} from "antd";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleConfirmModal: (data: IFamilyCircumstance, type: TypeOfAction) => void;
  handleCancelModal: () => void;
  idUser: number;
  dataFamily: IFamilyCircumstance;
}

export function ModalAddFamily(props: ModalInfoProps): JSX.Element {
  const {
    isModalVisible,
    handleConfirmModal,
    handleCancelModal,
    idUser,
    dataFamily,
  } = props;
  const [form] = Form.useForm();

  const type = dataFamily.fullName ? TypeOfAction.EDIT : TypeOfAction.ADD;

  useEffect(() => {
    form.setFieldsValue({
      id: dataFamily?.id,
      userId: idUser,
      fullName: dataFamily?.fullName,
      personId: dataFamily?.personId,
      dateOfBirth: dataFamily?.dateOfBirth,
      relationship: dataFamily?.relationship,
      phoneNumber: dataFamily?.phoneNumber,
    });
  }, [dataFamily]);

  const onFinish = (fieldsValue: IFamilyCircumstance): void => {
    const data = {
      id: dataFamily?.id,
      userId: idUser,
      fullName: fieldsValue?.fullName,
      personId: fieldsValue?.personId,
      dateOfBirth: fieldsValue?.dateOfBirth,
      relationship: fieldsValue?.relationship,
      phoneNumber: fieldsValue?.phoneNumber,
    };
    handleConfirmModal(data, type);
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info modal-add-family-circumstance">
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
                message: "Họ và tên không đúng định dạng!",
              },
              {min: 5},
              {max: 30},
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^(((\+){0,1}(843[2-9]|845[6|8|9]|847[0|6|7|8|9]|848[1-9]|849[1-4|6-9]))|(03[2-9]|05[6|8|9]|07[0|6|7|8|9]|08[1-9]|09[0-4|6-9]))+([0-9]{7})$/g,
                message: "Số điện thoại không đúng định dạng!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="personId" label="CMND/CCCD">
            <Input />
          </Form.Item>
          <Form.Item
            name="relationship"
            label="Quan hệ"
            rules={[{required: true}, {whitespace: true}, {min: 1}]}
          >
            <Input />
          </Form.Item>
        </Form>
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleOk={(): void => {
        form.submit();
      }}
      handleCancel={(): void => {
        form.resetFields();
        handleCancelModal();
      }}
      title="Thêm/Sửa người phụ thuộc"
      content={renderContent()}
    />
  );
}
