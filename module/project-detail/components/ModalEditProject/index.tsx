import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import ApiProject, {IProjectBody} from "@app/api/ApiProject";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {InputModal} from "@app/components/Modal/InputModal";
import {SelectInput} from "@app/components/Modal/SelectInput";
import ApiUser from "@app/api/ApiUser";
import {IProject, IUserLogin} from "@app/types";
import {notification} from "antd";
import {DateInput3} from "@app/components/Modal/DateInput3";
import moment from "moment";
import {IMetadata} from "@app/api/Fetcher";
import {queryKeys} from "@app/utils/constants/react-query";

interface ModalEditProjectProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  projectId: number;
}

export function ModalEditProject({
  isModalVisible,
  toggleModal,
  projectId,
}: ModalEditProjectProps): JSX.Element {
  const queryClient = useQueryClient();

  const getProjectById = (): Promise<IProject> => {
    return ApiProject.getProjectById(projectId);
  };

  const {data: dataProjectById} = useQuery(
    queryKeys.GET_PROJECT_BY_ID,
    getProjectById
  );

  const defaultValue = {
    name: dataProjectById?.name,
    projectManager: Number(dataProjectById?.projectManager?.id),
    startDate: dataProjectById?.startDate,
    endDate: dataProjectById?.endDate,
    scale: dataProjectById?.scale,
    customer: dataProjectById?.customer,
    technicality: dataProjectById?.technicality,
    use: dataProjectById?.use,
    description: dataProjectById?.description,
  };

  const [data, setData] = useState<IProjectBody>(defaultValue);

  useEffect(() => {
    setData(defaultValue);
  }, [dataProjectById, isModalVisible]);

  const getUser = (): Promise<{data: IUserLogin[]; meta: IMetadata}> => {
    return ApiUser.getUserAccount();
  };
  const {data: dataUser} = useQuery(
    queryKeys.GET_LIST_USER_FOR_PROJECT,
    getUser
  );

  const selectProjectManager = dataUser?.data.map((item) => {
    return {
      value: Number(item.id),
      label: item.fullName,
    };
  });

  const editProjectMutation = useMutation(ApiProject.editProject);
  const handleEditProject = (values: IProjectBody): void => {
    editProjectMutation.mutate(
      {
        id: projectId,
        name: values.name,
        projectManager: Number(values.projectManager),
        startDate: values.startDate,
        endDate: values.endDate,
        scale: values.scale,
        customer: values.customer,
        technicality: values.technicality,
        use: values.use,
        description: values.description,
      },
      {
        onSuccess: () => {
          setData(defaultValue);
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
      }
    );
  };

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-create-project">
        <InputModal
          className="inline"
          keyValue="name"
          label="Tên dự án:"
          placeholder="Tên dự án"
          value={data.name ?? ""}
          onChange={setData}
          required
        />
        <SelectInput
          className="inline"
          keyValue="projectManager"
          label="PM dự án:"
          value={Number(data.projectManager)}
          data={selectProjectManager}
          setValue={setData}
        />
        <DateInput3
          className="inline"
          keyValue="startDate"
          label="Bắt đầu:"
          onChange={setData}
          value={data.startDate ?? ""}
          disabledDate={(d): boolean => {
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
          disabledDate={(d): boolean =>
            d.isBefore() || d.isBefore(moment(data.startDate))
          }
        />
        <InputModal
          className="inline suffix"
          keyValue="scale"
          label="Quy mô:"
          placeholder="Quy mô"
          value={data.scale + ""}
          onChange={setData}
          suffix="man/month"
        />
        <InputModal
          className="inline"
          keyValue="customer"
          label="Khách hàng:"
          placeholder="Khách hàng"
          value={data.customer ?? ""}
          onChange={setData}
        />
        <InputModal
          className="inline"
          keyValue="use"
          label="Công cụ sử dụng:"
          placeholder="Công cụ sử dụng"
          value={data.use ?? ""}
          onChange={setData}
        />
        <InputModal
          className="inline"
          keyValue="technicality"
          label="Kỹ thuật:"
          placeholder="Kỹ thuật"
          value={data.technicality ?? ""}
          onChange={setData}
        />
        <InputModal
          className="inline"
          keyValue="description"
          label="Mô tả:"
          placeholder="Mô tả"
          value={data.description ?? ""}
          onChange={setData}
        />
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleOk={(): void => {
        handleEditProject(data);
      }}
      handleCancel={toggleModal}
      title="Sửa thông tin dự án"
      content={renderContent()}
    />
  );
}
