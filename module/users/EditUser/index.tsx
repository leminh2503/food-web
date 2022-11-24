import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import {defaultValidateMessages, layout} from "@app/validate/user";
import {Form, Input} from "antd";
import {IEditUser} from "@app/types";

interface ModalInfoProps {
  isModalVisible: boolean;
  getUserName: string;
  getFirstName: string;
  getLastName: string;
  handleCancelEdit: () => void;
  handleConfirmEdit: (values: IEditUser) => void;
}

export function ModalEditUser(props: ModalInfoProps): JSX.Element {
  const {
    isModalVisible,
    getUserName,
    getFirstName,
    getLastName,
    handleCancelEdit,
    handleConfirmEdit,
  } = props;
  const defaultValues = {
    userName: getUserName,
    firstName: getFirstName,
    lastName: getLastName,
  };
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [isModalVisible]);
  const [firstNameEdit, setFirstNameEdit] = useState<string>(getFirstName);
  const [lastNameEdit, setLastNameEdit] = useState<string>(getLastName);

  const onFinish = (): void => {
    handleConfirmEdit({
      firstName: firstNameEdit,
      lastName: lastNameEdit,
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-EditUser">
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          initialValues={defaultValues}
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item label="User Name" name="userName">
            <Input disabled />
          </Form.Item>
          <Form.Item label="First Name" name="firstName">
            <Input onChange={(e): void => setFirstNameEdit(e.target.value)} />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName">
            <Input onChange={(e): void => setLastNameEdit(e.target.value)} />
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
      handleCancel={handleCancelEdit}
      title="Edit User"
      content={renderContent()}
    />
  );
}
