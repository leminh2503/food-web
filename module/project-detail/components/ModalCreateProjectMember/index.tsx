import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import ApiProject, {IProjectMemberBody} from "@app/api/ApiProject";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {InputModal} from "@app/components/Modal/InputModal";
import {SelectInput} from "@app/components/Modal/SelectInput";
import ApiUser from "@app/api/ApiUser";
import {ERolePosition, IUserLogin} from "@app/types";
import {notification} from "antd";
import {DateInput3} from "@app/components/Modal/DateInput3";
import moment from "moment";
import {IMetadata} from "@app/api/Fetcher";
import {queryKeys} from "@app/utils/constants/react-query";

interface ModalCreateProjectMemberProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  projectId: number;
}

interface IDataState {
  user?: number;
  role?: ERolePosition;
  contract?: number;
  startDate?: string;
  endDate?: string;
}

export function ModalCreateProjectMember({
  isModalVisible,
  toggleModal,
  projectId,
}: ModalCreateProjectMemberProps): JSX.Element {
  const queryClient = useQueryClient();

  const defaultValue = {
    user: 1,
    role: ERolePosition.BACKEND_DEV,
    contract: 0,
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
  };

  const [data, setData] = useState<IDataState>(defaultValue);

  useEffect(() => {
    setData(defaultValue);
  }, [isModalVisible]);

  const getUser = (): Promise<{data: IUserLogin[]; meta: IMetadata}> => {
    return ApiUser.getUserAccount();
  };
  const {data: dataUser} = useQuery(
    queryKeys.GET_LIST_USER_FOR_PROJECT,
    getUser
  );

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

  const createProjectMemberMutation = useMutation(
    ApiProject.createProjectMember
  );
  const handleCreateProjectMember = (values: IProjectMemberBody): void => {
    createProjectMemberMutation.mutate(
      {
        projectId: values.projectId,
        user: values.user,
        role: values.role,
        contract: Number(values.contract),
        startDate: values.startDate,
        endDate: values.endDate,
      },
      {
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
      }
    );
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-create-project-member">
        <SelectInput
          className="inline"
          keyValue="user"
          label="Tên thành viên:"
          value={data.user}
          data={dataUser?.data.map((item) => {
            return {
              value: Number(item.id),
              label: item.fullName,
            };
          })}
          setValue={setData}
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
          onChange={setData}
          value={data.startDate ?? ""}
          disabledDate={(d) => {
            if (data.endDate !== moment().format("YYYY-MM-DD")) {
              return d.isBefore() || d.isAfter(moment(data.endDate));
            }
            return d.isBefore();
          }}
        />
        <DateInput3
          className="inline"
          keyValue="endDate"
          label="Kết thúc:"
          onChange={setData}
          value={data.endDate ?? ""}
          disabledDate={(d) =>
            d.isBefore() || d.isBefore(moment(data.startDate))
          }
        />
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleOk={() => {
        handleCreateProjectMember({...data, projectId: projectId});
      }}
      handleCancel={toggleModal}
      title="Thêm thành viên vào dự án"
      content={renderContent()}
    />
  );
}
