import "../my-salary-detail/index.scss";
import React, {useState} from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {IDataProject, IDataProjectList} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {EditFilled} from "@ant-design/icons";
import ModalProjectSalary from "@app/module/ProjectSalaryTable/ModalProjectSalary";

export default function ProjectSalaryTable({
  month,
  year,
  listProject,
  userId,
  isAdmin,
}: {
  isAdmin?: boolean;
  userId?: number;
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
    return ApiSalary.getMyProjectSalary(year, month);
  };

  const {data: dataProject} = useQuery("projectSalary", getProjectSalary) || [];
  const columns: ColumnsType<IDataProject> = [
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
      return {salary: el?.salary, reason: el?.projectName};
    }) || [];
  return (
    <Card className="w-full">
      {isAdmin && (
        <ModalProjectSalary
          month={month}
          year={year}
          listProject={listProject}
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          userId={Number(userId)}
        />
      )}
      <div className="flex items-center justify-between">
        <span className="mb-4 font-bold">Lương dự án :</span>
        {isAdmin && (
          <EditFilled
            onClick={showModal}
            className="text-[20px] text-[#0092ff] mr-3"
          />
        )}
      </div>
      <Table columns={columns} dataSource={data} bordered pagination={false} />
    </Card>
  );
}
