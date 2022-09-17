import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import {Button, Col, DatePicker, Form, Image, Input, Row, Select} from "antd";
import React, {useEffect, useState} from "react";
import {EnglishCertificate, IUserLogin} from "@app/types";
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
    englishCertificate,
    englishScore,
    workRoom,
  } = dataDetail;

  const [form] = Form.useForm();

  const [adString, setAdString] = useState<IUserLogin>(defaultValuesDetail);

  const [typeCertificateEnglish, setTypeCertificateEnglish] =
    useState<EnglishCertificate>(dataDetail?.englishCertificate || "");

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
      englishCertificate,
      englishScore,
      workRoom,
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
      englishCertificate,
      englishScore,
      workRoom,
    });
  }, [dataDetail, typeCertificateEnglish, isModalVisible]);

  const onFinish = (fieldsValue: IRegisterAccountBody): void => {
    const data = {
      gender: undefined,
      workRoom: fieldsValue?.workRoom,
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
      englishCertificate: fieldsValue?.englishCertificate,
      englishScore: fieldsValue?.englishScore,
    };
    handleOk(data);
  };

  const handleChangeCertificate = (value: {
    value: EnglishCertificate;
    label: React.ReactNode;
  }) => {
    setTypeCertificateEnglish(value.value);
    if (form.getFieldValue("englishCertificate") === "") {
      form.setFieldValue("englishScore", "");
    }
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info modal-add-account-form">
        <div className="avatar-container mb-3">
          <Image
            width={150}
            height={150}
            src={avatar || "/img/avatar/avatar.jpg"}
            style={{borderRadius: "50%", objectFit: "cover"}}
            fallback="/img/avatar/avatar.jpg"
          />
        </div>
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Row gutter={24}>
            <Col span={12}>
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
                  {min: 1},
                  {max: 30},
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
                  disabledDate={(current) => {
                    const customDate = moment().format("DD/MM/YYYY");
                    return (
                      current && current > moment(customDate, "DD/MM/YYYY")
                    );
                  }}
                />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  {
                    pattern: /^[0-9+]{10,12}$/,
                    message:
                      "Số điện thoại không đúng định dạng và phải có độ dài từ 10 đến 12 kí tự!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumberRelative"
                label="Số điện thoại người thân"
                rules={[
                  {
                    pattern: /^[0-9+]{10,12}$/,
                    message:
                      "Số điện thoại không đúng định dạng và phải có độ dài từ 10 đến 12 kí tự!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="englishCertificate" label="Chứng chỉ ngoại ngữ">
                <Select onChange={handleChangeCertificate}>
                  <Select.Option key="1" value="Toeic">
                    Toeic
                  </Select.Option>
                  <Select.Option key="2" value="Toefl">
                    Toefl
                  </Select.Option>
                  <Select.Option key="3" value="Ielts">
                    Ielts
                  </Select.Option>
                  <Select.Option key="3" value="Other">
                    Khác
                  </Select.Option>
                  <Select.Option key="0" value="">
                    Không
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="englishScore" label="Điểm chứng chỉ">
                <Input
                  disabled={
                    !form.getFieldValue("englishCertificate") ||
                    typeCertificateEnglish === ""
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
              <Form.Item
                name="address"
                label="Địa chỉ"
                rules={[{type: "string"}, {max: 255}]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="workRoom" label="Phòng làm việc">
                <Input />
              </Form.Item>
              <Form.Item
                name="position"
                label="Chức vụ"
                rules={[{required: true}]}
              >
                <Select>
                  {listPositionConvert?.map((e) => (
                    <Select.Option key={"position" + e.value} value={e.value}>
                      {e.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="Vị trí"
                name="workType"
                rules={[{required: true}]}
              >
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
                  {
                    pattern: /^([1-9]\d{2,}|[3-9]\d|2[5-9])000$/,
                    message: "Lương cơ bản phải chia hết cho 1000!",
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
                  {
                    pattern: /^([1-9]\d{2,}|[3-9]\d|2[5-9])000$/,
                    message: "Giảm trừ gia cảnh phải chia hết cho 1000!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
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
      width="1000px"
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
      footer={null}
    />
  );
}
