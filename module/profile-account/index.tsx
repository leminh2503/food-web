import React, {useEffect, useState} from "react";
import {EnglishCertificate, IUserLogin} from "@app/types";
import {useMutation, useQuery, useQueryClient} from "react-query";
import ApiUser, {IProfileBody, IRegisterAccountBody} from "@app/api/ApiUser";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Row,
  Select,
  Tabs,
} from "antd";
import {CameraFilled} from "@ant-design/icons";
import {queryKeys} from "@app/utils/constants/react-query";
import moment from "moment/moment";
import {formatCurrencyVnd} from "@app/utils/convert/ConvertHelper";
import {defaultValidateMessages, layout} from "@app/validate/user";

export function ProfileAccount(): JSX.Element {
  const [toggleModalUpload, setToggleModalUpload] = useState(false);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [fileUpload, setFileUpload] = useState();
  const [form] = Form.useForm();

  const getMeData = (): Promise<IUserLogin> => {
    return ApiUser.getMe();
  };

  const queryClient = useQueryClient();

  const {
    data: dataUser,
    isLoading,
    refetch,
  } = useQuery(queryKeys.GET_DATA_USER_IN_USE, getMeData) || {};

  const [typeCertificateEnglish, setTypeCertificateEnglish] =
    useState<EnglishCertificate>();

  const dataRefetch = (): void => {
    refetch();
  };

  const onFileUpload = (): void => {
    if (!fileUpload) {
      notification.error({
        duration: 1,
        message: `Chưa chọn ảnh mới`,
      });
    } else {
      const formData = new FormData();
      formData.append("file", fileUpload);
      ApiUser.updateAvatar(formData)
        .then((response) => {
          notification.success({
            duration: 1,
            message: `Sửa thành công`,
          });
          setToggleModalUpload(false);
          setFileUpload(undefined);
          dataRefetch();
          queryClient.refetchQueries({
            queryKey: "dataUser",
          });
        })
        .catch((error) =>
          notification.warning({
            duration: 1,
            message: `Sửa thất bại`,
          })
        );
      setToggleModalUpload(false);
      setFileUpload(undefined);
    }
  };

  const handleChooseFile = (e: any): void => {
    const img = e.target.files[0];
    setFileUpload(img);
  };

  const updateProfile = useMutation(ApiUser.updateMe, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Sửa thành công`,
      });
      dataRefetch();
      setComponentDisabled(true);
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Sửa thất bại`,
      });
    },
  });

  const handleConfirmEdit = (data: IProfileBody): void => {
    Modal.confirm({
      title: "Xác nhận sửa thông tin nhân viên?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        handleUpdateProfile(data);
      },
      onCancel: () => {
        cancelUpdate();
      },
    });
  };

  const handleUpdateProfile = (values: IProfileBody): void => {
    updateProfile.mutate(values);
  };

  const onFinish = (fieldsValue: IRegisterAccountBody): void => {
    const data = {
      fullName: fieldsValue?.fullName,
      email: fieldsValue?.email,
      dateOfBirth: fieldsValue?.dateOfBirth,
      personId: fieldsValue?.personId,
      address: fieldsValue?.address,
      phoneNumber: fieldsValue?.phoneNumber,
      phoneNumberRelative: fieldsValue?.phoneNumberRelative,
      gender: fieldsValue?.gender,
      workRoom: fieldsValue?.workRoom,
      englishCertificate: fieldsValue?.englishCertificate,
      englishScore: fieldsValue?.englishScore?.toString(),
    };
    handleConfirmEdit(data);
  };

  const cancelUpdate = (): void => {
    const date = dataUser?.dateOfBirth
      ? new Date(dataUser?.dateOfBirth)
      : new Date();
    setTypeCertificateEnglish(dataUser?.englishCertificate || "");
    form.setFieldsValue({
      fullName: dataUser?.fullName,
      email: dataUser?.email,
      dateOfBirth: date ? moment(date, "DD/MM/YYYY") : null,
      personId: dataUser?.personId,
      address: dataUser?.address,
      phoneNumber: dataUser?.phoneNumber,
      phoneNumberRelative: dataUser?.phoneNumberRelative,
      gender: dataUser?.gender,
      workRoom: dataUser?.workRoom,
      englishCertificate: dataUser?.englishCertificate,
      englishScore: dataUser?.englishScore,
    });
  };

  useEffect(() => {
    cancelUpdate();
    setTypeCertificateEnglish(dataUser?.englishCertificate);
  }, [dataUser]);

  const handleChangeCertificate = (value: {
    value: EnglishCertificate;
    label: React.ReactNode;
  }) => {
    setTypeCertificateEnglish(value.value);
    if (form.getFieldValue("englishCertificate") === "") {
      form.setFieldValue("englishScore", "");
    }
  };

  const contentUpdate = (): JSX.Element => {
    return (
      <div>
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
          disabled={componentDisabled}
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
                name="gender"
                label="Giới tính"
                rules={[{required: true}]}
              >
                <Select>
                  <Select.Option key="1" value="Male">
                    Nam
                  </Select.Option>
                  <Select.Option key="2" value="Female">
                    Nữ
                  </Select.Option>
                  <Select.Option key="3" value="Other">
                    Khác
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  {required: true},
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
                label="Sđt người thân"
                rules={[
                  {required: true},
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
                  <Select.Option key="3" value="Other">
                    Khác
                  </Select.Option>
                  <Select.Option key="0" value="">
                    Không
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[{required: true}]}
              >
                <DatePicker
                  format="DD/MM/YYYY"
                  disabledDate={(current) =>
                    current.isAfter(moment().subtract(18, "years"))
                  }
                />
              </Form.Item>
              <Form.Item
                name="personId"
                label="CMND/CCCD"
                rules={[
                  {required: true},
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
                  {required: true},
                  {type: "string"},
                  {whitespace: true},
                  {
                    pattern:
                      /^[-/0-9a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêếìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
                    message: "Địa chỉ không hợp lệ!",
                  },
                  {max: 255},
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="workRoom"
                label="Phòng làm việc"
                rules={[
                  {required: true},
                  {type: "string"},
                  {whitespace: true},
                  {max: 255},
                ]}
              >
                <Input />
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
          </Row>
          {!componentDisabled && (
            <Row>
              <Form.Item className="w-100x">
                <div className="footer-form">
                  <Button
                    className="button-cancel mr-3"
                    onClick={(): void => {
                      setComponentDisabled(true);
                      cancelUpdate();
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
            </Row>
          )}
        </Form>
        {componentDisabled && (
          <Button
            onClick={() => setComponentDisabled(false)}
            className="button-confirm"
            type="primary"
            htmlType="submit"
          >
            Sửa
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="profile-page">
      <Image
        preview={false}
        height="250px"
        style={{objectFit: "cover"}}
        width="100%"
        fallback="/img/background-login.png"
        src="/img/background-login.png"
      />
      <div className="wrapper">
        <Row gutter={12}>
          {" "}
          <Col span="8">
            <Card
              bordered={false}
              className="card-left"
              style={{borderRadius: "10px"}}
              loading={isLoading}
            >
              <div className="text-center">
                <Modal
                  title="Sửa ảnh đại diện"
                  centered
                  visible={toggleModalUpload}
                  className="modal"
                  footer={[
                    <Button
                      key="save"
                      style={{backgroundColor: "#40a9ff"}}
                      type="primary"
                      className="btn-action m-1 hover-pointer"
                      onClick={onFileUpload}
                    >
                      Lưu
                    </Button>,
                  ]}
                  onCancel={(): void => setToggleModalUpload(false)}
                >
                  <div className="m-2 d-flex">
                    <p className="ml-2 font-bold w-20x">Thêm ảnh</p>
                    <Input
                      type="file"
                      className="input w-100x"
                      onChange={handleChooseFile}
                      placeholder="abc"
                      accept="image/png, image/jpg, image/jpeg"
                      style={{
                        width: "100px",
                      }}
                    />
                  </div>
                </Modal>
                <div className="profile-avatar-user">
                  <Image
                    width="180px"
                    height="180px"
                    preview={false}
                    style={{borderRadius: "50%", objectFit: "cover"}}
                    fallback="/img/avatar/avatar.jpg"
                    src={dataUser?.avatar || "/img/avatar/avatar.jpg"}
                  />
                  <div className="button-update-avatar">
                    <CameraFilled
                      onClick={(): void => setToggleModalUpload(true)}
                      className="icon-update-avatar"
                    />
                  </div>
                </div>
              </div>
              <h4 className="text-center">{dataUser?.fullName}</h4>
              <p className="text-center position-user-text">
                {dataUser?.position?.name}
              </p>
              <div className="profile-salary-account">
                <p>
                  <span>Mã nhân viên: </span>
                  <span>{dataUser?.employeeCode}</span>
                </p>
                <p>
                  <span>Lương cơ bản: </span>
                  <span>
                    {dataUser?.baseSalary &&
                      formatCurrencyVnd(Number(dataUser?.baseSalary))}
                  </span>
                </p>
                <p>
                  <span>Khấu trừ gia cảnh: </span>
                  <span>
                    {dataUser?.deductionOwn &&
                      formatCurrencyVnd(Number(dataUser?.deductionOwn))}
                  </span>
                </p>
              </div>
            </Card>
          </Col>
          <Col span="16">
            <Card
              bordered={false}
              className="card-right"
              style={{borderRadius: "10px"}}
              loading={isLoading}
            >
              <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Cập nhật thông tin" key="2">
                  <div className="tab-update-profile mt-5">
                    {contentUpdate()}
                  </div>
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
