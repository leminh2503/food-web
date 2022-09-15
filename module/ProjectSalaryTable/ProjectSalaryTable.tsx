import "../my-salary-detail/index.scss";
import React, {useEffect, useState} from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {IDataProject, IDataProjectList} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {CloseCircleOutlined, EditFilled} from "@ant-design/icons";
import ModalProjectSalary from "@app/module/ProjectSalaryTable/ModalProjectSalary";

export default function ProjectSalaryTable({
  month,
  year,
  listProject,
  userId,
  isAdmin,
  setProjectSalary,
}: {
  setProjectSalary?: (val: number) => void;
  isAdmin?: boolean;
  userId: number;
  listProject?: IDataProjectList[];
  month: number;
  year: number;
}): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (): void => {
    setIsModalVisible(true);
  };

  const handleOk = (): void => {
    setIsModalVisible(false);
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const getProjectSalary = (): Promise<IDataProject[]> => {
    return ApiSalary.getMyProjectSalary(year, month, userId);
  };

  const {
    data: dataProject,
    refetch,
    isRefetching,
  } = useQuery("projectSalary", getProjectSalary) || [];
  const columns: ColumnsType<IDataProject> = isAdmin
    ? [
        {
          title: "Dự án",
          dataIndex: "projectName",
          key: "projectName",
          align: "center",
        },
        {
          title: "Lương thưởng dự án",
          dataIndex: "salary",
          key: "salary",
          align: "center",
        },
        {
          title: "",
          align: "center",
          render: (index, _record): JSX.Element => {
            return (
              <CloseCircleOutlined
                onClick={(): void => {
                  ApiSalary.deleteProjectSalary(_record?.id || 0).then((r) =>
                    refetch()
                  );
                }}
                className="text-[red] text-[20px] hover-pointer"
              />
            );
          },
        },
      ]
    : [
        {
          title: "Dự án",
          dataIndex: "projectName",
          key: "projectName",
          align: "center",
        },
        {
          title: "Lương thưởng dự án",
          dataIndex: "salary",
          key: "salary",
          align: "center",
        },
      ];

  const data: IDataProject[] =
    dataProject?.map((el) => {
      return {salary: el?.salary, projectName: el?.project?.name, id: el.id};
    }) || [];
  useEffect(() => {
    const totalSalary2 =
      dataProject?.reduce(function (accumulator, element) {
        return accumulator + (element?.salary || 0);
      }, 0) || 0;
    if (setProjectSalary) {
      setProjectSalary(totalSalary2);
    }
  }, [isRefetching]);
  return (
    <Card className="w-full">
      {isAdmin && (
        <ModalProjectSalary
          month={month}
          year={year}
          handleRefetch={refetch}
          listProject={listProject}
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          userId={Number(userId)}
        />
      )}
      <div className="flex items-center mb-4 justify-between">
        <span className="font-bold">
          Lương dự án :
          {dataProject
            ?.reduce(function (accumulator, element) {
              return accumulator + (element?.salary || 0);
            }, 0)
            ?.toLocaleString("en-US")}{" "}
          VND
        </span>
        {isAdmin && (
          <EditFilled
            onClick={showModal}
            className="text-[20px] text-[#0092ff] mr-3"
          />
        )}
      </div>
      <Table
        loading={isRefetching}
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
      />
    </Card>
  );
}
