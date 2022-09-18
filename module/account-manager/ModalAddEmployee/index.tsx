import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect} from "react";
import {IRegisterAccountBody} from "@app/api/ApiUser";
import {EEnglishCertificate} from "@app/types";
import {Button, DatePicker, Form, Input, Select} from "antd";
import {defaultValidateMessages, layout} from "@app/validate/user";
import moment from "moment";

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
      baseSalary: Number(fieldsValue.baseSalary),
      manageSalary: Number(fieldsValue.manageSalary) || 0,
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
            name="employeeCode"
            label="Mã nhân viên"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern: /^(?=.*[A-Za-z])([A-Za-z\d]|[A-Za-z]){1,}$/,
                message: "Mã nhân viên không đúng định dạng!",
              },
              {max: 255},
            ]}
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
              {
                pattern: /^[^@\s]+@tinasoft.vn$/,
                message: "Mail không phải domain của Tinasoft!",
              },
              {min: 6},
              {max: 255},
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker
              format="DD/MM/YYYY"
              disabledDate={(current) =>
                current.isAfter(moment().subtract(18, "years"))
              }
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
            rules={[
              {
                pattern:
                  /^(((\+){0,1}(843[2-9]|845[6|8|9]|847[0|6|7|8|9]|848[1-9]|849[1-4|6-9]))|(03[2-9]|05[6|8|9]|07[0|6|7|8|9]|08[1-9]|09[1-4|6-9]))+([0-9]{7})$/g,
                message: "Số điện thoại không đúng định dạng!",
              },
              // ({getFieldValue}) => ({
              //   validator(_, value) {
              //     if (
              //       (getFieldValue("phoneNumber").length > 0 &&
              //         getFieldValue("phoneNumber").length > 12) ||
              //       getFieldValue("phoneNumber").length < 10
              //     ) {
              //       return Promise.reject(
              //         new Error(
              //           "Số điện thoại phải có độ dài từ 10 đến 12 kí tự!"
              //         )
              //       );
              //     }
              //     return Promise.resolve();
              //   },
              // }),
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumberRelative"
            label="Số điện thoại người thân"
            rules={[
              {
                pattern:
                  /^(((\+){0,1}(843[2-9]|845[6|8|9]|847[0|6|7|8|9]|848[1-9]|849[1-4|6-9]))|(03[2-9]|05[6|8|9]|07[0|6|7|8|9]|08[1-9]|09[1-4|6-9]))+([0-9]{7})$/g,
                message: "Số điện thoại không đúng định dạng!",
              },
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
              {min: 9},
              {max: 12},
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[
              {type: "string"},
              {whitespace: true},
              {
                pattern:
                  /^[/0-9a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
                message: "Địa chỉ không hợp lệ!",
              },
              {max: 255},
            ]}
          >
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
                pattern: /^([1-9]\d{2,}|[3-9]\d|2[5-9])000$/,
                message: "Lương cơ bản phải chia hết cho 1000!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="manageSalary"
            label="Lương quản lý"
            rules={[
              {
                pattern: /^[1-9]\d*$/,
                message: "Vui lòng nhập vào số nguyên!",
              },
              {
                pattern: /^([1-9]\d{2,}|[3-9]\d|2[5-9])000$/,
                message: "Lương phải chia hết cho 1000!",
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
      footer={null}
    />
  );
}
