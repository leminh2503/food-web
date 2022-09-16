import {
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {Modal, notification, Table} from "antd";
import moment from "moment";
import {useRouter} from "next/router";
import React, {useState} from "react";
import {ERolePosition, IProject, IProjectMember} from "@app/types";
import ApiProject from "@app/api/ApiProject";
import {useMutation, useQuery} from "react-query";
import {ModalCreateProjectMember} from "@app/module/project-detail/components/ModalCreateProjectMember";
import {ModalEditProjectMember} from "./components/ModalEditProjectMember";
import {ModalEditProject} from "@app/module/project-detail/components/ModalEditProject";
import {queryKeys} from "@app/utils/constants/react-query";

export function ProjectDetail(): JSX.Element {
  const router = useRouter();
  const {id} = router.query;
  const [member, setMember] = useState<IProjectMember>();
  const [isModalVisible, setIsModalVisible] = useState("");

  const getProjectById = (): Promise<IProject> => {
    return ApiProject.getProjectById(Number(id));
  };

  const {data: dataProjectById} = useQuery(
    queryKeys.GET_PROJECT_BY_ID,
    getProjectById
  );

  const showModalCreateProjectMember = (): void => {
    setIsModalVisible("modalCreateProjectMember");
  };

  const showModalEditProjectMember = (): void => {
    setIsModalVisible("modalEditProjectMember");
  };

  const showModalEditProject = (): void => {
    setIsModalVisible("modalEditProject");
  };

  const toggleModal = (): void => {
    setIsModalVisible("");
  };

  const getProjectMember = (): Promise<IProjectMember[]> => {
    return ApiProject.getProjectMember(Number(id));
  };

  const {data: dataProjectMember, refetch} = useQuery(
    queryKeys.GET_LIST_PROJECT_MEMBER,
    getProjectMember
  );

  const deleteProjectMemberMutation = useMutation(
    ApiProject.deleteProjectMember
  );
  const handleDeleteProjectMember = (record: IProjectMember): void => {
    Modal.confirm({
      title: "Bạn có muốn xóa thành viên khỏi dự án?",
      content: "Thành viên sẽ bị xóa vĩnh viễn!",
      okType: "primary",
      cancelText: "Huỷ",
      okText: "Xóa",
      onOk: () => {
        if (record.id) {
          deleteProjectMemberMutation.mutate(
            {projectId: Number(id), userIds: [Number(record.id)]},
            {
              onSuccess: () => {
                notification.success({
                  duration: 1,
                  message: "Xóa thành viên thành công!",
                });
                refetch();
              },
              onError: () => {
                notification.error({
                  duration: 1,
                  message: "Xóa thành viên thất bại!",
                });
              },
            }
          );
        }
      },
    });
  };

  return (
    <div className="container-project">
      <div className="flex justify-between items-center mb-5">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
        <button type="button" onClick={showModalEditProject}>
          <EditOutlined style={{color: "#0092ff", fontSize: 25}} />
        </button>
      </div>
      <div>
        <Table
          columns={[
            {
              title: "Tên dự án",
              dataIndex: "name",
              key: "name",
              align: "center",
            },
            {
              title: "Khách hàng",
              dataIndex: "customer",
              key: "customer",
              align: "center",
            },
            {
              title: "Ngày bắt đầu",
              dataIndex: "startDate",
              key: "startDate",
              align: "center",
              render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
            },
            {
              title: "Ngày kết thúc",
              dataIndex: "endDate",
              key: "endDate",
              align: "center",
              render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
            },
            {
              title: "Kỹ thuật",
              dataIndex: "technicality",
              key: "technicality",
              align: "center",
            },
            {
              title: "Công cụ sử dụng",
              dataIndex: "use",
              key: "use",
              align: "center",
            },
            {
              title: "Mô tả",
              dataIndex: "description",
              key: "description",
              align: "center",
            },
            {
              title: "Trạng thái",
              dataIndex: "state",
              key: "state",
              align: "center",
              render: (state) =>
                state === 0
                  ? "Mới khởi tạo"
                  : state === 1
                  ? "Đang phát triển"
                  : state === 2
                  ? "Đã kết thúc"
                  : "Đã hủy",
            },
          ]}
          dataSource={dataProjectById ? [dataProjectById] : []}
          bordered
          pagination={false}
        />
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-center w-full font-medium">
            DANH SÁCH THÀNH VIÊN TRONG DỰ ÁN
          </h3>
          <div className="flex items-center">
            <button
              type="button"
              className="mr-2"
              onClick={showModalCreateProjectMember}
            >
              <PlusCircleOutlined style={{color: "#0092ff", fontSize: 20}} />
            </button>
          </div>
        </div>
        <Table
          columns={[
            {
              title: "STT",
              align: "center",
              width: 100,
              render: (_, record, index) => <div>{index + 1}</div>,
            },
            {
              title: "Tên",
              align: "center",
              render: (_, record) => record.user?.fullName,
            },
            {
              title: "Vai trò",
              align: "center",
              dataIndex: "role",
              key: "role",
              render: (role) =>
                role === ERolePosition.BACKEND_DEV
                  ? "Backend Dev"
                  : role === ERolePosition.FRONTEND_DEV
                  ? "Frontend Dev"
                  : role === ERolePosition.TESTER
                  ? "Tester"
                  : role === ERolePosition.BA
                  ? "BA"
                  : role === ERolePosition.DESIGNER
                  ? "Designer"
                  : "",
            },
            {
              title: "Công số",
              align: "center",
              children: [
                {
                  title: "Hợp đồng",
                  align: "center",
                  dataIndex: "contract",
                  key: "contract",
                },
                {
                  title: "Thực tế",
                  align: "center",
                  dataIndex: "reality",
                  key: "reality",
                },
                {
                  title: "OT",
                  align: "center",
                  dataIndex: "overtime",
                  key: "overtime",
                },
              ],
            },
            {
              title: "Thời gian",
              align: "center",
              children: [
                {
                  title: "Bắt đầu",
                  align: "center",
                  dataIndex: "startDate",
                  key: "startDate",
                  render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
                },
                {
                  title: "Kết thúc",
                  align: "center",
                  dataIndex: "endDate",
                  key: "endDate",
                  render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
                },
              ],
            },
            {
              title: "Hành động",
              align: "center",
              render: (_, record) => (
                <div>
                  <button
                    type="button"
                    className="mr-4"
                    onClick={() => {
                      setMember(record);
                      showModalEditProjectMember();
                    }}
                  >
                    <EditOutlined style={{color: "#0092ff", fontSize: 20}} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleDeleteProjectMember(record);
                    }}
                  >
                    <DeleteOutlined style={{color: "#cb2131", fontSize: 20}} />
                  </button>
                </div>
              ),
            },
          ]}
          dataSource={dataProjectMember}
          bordered
          pagination={false}
        />
        <ModalCreateProjectMember
          isModalVisible={isModalVisible === "modalCreateProjectMember"}
          toggleModal={toggleModal}
          projectId={Number(id)}
        />
        {member && (
          <ModalEditProjectMember
            isModalVisible={isModalVisible === "modalEditProjectMember"}
            toggleModal={toggleModal}
            projectId={Number(id)}
            member={member}
          />
        )}
        <ModalEditProject
          isModalVisible={isModalVisible === "modalEditProject"}
          toggleModal={toggleModal}
          projectId={Number(id)}
        />
      </div>
    </div>
  );
}
