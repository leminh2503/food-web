import "./index.scss";
import React, {useEffect, useState} from "react";
import ProjectSalaryTable from "@app/module/ProjectSalaryTable/ProjectSalaryTable";
import {LeftOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import {formatNumber} from "@app/utils/fomat/FormatNumber";
import OnsiteSalaryTable from "@app/module/OnsiteSalaryTable";
import OtherSalaryTable from "@app/module/OtherSalaryTable/OtherSalaryTable";
import OverTimeSalaryTable from "@app/module/OverTimeSalaryTable";
import ApiUser from "@app/api/ApiUser";
import DeductionSalaryTable from "@app/module/DeductionSalaryTable/DeductionSalaryTable";
import {IDataProjectList, IDataSalary} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {queryKeys} from "@app/utils/constants/react-query";
import {Table} from "antd";
import ApiLeaveWork, {IDaysAllowedLeave} from "@app/api/ApiLeaveWork";
import {ModalCustom} from "@app/components/ModalCustom";

export function MySalaryDetail(): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState("");

  const showModalTaxSalary = (): void => {
    setIsModalVisible("taxSalary");
  };

  const toggleModal = (): void => {
    setIsModalVisible("");
  };

  const router = useRouter();
  const {month, year, id, userId, onsiteSalary, state} = router.query;
  const baseSalary = Number(ApiUser.getInfoMe()?.baseSalary || 0);
  const manageSalary =
    ApiUser.getInfoMe()?.manageSalary?.toLocaleString("en-US");

  const totalSalaryById = (): Promise<IDataSalary> => {
    return ApiSalary.getTotalSalaryById(
      Number(id),
      Number(year),
      Number(month)
    );
  };

  const {data: dataTotalSalaryById, refetch: refetchTotalSalaryById} = useQuery(
    queryKeys.GET_TOTAL_SALARY_BY_ID,
    totalSalaryById,
    {
      enabled: false,
    }
  );

  const getListProject = (): Promise<IDataProjectList[]> => {
    return ApiSalary.getListProjectOfMe();
  };
  const {data: listProject, refetch: listProjectRefetch} =
    useQuery("listProjectMe", getListProject, {enabled: false}) || [];

  const getDaysAllowedLeaveById = (): Promise<IDaysAllowedLeave> => {
    return ApiLeaveWork.getDaysAllowedLeaveById(Number(userId));
  };

  const {data: daysAllowedLeaveById, refetch: refetchDaysAllowedLeaveById} =
    useQuery(queryKeys.GET_DAY_ALLOWS_LEAVE_BY_ID, getDaysAllowedLeaveById, {
      enabled: false,
    });

  const dailyOnsiteRate = dataTotalSalaryById
    ? dataTotalSalaryById.dailyOnsiteRate
    : null;

  useEffect(() => {
    if (month && year) {
      listProjectRefetch();
    }
  }, [month, year]);

  useEffect(() => {
    if (id) {
      refetchTotalSalaryById();
    }
  }, [id]);

  useEffect(() => {
    if (userId) {
      refetchDaysAllowedLeaveById();
    }
  }, [userId]);

  const renderContent = (): JSX.Element => (
    <div className="p-4 bg-white shadow-2xl">
      <Table
        columns={[
          {
            title: "Giảm trừ gia cảnh",
            dataIndex: "deductionOwn",
            align: "center",
            render: (_, record) =>
              (record.deductionOwn ?? 11000000).toLocaleString("en-US") +
              " VND",
          },
          {
            title: "Giảm trừ gia cảnh người phụ thuộc",
            dataIndex: "deductionFamilyCircumstances",
            align: "center",
            render: (_, record) =>
              (record.deductionFamilyCircumstances ?? 0).toLocaleString(
                "en-US"
              ) + " VND",
          },
          {
            title: "Thu nhập chịu thuế",
            dataIndex: "taxableSalary",
            align: "center",
            render: (_, record) =>
              (record.taxableSalary ?? 0).toLocaleString("en-US") + " VND",
          },
          {
            title: "Thuế suất",
            dataIndex: "tax",
            align: "center",
            render: (_, record) => (record.tax ?? 0) + "%",
          },
          {
            title: "Thuế thu nhập cá nhân",
            dataIndex: "taxSalary",
            align: "center",
            render: (_, record) =>
              (record.taxSalary ?? 0).toLocaleString("en-US") + " VND",
          },
        ]}
        dataSource={
          dataTotalSalaryById?.detailTaxSalary
            ? [dataTotalSalaryById?.detailTaxSalary]
            : []
        }
        pagination={false}
      />
    </div>
  );

  return (
    <div className="container-salary-table-detail">
      <div className="flex items-center mb-6">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
        <span className="ml-2">
          Lương tháng {formatNumber(Number(month)) + "/" + year}
        </span>
      </div>
      <div className="flex items-center mb-6">
        <span>Lương cứng : {baseSalary}</span>
        <span className="ml-4">Lương quản lý : {manageSalary}</span>
      </div>
      {month && year && (
        <div className="flex justify-between">
          <ProjectSalaryTable
            userId={Number(ApiUser.getInfoMe()?.id) || 0}
            month={Number(month)}
            year={Number(year)}
          />
          <OtherSalaryTable
            userId={Number(ApiUser.getInfoMe()?.id) || 0}
            month={Number(month)}
            year={Number(year)}
          />
        </div>
      )}
      {month && year && (
        <div className="mt-4">
          <OnsiteSalaryTable
            idUser={ApiUser.getInfoMe()?.id || ""}
            month={Number(month)}
            year={Number(year)}
            listProject={listProject}
            totalSalaryOS={Number(onsiteSalary || 0)}
            dailyOnsiteRate={dailyOnsiteRate}
            state={Number(state)}
          />
        </div>
      )}
      {month && year && (
        <div className="mt-4">
          <OverTimeSalaryTable
            baseSalary={Number(baseSalary || 0)}
            listProject={listProject}
            idUser={ApiUser.getInfoMe()?.id || ""}
            month={Number(month)}
            year={Number(year)}
            state={Number(state)}
          />
        </div>
      )}
      {month && year && daysAllowedLeaveById && (
        <div className="mt-4">
          <DeductionSalaryTable
            baseSalary={Number(baseSalary || 0)}
            month={Number(month)}
            year={Number(year)}
            userId={Number(ApiUser.getInfoMe()?.id) || 0}
            daysAllowedLeaveById={daysAllowedLeaveById?.quantity}
          />
        </div>
      )}
      <div className="flex justify-center mt-6 bg-white p-4">
        <table className="custom-table">
          <tr className="font-bold text-[26px]">
            <th>
              <p className="mb-4">Tổng lương trước thuế:</p>
            </th>
            <td className="mb-4">
              <p className="mb-4">
                {(dataTotalSalaryById?.totalSalary || 0).toLocaleString(
                  "en-US"
                )}{" "}
                VND
              </p>
            </td>
          </tr>
          <tr
            className="font-bold text-[18px] hover-pointer"
            onClick={showModalTaxSalary}
          >
            <th>
              <p>Thuế thu nhập cá nhân:</p>
            </th>
            <td>
              <p>
                {(
                  dataTotalSalaryById?.detailTaxSalary.taxSalary ?? 0
                ).toLocaleString("en-US")}{" "}
                VND
              </p>
            </td>
          </tr>
          <tr className="font-bold text-[26px]">
            <th>
              <p className="mt-4">Tổng lương sau thuế:</p>
            </th>
            <td>
              <p className="mt-4">
                {(dataTotalSalaryById?.afterTaxSalary ?? 0).toLocaleString(
                  "en-US"
                )}{" "}
                VND
              </p>
            </td>
          </tr>
        </table>
      </div>
      <ModalCustom
        isModalVisible={isModalVisible === "taxSalary"}
        handleCancel={toggleModal}
        title="Chi tiết thuế thu nhập cá nhân"
        width="400"
        content={renderContent()}
        footer={null}
      />
    </div>
  );
}
