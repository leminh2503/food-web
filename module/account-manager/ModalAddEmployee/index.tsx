import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect} from "react";
import {IRegisterAccountBody} from "@app/api/ApiUser";
import {EEnglishCertificate} from "@app/types";
import {Button, DatePicker, Form, Input, Select} from "antd";
import {defaultValidateMessages, layout} from "@app/validate/user";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleConfirmAddEmployee: (data: IRegisterAccountBody) => void;
  handleCancelAddEmployee: () => void;
  listPositionConvert: {value: number; label: string}[];
  listWorkTypeConvert: {value: number; label: string}[];
}

export function ModalAddEmployee(props: ModalInfoProps): JSX.Element {
  const {
    isModalVisible,
    handleConfirmAddEmployee,
    handleCancelAddEmployee,
    listPositionConvert,
    listWorkTypeConvert,
  } = props;

  const [form] = Form.useForm();

  const onFinish = (fieldsValue: IRegisterAccountBody): void => {
    const data = {
      password: "123123",
      gender: undefined,
      englishCertificate: EEnglishCertificate.OTHER,
      englishScore: 0,
      workRoom: "",
      personId: fieldsValue.personId,
      dateOfBirth: fieldsValue.dateOfBirth,
      position: fieldsValue.position,
      workType: fieldsValue.workType,
      address: fieldsValue.address,
      phoneNumber: fieldsValue.phoneNumber,
      phoneNumberRelative: fieldsValue.phoneNumberRelative,
      baseSalary: fieldsValue.baseSalary,
      manageSalary: 0,
      email: fieldsValue.email,
      employeeCode: fieldsValue.employeeCode,
      fullName: fieldsValue.fullName,
    };
    handleConfirmAddEmployee(data);
  };

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info modal-add-account-form">
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
            rules={[{required: true}, {whitespace: true}, {min: 1}, {max: 30}]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="employeeCode"
            label="Mã nhân viên"
            rules={[{required: true}, {whitespace: true}, {max: 255}]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {required: true},
              {whitespace: true},
              {type: "email"},
              {min: 6},
              {max: 255},
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              {
                pattern: /^(?:\d*)$/,
                message: "Số điện thoại không đúng định dạng!",
              },
              {min: 10},
              {max: 11},
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumberRelative"
            label="Số điện thoại người thân"
            rules={[
              {
                pattern: /^(?:\d*)$/,
                message: "Số điện thoại không đúng định dạng!",
              },
              {min: 10},
              {max: 11},
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="personId"
            label="CMND/CCCD"
            rules={[
              {
                pattern: /^(?:\d*)$/,
                message: "CMND/CCCD không đúng định dạng!",
              },
              {min: 12},
              {max: 13},
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="position" label="Chức vụ" rules={[{required: true}]}>
            <Select>
              {listPositionConvert?.map((e) => (
                <Select.Option key={"position" + e.value} value={e.value}>
                  {e.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Vị trí" name="workType" rules={[{required: true}]}>
            <Select>
              {listWorkTypeConvert?.map((e) => (
                <Select.Option key={"workType" + e.value} value={e.value}>
                  {e.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="baseSalary"
            label="Lương cơ bản"
            rules={[
              {required: true},
              {
                pattern: /^[1-9]\d*$/,
                message: "Vui lòng nhập vào số nguyên!",
              },
              {
                max: 11,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <div className="footer-modal">
              <Button
                className="button-cancel mr-3"
                type="primary"
                onClick={() => {
                  handleCancelAddEmployee();
                  form.resetFields();
                }}
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
      handleCancel={() => {
        handleCancelAddEmployee();
        form.resetFields();
      }}
      title="Tạo tài khoản"
      content={renderContent()}
      footer={false}
    />
  );
}
