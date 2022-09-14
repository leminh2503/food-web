import "../my-salary-detail/index.scss";
import React, {useEffect, useState} from "react";
import {Card, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {IDataBonus} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {CloseCircleOutlined, EditFilled} from "@ant-design/icons";
import ModalOtherSalary from "@app/module/OtherSalaryTable/ModalOtherSalary";

export default function OtherSalaryTable({
  month,
  year,
  userId,
  isAdmin,
  setBonusSalary,
}: {
  setBonusSalary?: (val: number) => void;
  isAdmin?: boolean;
  userId: number;
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
    return ApiSalary.getMyBonusSalary(year, month, userId);
  };

  const {
    data: datBonus,
    refetch,
    isRefetching,
  } = useQuery("bonusSalary" + userId, getBonusSalary) || [];
  const columns: ColumnsType<IDataBonus> = isAdmin
    ? [
        {
          title: "Số tiền",
          dataIndex: "salary",
          key: "salary",
          align: "center",
          render: (_, record, index) => (
            <div>{record?.salary?.toLocaleString("en-US")} VND</div>
          ),
        },
        {
          title: "lý do",
          dataIndex: "reason",
          key: "reason",
          align: "center",
        },
        {
          title: "",
          align: "center",
          render: (index, _record): JSX.Element => {
            return (
              <CloseCircleOutlined
                onClick={(): void => {
                  ApiSalary.deleteBonusSalary(_record?.id || 0).then((r) =>
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
          title: "Số tiền",
          dataIndex: "salary",
          key: "salary",
          align: "center",
          render: (_, record, index) => (
            <div>{record?.salary?.toLocaleString("en-US")} VND</div>
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
      return {salary: el?.salary, reason: el?.reason, id: el.id};
    }) || [];

  useEffect(() => {
    const totalSalary2 =
      datBonus?.reduce(function (accumulator, element) {
        return accumulator + (element?.salary || 0);
      }, 0) || 0;
    if (setBonusSalary) {
      setBonusSalary(totalSalary2);
    }
  }, [isRefetching]);

  return (
    <Card className="w-full">
      {isAdmin && (
        <ModalOtherSalary
          month={month}
          year={year}
          handleRefetch={refetch}
          isModalVisible={isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          userId={Number(userId)}
        />
      )}
      <div className="flex items-center mb-4 justify-between">
        <div className="font-bold">
          Lương Khác :{" "}
          {datBonus
            ?.reduce(function (accumulator, element) {
              return accumulator + (element?.salary || 0);
            }, 0)
            ?.toLocaleString("en-US")}{" "}
          VND
        </div>
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
        dataSource={data || []}
        bordered
        pagination={false}
      />
    </Card>
  );
}
