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
  listRoleConvert: {value: number; label: string}[];
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
    listRoleConvert,
    setIsModalChangePassVisible,
    setIsModalFamilyVisible,
    defaultValuesDetail,
  } = props;
  const {
    role,
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
    familyCircumstances,
    englishCertificate,
    englishScore,
    workRoom,
    manageSalary,
  } = dataDetail;

  const [form] = Form.useForm();

  const [adString, setAdString] = useState<IUserLogin>(defaultValuesDetail);

  const [typeCertificateEnglish, setTypeCertificateEnglish] =
    useState<EnglishCertificate>();

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
      familyCircumstances,
      englishCertificate,
      englishScore,
      workRoom,
      manageSalary,
      roleId: role?.id,
    });
    setTypeCertificateEnglish(dataDetail?.englishCertificate);
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
      familyCircumstances,
      englishCertificate,
      englishScore,
      workRoom,
      manageSalary: manageSalary && manageSalary > 0 ? manageSalary : undefined,
      role: role?.id,
    });
  }, [dataDetail, isModalVisible]);

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
      baseSalary: Number(fieldsValue.baseSalary),
      email: fieldsValue.email,
      employeeCode: fieldsValue.employeeCode,
      fullName: fieldsValue.fullName,
      englishCertificate: fieldsValue?.englishCertificate,
      englishScore: fieldsValue?.englishScore,
      manageSalary: fieldsValue?.manageSalary || 0,
      roleId: fieldsValue.role,
    };
    handleOk(data);
  };

  const handleChangeCertificate = (value: EnglishCertificate) => {
    setTypeCertificateEnglish(value);
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
                  {min: 5},
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
                <Input disabled />
              </Form.Item>
              <Form.Item name="dateOfBirth" label="Ngày sinh">
                <DatePicker
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current.isAfter(moment().subtract(18, "years"))
                  }
                  allowClear={false}
                />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  {
                    pattern:
                      /^(((\+){0,1}(843[2-9]|845[6|8|9]|847[0|6|7|8|9]|848[1-9]|849[1-4|6-9]))|(03[2-9]|05[6|8|9]|07[0|6|7|8|9]|08[1-9]|09[0-4|6-9]))+([0-9]{7})$/g,
                    message: "Số điện thoại không đúng định dạng!",
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
                    pattern:
                      /^(((\+){0,1}(843[2-9]|845[6|8|9]|847[0|6|7|8|9]|848[1-9]|849[1-4|6-9]))|(03[2-9]|05[6|8|9]|07[0|6|7|8|9]|08[1-9]|09[0-4|6-9]))+([0-9]{7})$/g,
                    message: "Số điện thoại không đúng định dạng!",
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
                  <Select.Option key="4" value="Other">
                    Khác
                  </Select.Option>
                  <Select.Option key="0" value="">
                    Không
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="englishScore"
                label="Điểm chứng chỉ"
                rules={[
                  {
                    pattern:
                      /^(0*[1-9][0-9]*(\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)$/gm,
                    message: "Điểm không đúng định dạng!",
                  },
                  {
                    // eslint-disable-next-line consistent-return
                    validator: async (rule, value) => {
                      if (value > 990) {
                        return Promise.reject(
                          new Error("Điểm không được vượt quá 990!")
                        );
                      }
                    },
                  },
                ]}
              >
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
                      /^[-/0-9a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
                    message: "Địa chỉ không được hợp lệ!",
                  },
                  {max: 255},
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="workRoom"
                label="Phòng làm việc"
                rules={[{type: "string"}, {whitespace: true}, {max: 255}]}
              >
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
                label="Loại hình làm việc"
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
                label="Nhóm quyền"
                name="role"
                rules={[{required: true}]}
              >
                <Select>
                  {listRoleConvert?.map((e) => (
                    <Select.Option key={"role" + e.value} value={e.value}>
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
                    pattern: /^([1-9]\d{2,}|[1-9][5-9])0$/,
                    message:
                      "Lương cơ bản phải là số nguyên và chia hết cho 1000!",
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
                    pattern: /^([1-9]\d{2,}|[1-9][5-9])0$/,
                    message: "Lương phải là số nguyên và chia hết cho 1000!",
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
                disabled={role?.id === 1}
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
