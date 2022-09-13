import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import {Avatar, Button, DatePicker, Form, Input, Select} from "antd";
import React, {useEffect, useState} from "react";
import {EUserGender, IUserLogin} from "@app/types";
import {defaultValidateMessages, layout} from "@app/validate/user";
import {IRegisterAccountBody} from "@app/api/ApiUser";
import moment from "moment";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleOk: (data: IUserLogin) => void;
  handleCancel: () => void;
  setIsModalChangePassVisible: (istoggle: boolean) => void;
  setIsModalFamilyVisible: (istoggle: boolean) => void;
  dataDetail: IUserLogin;
  listPositionConvert: {value: number; label: string}[];
  listWorkTypeConvert: {value: number; label: string}[];
  defaultValuesDetail: IUserLogin;
}

export function ModalInfo(props: ModalInfoProps): JSX.Element {
  const {
    isModalVisible,
    handleOk,
    handleCancel,
    dataDetail,
    listPositionConvert,
    listWorkTypeConvert,
    setIsModalChangePassVisible,
    setIsModalFamilyVisible,
    defaultValuesDetail,
  } = props;
  const {
    fullName,
    email,
    avatar,
    personId,
    address,
    phoneNumber,
    phoneNumberRelative,
    baseSalary,
    position,
    workType,
    dateOfBirth,
    deductionOwn,
    familyCircumstances,
  } = dataDetail;

  const [form] = Form.useForm();

  const [adString, setAdString] = useState<IUserLogin>(defaultValuesDetail);
  useEffect(() => {
    setAdString({
      fullName,
      email,
      avatar,
      personId,
      address,
      phoneNumber,
      phoneNumberRelative,
      baseSalary,
      positionId: position?.id || 0,
      workTypeId: workType?.id || 0,
      workType,
      dateOfBirth,
      deductionOwn,
      familyCircumstances,
    });
  }, [dataDetail]);

  const date = dateOfBirth && new Date(dateOfBirth);

  useEffect(() => {
    form.setFieldsValue({
      fullName,
      email,
      avatar,
      personId,
      address,
      phoneNumber,
      phoneNumberRelative,
      baseSalary,
      position: position?.id || 0,
      workType: workType?.id || 0,
      dateOfBirth: moment(date, "DD/MM/YYYY") || null,
      deductionOwn,
      familyCircumstances,
    });
  }, [dataDetail]);

  const onFinish = (fieldsValue: IRegisterAccountBody) => {
    const data = {
      gender: EUserGender.OTHER,
      workRoom: "",
      personId: fieldsValue.personId,
      dateOfBirth: fieldsValue.dateOfBirth,
      positionId: fieldsValue.position || 0,
      workTypeId: fieldsValue.workType || 0,
      address: fieldsValue.address,
      phoneNumber: fieldsValue.phoneNumber,
      phoneNumberRelative: fieldsValue.phoneNumberRelative,
      baseSalary: fieldsValue.baseSalary,
      email: fieldsValue.email,
      employeeCode: fieldsValue.employeeCode,
      fullName: fieldsValue.fullName,
      deductionOwn: fieldsValue.deductionOwn,
    };
    handleOk(data);
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info modal-add-account-form">
        <div className="avatar-container mb-3">
          <Avatar size={150} src={avatar || "/img/avatar/avatar.jpg"} />
        </div>
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
                pattern: /^(?:\d*)$/,
                message: "Vui lòng nhập vào số nguyên!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="deductionOwn"
            label="Giảm trừ gia cảnh"
            rules={[
              {required: true},
              {
                pattern: /^(?:\d*)$/,
                message: "Vui lòng nhập vào số nguyên!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Button
            onClick={(): void => setIsModalFamilyVisible(true)}
            className="mt-3 button-modal-family"
          >
            Số người phụ thuộc: {familyCircumstances?.length}
          </Button>
          <Form.Item>
            <div className="footer-modal">
              <Button
                className="button-cancel mr-3"
                type="primary"
                onClick={(): void => setIsModalChangePassVisible(true)}
              >
                Đổi mật khẩu
              </Button>
              <Button
                className="button-cancel mr-3"
                type="primary"
                onClick={(): void => {
                  handleCancel();
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
      handleOk={(): void => handleOk(adString)}
      handleCancel={(): void => {
        handleCancel();
        setAdString({
          ...adString,
          positionId: dataDetail?.position?.id || 0,
          workTypeId: dataDetail?.workType?.id || 0,
        });
      }}
      title="Thông tin nhân viên"
      content={renderContent()}
      footer={false}
    />
  );
}
