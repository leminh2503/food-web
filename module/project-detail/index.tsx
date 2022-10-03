import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LeftOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import {Button, Image, Modal, notification, Progress, Table} from "antd";
import moment from "moment";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {
  EProjectState,
  ERolePosition,
  IProject,
  IProjectMember,
  IUserLogin,
} from "@app/types";
import ApiProject from "@app/api/ApiProject";
import {useMutation, useQuery} from "react-query";
import {ModalCreateProjectMember} from "@app/module/project-detail/components/ModalCreateProjectMember";
import {ModalEditProjectMember} from "./components/ModalEditProjectMember";
import {ModalEditProject} from "@app/module/project-detail/components/ModalEditProject";
import {queryKeys} from "@app/utils/constants/react-query";
import {IMetadata} from "@app/api/Fetcher";
import ApiUser from "@app/api/ApiUser";
import {renameKeys} from "@app/utils/convert/ConvertHelper";
import {countDownTime} from "@app/utils/date/countDownTime";

export function ProjectDetail(): JSX.Element {
  const router = useRouter();
  const {id} = router.query;
  const [member, setMember] = useState<IProjectMember>();
  const [isModalVisible, setIsModalVisible] = useState("");

  const getProjectById = (): Promise<IProject> => {
    return ApiProject.getProjectById(Number(id));
  };

  const getUser = (): Promise<{data: IUserLogin[]; meta: IMetadata}> => {
    return ApiUser.getUserAccount();
  };

  const getProjectMember = (): Promise<IProjectMember[]> => {
    return ApiProject.getProjectMember(Number(id));
  };

  const {data: dataProjectById, refetch: refetchProjectById} = useQuery(
    queryKeys.GET_PROJECT_BY_ID,
    getProjectById,
    {enabled: false}
  );

  const {data: dataUser} = useQuery(
    queryKeys.GET_LIST_USER_FOR_PROJECT,
    getUser
  );

  const {data: dataProjectMember, refetch: refetchProjectMember} = useQuery(
    queryKeys.GET_LIST_PROJECT_MEMBER,
    getProjectMember,
    {
      enabled: false,
    }
  );

  useEffect(() => {
    if (id) {
      refetchProjectById();
      refetchProjectMember();
    }
  }, [id]);

  const newKeys = {id: "value", fullName: "label"};
  const listUserConvert: {value: number; label: string}[] = [];
  dataUser?.data?.map((item) => {
    const renamedObj = renameKeys(item || {}, newKeys);
    listUserConvert.push(renamedObj);
    return listUserConvert;
  });

  const listPosition = [
    {
      value: ERolePosition.BACKEND_DEV,
      label: "Backend Dev",
    },
    {
      value: ERolePosition.FRONTEND_DEV,
      label: "Frontend Dev",
    },
    {
      value: ERolePosition.TESTER,
      label: "Tester",
    },
    {
      value: ERolePosition.BA,
      label: "BA",
    },
    {
      value: ERolePosition.DESIGNER,
      label: "Designer",
    },
  ];

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
                refetchProjectMember();
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

  const [visibleCountDown, setVisibleCountDown] = useState(false);
  const [countDownTimer, setCountDownTimer] = useState<string | number>();
  const [timeCheck, setTimeCheck] = useState<string | number>();
  useEffect(() => {
    if (dataProjectById?.endDate) {
      setInterval(() => {
        setCountDownTimer(countDownTime(dataProjectById?.endDate || ""));
        setTimeCheck(countDownTime(dataProjectById?.endDate || ""));
      }, 1000);
    }
  }, [dataProjectById?.endDate]);

  return (
    <div className="container-project">
      <Modal
        title={null}
        footer={null}
        wrapClassName="modal-countdown"
        visible={visibleCountDown}
        onCancel={(): void => setVisibleCountDown(false)}
      >
        <div className="text-[6vw] text-[white] flex justify-center">
          {dataProjectById && dataProjectById?.name}
        </div>
        <div className="text-[3vw] text-[white] row-all-center">
          <Image
            src={
              dataProjectById?.projectManager?.avatar ??
              "/img/avatar/avatar.jpg"
            }
            width="7vw"
            className="rounded-[50%]"
            fallback="/img/avatar/avatar.jpg"
          />
        </div>
        <div className="text-[3vw] text-[white] row-all-center">
          <div>PM: {dataProjectById?.projectManager?.fullName}</div>
        </div>
        <div
          className={
            "text-[8vw] mt-[30px] flex justify-center " +
            (Number(timeCheck) > 7 ||
            (dataProjectById?.projectProgress || 0) >= 100
              ? "text-[white]"
              : "text-[#ff4d4f]")
          }
        >
          {countDownTimer}
        </div>
        <Progress
          percent={dataProjectById?.projectProgress}
          status="active"
          className="mt-8"
        />
      </Modal>
      <div className="flex justify-between items-center mb-5">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
        <div className="flex">
          <Button
            type="primary"
            className="btn-primary flex items-center mr-6"
            onClick={(): void => {
              setVisibleCountDown(true);
            }}
          >
            <EyeOutlined />
            <span className="ml-2"> Tiến độ dự án </span>
          </Button>

          <button type="button" onClick={showModalEditProject}>
            <EditOutlined style={{color: "#0092ff", fontSize: 25}} />
          </button>
        </div>
      </div>
      <div>
        <Table
          columns={[
            {
              title: "Tên dự án",
              dataIndex: "name",
              key: "name",
              align: "center",
              width: 200,
            },
            {
              title: "Khách hàng",
              dataIndex: "customer",
              key: "customer",
              align: "center",
              width: 200,
            },
            {
              title: "Ngày bắt đầu",
              dataIndex: "startDate",
              key: "startDate",
              align: "center",
              width: 200,
              render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
            },
            {
              title: "Ngày kết thúc dự kiến",
              dataIndex: "endDate",
              key: "endDate",
              align: "center",
              width: 200,
              render: (date) => moment(new Date(date)).format("DD-MM-YYYY"),
            },
            {
              title: "Kỹ thuật",
              dataIndex: "technicality",
              key: "technicality",
              align: "center",
              width: 200,
            },
            {
              title: "Công cụ sử dụng",
              dataIndex: "use",
              key: "use",
              align: "center",
              width: 200,
            },
            {
              title: "Mô tả",
              dataIndex: "description",
              key: "description",
              align: "center",
              width: 300,
            },
            {
              title: "Trạng thái",
              dataIndex: "state",
              key: "state",
              align: "center",
              width: 200,
              render: (state) =>
                state === EProjectState.MOI_KHOI_TAO
                  ? "Mới khởi tạo"
                  : state === EProjectState.DANG_THUC_HIEN
                  ? "Đang thực hiện"
                  : state === EProjectState.DA_KET_THUC
                  ? "Đã kết thúc"
                  : state === EProjectState.DA_HUY
                  ? "Đã hủy"
                  : "",
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
                  render: (reality) => (reality === null ? 0 : reality),
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
                    onClick={(): void => {
                      setMember(record);
                      showModalEditProjectMember();
                    }}
                  >
                    <EditOutlined style={{color: "#0092ff", fontSize: 20}} />
                  </button>

                  <button
                    type="button"
                    onClick={(): void => {
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

        {dataProjectById && (
          <ModalCreateProjectMember
            isModalVisible={isModalVisible === "modalCreateProjectMember"}
            toggleModal={toggleModal}
            projectId={Number(id)}
            dataProjectById={dataProjectById}
            listUserConvert={listUserConvert}
            listPosition={listPosition}
          />
        )}
        {member && dataProjectById && (
          <ModalEditProjectMember
            isModalVisible={isModalVisible === "modalEditProjectMember"}
            toggleModal={toggleModal}
            projectId={Number(id)}
            dataProjectById={dataProjectById}
            member={member}
            listPosition={listPosition}
          />
        )}
        {dataProjectById && (
          <ModalEditProject
            isModalVisible={isModalVisible === "modalEditProject"}
            toggleModal={toggleModal}
            listUserConvert={listUserConvert}
            dataProjectById={dataProjectById}
          />
        )}
      </div>
    </div>
  );
}
