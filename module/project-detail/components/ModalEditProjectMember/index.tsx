import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import ApiProject, {IEditProjectMemberBody} from "@app/api/ApiProject";
import {useMutation, useQueryClient} from "react-query";
import {InputModal} from "@app/components/Modal/InputModal";
import {SelectInput} from "@app/components/Modal/SelectInput";
import {ERolePosition, IProjectMember} from "@app/types";
import {notification} from "antd";
import {DateInput3} from "@app/components/Modal/DateInput3";
import moment from "moment";
import {queryKeys} from "@app/utils/constants/react-query";

interface ModalEditProjectMemberProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  projectId: number;
  member: IProjectMember;
}

interface IDataState {
  user?: number;
  role?: ERolePosition;
  contract?: number;
  startDate?: string;
  endDate?: string;
}

export function ModalEditProjectMember({
  isModalVisible,
  toggleModal,
  projectId,
  member,
}: ModalEditProjectMemberProps): JSX.Element {
  const queryClient = useQueryClient();

  const defaultValue = {
    role: member?.role,
    contract: member?.contract,
    startDate: moment(member.startDate).format("YYYY-MM-DD"),
    endDate: moment(member.endDate).format("YYYY-MM-DD"),
  };
  const [data, setData] = useState<IDataState>(defaultValue);

  useEffect(() => {
    setData(defaultValue);
  }, [isModalVisible]);

  const positions = [
    {
      value: ERolePosition.BACKEND_DEV,
      lable: "Backend Dev",
    },
    {
      value: ERolePosition.FRONTEND_DEV,
      lable: "Frontend Dev",
    },
    {
      value: ERolePosition.TESTER,
      lable: "Tester",
    },
    {
      value: ERolePosition.BA,
      lable: "BA",
    },
    {
      value: ERolePosition.DESIGNER,
      lable: "Designer",
    },
  ];

  const EditProjectMemberMutation = useMutation(ApiProject.editProjectMember);
  const handleEditProjectMember = (values: IEditProjectMemberBody): void => {
    EditProjectMemberMutation.mutate(
      {
        projectId: values.projectId,
        userId: values.userId,
        role: values.role,
        contract: Number(values.contract),
        startDate: values.startDate,
        endDate: values.endDate,
      },
      {
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
      }
    );
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-edit-project-member">
        <InputModal
          className="inline"
          label="Họ tên"
          onChange={setData}
          value={member.user?.fullName ?? ""}
          keyValue="fullName"
          disabled
        />
        <SelectInput
          className="inline"
          keyValue="role"
          label="Vai trò:"
          value={data.role}
          data={positions?.map((item) => {
            return {
              value: item.value,
              label: item.lable,
            };
          })}
          setValue={setData}
        />
        <InputModal
          className="inline"
          keyValue="contract"
          label="Hợp đồng"
          value={data.contract + ""}
          onChange={setData}
        />
        <DateInput3
          className="inline"
          keyValue="startDate"
          label="Bắt đầu:"
          value={data.startDate ?? ""}
          onChange={setData}
          disabledDate={(d) => {
            if (data.endDate !== moment().format("YYYY-MM-DD")) {
              return d.isAfter(data.endDate);
            }
            return false;
          }}
        />
        <DateInput3
          className="inline"
          keyValue="endDate"
          label="Kết thúc:"
          onChange={setData}
          value={data.endDate ?? ""}
          disabledDate={(d) => d.isBefore(moment(data.startDate))}
        />
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleOk={() => {
        handleEditProjectMember({
          ...data,
          projectId: projectId,
          userId: member.id,
        });
      }}
      handleCancel={toggleModal}
      title="Sửa thông tin thành viên dự án"
      content={renderContent()}
    />
  );
}
