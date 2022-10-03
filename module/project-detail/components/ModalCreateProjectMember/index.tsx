import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import ApiProject, {IProjectMemberBody} from "@app/api/ApiProject";
import {useMutation, useQueryClient} from "react-query";
import {ERolePosition, IProject} from "@app/types";
import {Button, DatePicker, Form, Input, notification, Select} from "antd";
import moment from "moment";
import {queryKeys} from "@app/utils/constants/react-query";
import {defaultValidateMessages, layout} from "@app/validate/user";

interface ModalCreateProjectMemberProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  projectId: number;
  dataProjectById: IProject;
  listUserConvert: {value: number; label: string}[];
  listPosition: {value: number; label: string}[];
}

export function ModalCreateProjectMember({
  isModalVisible,
  toggleModal,
  projectId,
  dataProjectById,
  listUserConvert,
  listPosition,
}: ModalCreateProjectMemberProps): JSX.Element {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [date, setDate] = useState({
    startDate: moment(dataProjectById.startDate).format("DD/MM/YYYY"),
    endDate: moment(dataProjectById.startDate).format("DD/MM/YYYY"),
  });
  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      user: 1,
      role: ERolePosition.BACKEND_DEV,
      startDate: moment(dataProjectById.startDate),
      endDate: moment(dataProjectById.startDate),
    });
    setDate({
      startDate: moment(dataProjectById.startDate).format("DD/MM/YYYY"),
      endDate: moment(dataProjectById.startDate).format("DD/MM/YYYY"),
    });
  }, [isModalVisible]);

  const onFinish = (fieldsValue: IProjectMemberBody): void => {
    const data = {
      projectId: projectId,
      user: fieldsValue.user,
      role: fieldsValue.role,
      contract: Number(fieldsValue.contract),
      startDate: fieldsValue.startDate,
      endDate: fieldsValue.endDate,
    };
    handleCreateProjectMember(data);
  };

  const createProjectMemberMutation = useMutation(
    ApiProject.createProjectMember
  );
  const handleCreateProjectMember = (values: IProjectMemberBody): void => {
    createProjectMemberMutation.mutate(values, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Thêm thành viên dự án thành công!",
        });
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_LIST_PROJECT_MEMBER,
        });
        toggleModal();
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Thêm thành viên dự án thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-create-project-member-form">
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item
            name="user"
            label="Tên thành viên"
            rules={[{required: true}]}
          >
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option): boolean =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {listUserConvert.map((e) => (
                <Select.Option
                  key={"listUserConvert" + e.value}
                  value={e.value}
                >
                  {e.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{required: true}]}>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option): boolean =>
                (option?.children as unknown as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {listPosition.map((e) => (
                <Select.Option key={"listPosition" + e.value} value={e.value}>
                  {e.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="contract"
            label="Hợp đồng"
            rules={[
              {required: true},
              {
                pattern: /^(?!0$)\d+(?:[.][05])?$/,
                message: "Hợp đồng phải không hợp lệ!",
              },
            ]}
          >
            <Input />
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
                      ? moment(dataProjectById.startDate).format("DD/MM/YYYY")
                      : dateString,
                }));
              }}
              // disabledDate={(d): boolean => {
              //   return (
              //     moment(d.format("DD/MM/YYYY"), "DD/MM/YYYY") <
              //       moment(date.startDate, "DD/MM/YYYY") ||
              //     moment(d.format("DD/MM/YYYY"), "DD/MM/YYYY") >
              //       moment(date.endDate, "DD/MM/YYYY")
              //   );
              // }}
            />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="Ngày kết thúc"
            rules={[{required: true}]}
          >
            <DatePicker
              format="DD/MM/YYYY"
              onChange={(value, dateString): void => {
                setDate((prev) => ({
                  ...prev,
                  endDate:
                    dateString === ""
                      ? moment(dataProjectById.startDate).format("DD/MM/YYYY")
                      : dateString,
                }));
              }}
              disabledDate={(d): boolean => {
                return (
                  moment(d.format("DD/MM/YYYY"), "DD/MM/YYYY") <
                    moment(date.startDate, "DD/MM/YYYY") ||
                  moment(d.format("DD/MM/YYYY"), "DD/MM/YYYY") >
                    moment(
                      moment(dataProjectById.endDate).format("DD/MM/YYYY"),
                      "DD/MM/YYYY"
                    )
                );
              }}
            />
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
      title="Thêm thành viên dự án"
      content={renderContent()}
      footer={null}
    />
  );
}
