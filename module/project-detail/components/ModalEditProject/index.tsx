import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import {Button, DatePicker, Form, Input, notification, Select} from "antd";
import React, {useEffect, useState} from "react";
import {IProject} from "@app/types";
import {defaultValidateMessages, layout} from "@app/validate/user";
import ApiProject, {IEditProjectBody} from "@app/api/ApiProject";
import moment from "moment/moment";
import {useMutation, useQueryClient} from "react-query";
import {queryKeys} from "@app/utils/constants/react-query";

interface ModalEditProjectProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  listUserConvert: {value: number; label: string}[];
  dataProjectById: IProject;
}

export function ModalEditProject({
  isModalVisible,
  toggleModal,
  listUserConvert,
  dataProjectById,
}: ModalEditProjectProps): JSX.Element {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [date, setDate] = useState({
    startDate: moment(dataProjectById.startDate).format("DD/MM/YYYY"),
    endDate: moment(dataProjectById.endDate).format("DD/MM/YYYY"),
  });

  useEffect(() => {
    form.setFieldsValue({
      name: dataProjectById.name,
      projectManager: Number(dataProjectById.projectManager?.id),
      startDate: moment(dataProjectById.startDate),
      endDate: moment(dataProjectById.endDate),
      scale: dataProjectById.scale,
      customer: dataProjectById.customer,
      use: dataProjectById.use,
      technicality: dataProjectById.technicality,
      description: dataProjectById.description,
    });
  }, [dataProjectById, isModalVisible]);

  useEffect(() => {
    setDate({
      startDate: moment(dataProjectById.startDate).format("DD/MM/YYYY"),
      endDate: moment(dataProjectById.endDate).format("DD/MM/YYYY"),
    });
  }, [dataProjectById]);

  const onFinish = (fieldsValue: IEditProjectBody): void => {
    const data = {
      id: dataProjectById.id,
      name: fieldsValue.name,
      projectManager: fieldsValue.projectManager,
      endDate: moment(fieldsValue.endDate).format("YYYY-MM-DD"),
      scale: fieldsValue.scale,
      customer: fieldsValue.customer,
      use: fieldsValue.use,
      technicality: fieldsValue.technicality,
      description: fieldsValue.description,
    };
    handleEditProject(data);
  };

  const editProjectMutation = useMutation(ApiProject.editProject);
  const handleEditProject = (data: IEditProjectBody) => {
    editProjectMutation.mutate(data, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Sửa thông tin dự án thành công!",
        });
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_PROJECT_BY_ID,
        });
        toggleModal();
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Sửa thông tin dự án thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-edit-project-form">
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
          <Form.Item name="startDate" label="Ngày bắt đầu">
            <DatePicker format="DD/MM/YYYY" disabled />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày kết thúc dự kiến"
            rules={[{required: true}]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(value, dateString): void =>
                setDate((prev) => ({
                  ...prev,
                  endDate:
                    dateString === ""
                      ? moment().format("DD/MM/YYYY")
                      : dateString,
                }))
              }
              disabledDate={(d): boolean =>
                d.isBefore(moment(date.startDate, "DD/MM/YYYY"))
              }
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
      }}
      title="Sửa thông tin dự án"
      content={renderContent()}
      footer={null}
    />
  );
}
