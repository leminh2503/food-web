import {ModalCustom} from "@app/components/ModalCustom";
import React, {useState} from "react";
import {DateInput} from "@app/components/Modal/DateInput";
import ApiProject, {IProjectBody} from "@app/api/ApiProject";
import {useMutation, useQuery} from "react-query";
import {InputModal} from "@app/components/Modal/InputModal";
import {SelectInput} from "@app/components/Modal/SelectInput";
import ApiUser from "@app/api/ApiUser";
import {IUserLogin} from "@app/types";
import {notification} from "antd";

interface ModalCreateProjectProps {
  isModalVisible: boolean;
  toggleModal: () => void;
  dataRefetch: () => void;
}

export function ModalCreateProject({
  isModalVisible,
  toggleModal,
  dataRefetch,
}: ModalCreateProjectProps): JSX.Element {
  const [data, setData] = useState<IProjectBody>({
    name: "",
    projectManager: undefined,
    startDate: "",
    endDate: "",
    scale: "",
    customer: "",
    technicality: "",
    use: "",
    description: "",
  });

  const getUser = (): Promise<IUserLogin[]> => {
    return ApiUser.getUserAccount({
      pageSize: 30,
      pageNumber: 1,
    });
  };
  const {data: dataUser} = useQuery("listUser", getUser);

  const createProjectMutation = useMutation(ApiProject.createProject);
  const handleCreateProject = (values: IProjectBody): void => {
    createProjectMutation.mutate(
      {
        name: values.name,
        projectManager: values.projectManager,
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
          setData({
            name: "",
            projectManager: undefined,
            startDate: "",
            endDate: "",
            scale: "",
            customer: "",
            technicality: "",
            use: "",
            description: "",
          });
          notification.success({
            duration: 1,
            message: "Thêm project thành công!",
          });
          toggleModal();
          dataRefetch();
        },
        onError: () => {
          notification.error({
            duration: 1,
            message: "Thêm project thất bại!",
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
          value={data.projectManager}
          data={dataUser?.map((item) => {
            return {
              value: Number(item.id),
              label: item.fullName,
            };
          })}
          setValue={setData}
        />
        <DateInput
          className="inline"
          keyValue="startDate"
          label="Bắt đầu:"
          value={data.startDate ?? ""}
          onChange={setData}
        />
        <DateInput
          className="inline"
          keyValue="endDate"
          label="Kết thúc:"
          value={data.endDate ?? ""}
          onChange={setData}
        />
        <InputModal
          className="inline suffix"
          keyValue="scale"
          label="Quy mô:"
          placeholder="Quy mô"
          value={data.scale ?? ""}
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
      handleOk={() => {
        handleCreateProject(data);
      }}
      handleCancel={toggleModal}
      title="Thêm dự án"
      content={renderContent()}
    />
  );
}
