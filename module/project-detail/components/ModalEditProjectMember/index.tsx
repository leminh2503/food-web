import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import ApiProject, {IEditProjectMemberBody} from "@app/api/ApiProject";
import {IProject, IProjectMember} from "@app/types";
import {useMutation, useQueryClient} from "react-query";
import {Button, DatePicker, Form, Input, notification, Select} from "antd";
import moment from "moment";
import {queryKeys} from "@app/utils/constants/react-query";
import {defaultValidateMessages, layout} from "@app/validate/user";

interface ModalEditProjectMemberProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  projectId: number;
  dataProjectById: IProject;
  member: IProjectMember;
  listPosition: {value: number; label: string}[];
}

export function ModalEditProjectMember({
  isModalVisible,
  toggleModal,
  projectId,
  dataProjectById,
  member,
  listPosition,
}: ModalEditProjectMemberProps): JSX.Element {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [date, setDate] = useState({
    startDate: moment(member.startDate).format("DD/MM/YYYY"),
    endDate: moment(member.endDate).format("DD/MM/YYYY"),
  });

  useEffect(() => {
    form.setFieldsValue({
      fullName: member.user.fullName,
      role: member.role,
      contract: member.contract,
      reality: member.reality === null ? 0 : member.reality,
      startDate: moment(member.startDate),
      endDate: moment(member.endDate),
    });

    setDate({
      startDate: moment(member.startDate).format("DD/MM/YYYY"),
      endDate: moment(member.endDate).format("DD/MM/YYYY"),
    });
  }, [member, isModalVisible]);

  const onFinish = (fieldsValue: IEditProjectMemberBody): void => {
    const data = {
      projectId: projectId,
      userId: member.id,
      role: fieldsValue.role,
      contract: Number(fieldsValue.contract),
      reality: Number(fieldsValue.reality),
      startDate: moment(fieldsValue.startDate).format("YYYY-MM-DD"),
      endDate: moment(fieldsValue.endDate).format("YYYY-MM-DD"),
    };
    handleEditProjectMember(data);
  };

  const EditProjectMemberMutation = useMutation(ApiProject.editProjectMember);
  const handleEditProjectMember = (data: IEditProjectMemberBody): void => {
    EditProjectMemberMutation.mutate(data, {
      onSuccess: () => {
        notification.success({
          duration: 1,
          message: "Sửa thông tin  thành viên dự án thành công!",
        });
        queryClient.refetchQueries({
          queryKey: queryKeys.GET_LIST_PROJECT_MEMBER,
        });
        toggleModal();
      },
      onError: () => {
        notification.error({
          duration: 1,
          message: "Sửa thông tin thành viên dự án thất bại!",
        });
      },
    });
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-edit-project-member-form">
        <Form
          form={form}
          {...layout}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item name="fullName" label="Tên thành viên">
            <Input style={{color: "#a0a0a0"}} disabled />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{required: true}]}>
            <Select
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option!.children as unknown as string)
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
                pattern: /^([1-9][0-9]*)$/,
                message: "Hợp đồng phải là số nguyên dương!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="reality"
            label="Thực tế"
            rules={[
              {
                pattern: /^(\s*|^([1-9][0-9]*)|([0]+)$)$/,
                message: "Thực tế phải là số nguyên dương!",
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
              //       moment(
              //         moment(dataProjectById.startDate).format("DD/MM/YYYY"),
              //         "DD/MM/YYYY"
              //       ) ||
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
      }}
      title="Sửa thông tin thành viên dự án"
      content={renderContent()}
      footer={null}
    />
  );
}
