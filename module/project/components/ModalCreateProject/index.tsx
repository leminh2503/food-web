import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import {Button, DatePicker, Form, Input, notification, Select} from "antd";
import {defaultValidateMessages, layout} from "@app/validate/user";
import ApiProject, {IProjectBody} from "@app/api/ApiProject";
import {useMutation, useQueryClient} from "react-query";
import {queryKeys} from "@app/utils/constants/react-query";
import moment from "moment";

interface ModalCreateProjectProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  listUserConvert: {value: number; label: string}[];
}

export function ModalCreateProject({
  isModalVisible,
  toggleModal,
  listUserConvert,
}: ModalCreateProjectProps): JSX.Element {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [date, setDate] = useState({
    startDate: moment().format("DD/MM/YYYY"),
    endDate: moment().format("DD/MM/YYYY"),
  });

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      projectManager: 1,
      startDate: moment(),
      endDate: moment(),
    });
    setDate({
      startDate: moment().format("DD/MM/YYYY"),
      endDate: moment().format("DD/MM/YYYY"),
    });
  }, [isModalVisible]);

  const onFinish = (fieldsValue: IProjectBody): void => {
    const data = {
      name: fieldsValue.name,
      projectManager: fieldsValue.projectManager,
      startDate: moment(fieldsValue.startDate).format("YYYY-MM-DD"),
      endDate: moment(fieldsValue.endDate).format("YYYY-MM-DD"),
      scale: fieldsValue.scale,
      customer: fieldsValue.customer,
      technicality: fieldsValue.technicality,
      use: fieldsValue.use,
      description: fieldsValue.description,
    };
    handleCreateProject(data);
  };

  const createProjectMutation = useMutation(ApiProject.createProject);
  const handleCreateProject = (data: IProjectBody): void => {
    createProjectMutation.mutate(data, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Thêm dự án thành công!",
        });
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_LIST_PROJECT,
        });
        toggleModal();
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Thêm dự án thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-create-project-form">
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item
            name="name"
            label="Tên dự án"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^(?![_|-])[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ0-9\s|_|-]+$/,
                message: "Tên dự án không được chứa ký tự đặc biệt!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="projectManager"
            label="PM dự án"
            rules={[{required: true}]}
          >
            <Select>
              {listUserConvert?.map((e) => (
                <Select.Option key={e.value} value={e.value}>
                  {e.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Ngày bắt đầu"
            rules={[{required: true}]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(value, dateString): void => {
                setDate((prev) => ({
                  ...prev,
                  startDate:
                    dateString === ""
                      ? moment().format("DD/MM/YYYY")
                      : dateString,
                }));
              }}
              disabledDate={(d): boolean => {
                console.log(
                  moment(d.format("DD/MM/YYYY"), "DD/MM/YYYY"),
                  moment(date.endDate, "DD/MM/YYYY"),
                  moment(d.format("DD/MM/YYYY"), "DD/MM/YYYY") >
                    moment(date.endDate, "DD/MM/YYYY")
                );
                if (date.endDate !== moment().format("DD/MM/YYYY")) {
                  return (
                    d.isBefore() ||
                    moment(d.format("DD/MM/YYYY"), "DD/MM/YYYY") >
                      moment(date.endDate, "DD/MM/YYYY")
                  );
                }
                return d.isBefore();
              }}
            />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày kết thúc dự kiến"
            rules={[{required: true}]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(value, dateString): void => {
                setDate((prev) => ({
                  ...prev,
                  endDate:
                    dateString === ""
                      ? moment().format("DD/MM/YYYY")
                      : dateString,
                }));
              }}
              disabledDate={(d): boolean => {
                return (
                  d.isBefore() ||
                  d.isBefore(moment(date.startDate, "DD/MM/YYYY"))
                );
              }}
            />
          </Form.Item>
          <Form.Item
            name="scale"
            label="Quy mô"
            rules={[
              {required: true},
              {
                pattern: /^([1-9][0-9]*)$/,
                message: "Quy mô phải là số nguyên dương!",
              },
            ]}
          >
            <Input suffix="man/month" />
          </Form.Item>
          <Form.Item
            name="customer"
            label="Khách hàng"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^(?![_|-])[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ0-9\s|_|-]+$/,
                message: "Khách hàng không được chứa ký tự đặc biệt!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="use"
            label="Công cụ sử dụng"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^(?![_|,|-])[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ0-9\s|_|,|-]+$/,
                message: "Công cụ sử dụng không được chứa ký tự đặc biệt!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="technicality"
            label="Kỹ thuật"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern:
                  /^(?![_|,|-])[a-zA-ZàáảạãÀÁẢẠÃâầấẩậẫÂẦẤẨẬẪăằắẳặẵĂẰẮẲẶẴđĐèéẻẹẽÈÉẺẸẼêềếểệễÊỀẾỂỆỄìíỉịĩÌÍỈỊĨòóỏọõÒÓỎỌÕôồốổộỗÔỒỐỔỘỖơờớởợỡƠỜỚỞỢỠùúủụũÙÚỦỤŨưừứửựữƯỪỨỬỰỮỳýỷỵỹỲÝỶỴỸ0-9\s|_|,|-]+$/,
                message: "Kỹ thuật không được chứa ký tự đặc biệt!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              {required: true},
              {whitespace: true},
              {
                pattern: /^(?![`~!@#$%^&*()?_+=/''-:{}|<>])/,
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
                onClick={(): void => {
                  toggleModal();
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
      handleCancel={(): void => {
        toggleModal();
        form.resetFields();
      }}
      title="Thêm dự án"
      content={renderContent()}
      footer={null}
    />
  );
}
