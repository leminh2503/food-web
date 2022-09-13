import "../my-salary-detail/index.scss";
import React, {useState} from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {IDataBonus} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {EditFilled} from "@ant-design/icons";
import ModalOtherSalary from "@app/module/OtherSalaryTable/ModalOtherSalary";

export default function OtherSalaryTable({
  month,
  year,
  userId,
  isAdmin,
}: {
  isAdmin?: boolean;
  userId?: number;
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

  const getBonusSalary = (): Promise<IDataBonus[]> => {
    return ApiSalary.getMyBonusSalary(year, month);
  };

  const {data: datBonus} = useQuery("bonusSalary", getBonusSalary) || [];
  const columns: ColumnsType<IDataBonus> = [
    {
      title: "Số tiền",
      dataIndex: "salary",
      key: "salary",
      align: "center",
      render: (_, record, index) => (
        <div>{record?.salary?.toLocaleString("en-US")}</div>
      ),
    },
    {
      title: "lý do",
      dataIndex: "reason",
      key: "reason",
      align: "center",
    },
  ];

  const data: IDataBonus[] =
    datBonus?.map((el) => {
      return {salary: el?.salary, reason: el?.reason};
    }) || [];

  return (
    <Card className="w-full">
      {isAdmin && (
        <ModalOtherSalary
          month={month}
          year={year}
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          userId={Number(userId)}
        />
      )}
      <div className="flex items-center justify-between">
        <div className="mb-4 font-bold">Lương Khác :</div>
        {isAdmin && (
          <EditFilled
            onClick={showModal}
            className="text-[20px] text-[#0092ff] mr-3"
          />
        )}
      </div>
      <Table
        columns={columns}
        dataSource={data || []}
        bordered
        pagination={false}
      />
    </Card>
  );
}
