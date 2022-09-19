import "./index.scss";
import React, {useEffect} from "react";
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
import {Dropdown} from "antd";

export function MySalaryDetail(): JSX.Element {
  const router = useRouter();
  const {month} = router.query;
  const {year} = router.query;
  const {onsiteSalary} = router.query;
  const baseSalary = ApiUser.getInfoMe()?.baseSalary?.toLocaleString("en-US");
  const manageSalary =
    ApiUser.getInfoMe()?.manageSalary?.toLocaleString("en-US");
  const userId = ApiUser.getInfoMe()?.id;

  const getListProject = (): Promise<IDataProjectList[]> => {
    return ApiSalary.getListProjectOfMe(Number(userId));
  };
  const {data: listProject, refetch: listProjectRefetch} =
    useQuery("listProjectMe", getListProject, {enabled: false}) || [];
  const getListTotalSalary = (): Promise<IDataSalary[]> => {
    return ApiSalary.getMyListTotalSalary(Number(year), Number(month));
  };

  const {data: dataSalary, refetch: dataSalaryRefetch} =
    useQuery(queryKeys.GET_LIST_TOTAL_SALARY_OF_USER, getListTotalSalary, {
      enabled: false,
    }) || [];

  useEffect(() => {
    if (month && year) {
      listProjectRefetch();
      dataSalaryRefetch();
    }
  }, [month, year]);

  const menu = (
    <div className="p-4 bg-white shadow-2xl">
      {dataSalary?.map((el, index) => (
        <>
          <p className=" font-bold" key={index}>
            Tổng lương : {el?.totalSalary?.toLocaleString("en-US")} VND
          </p>
          <p className="mt-2 font-bold" key={index}>
            Giảm trừ gia cảnh cá nhân:{" "}
            {el?.detailTaxSalary?.deductionOwn?.toLocaleString("en-US")} VND
          </p>
          <p className="mt-2 font-bold" key={index}>
            Giảm trừ gia cảnh người phụ thuộc :{" "}
            {el?.detailTaxSalary?.deductionFamilyCircumstances?.toLocaleString(
              "en-US"
            )}{" "}
            VND
          </p>
          <p className="mt-2 font-bold" key={index}>
            Thu nhập chịu thuế :{" "}
            {el?.detailTaxSalary?.taxableSalary?.toLocaleString("en-US")} VND
          </p>
          <p className="mt-2 font-bold" key={index}>
            Thuế suất : {el?.detailTaxSalary?.tax?.toLocaleString("en-US")} %
          </p>
          <p className="mt-2 font-bold" key={index}>
            Thuế thu nhập cá nhân :{" "}
            {el?.detailTaxSalary?.taxSalary?.toLocaleString("en-US")} VND
          </p>
        </>
      ))}
    </div>
  );

  return (
    <div>
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
          />
        </div>
      )}
      {month && year && (
        <div className="mt-4">
          <DeductionSalaryTable
            baseSalary={Number(baseSalary || 0)}
            month={Number(month)}
            year={Number(year)}
            userId={Number(ApiUser.getInfoMe()?.id) || 0}
          />
        </div>
      )}
      <div className="mt-6 h-[150px] w-[300px] bg-white p-4">
        {dataSalary?.map((el, index) => (
          <>
            <Dropdown
              overlay={menu}
              placement="top"
              trigger={["click"]}
              arrow={{pointAtCenter: true}}
            >
              <p className="font-bold hover-pointer" key={index}>
                Thuế thu nhập cá nhân : {el?.taxSalary}
              </p>
            </Dropdown>
            <p className="mt-2 font-bold" key={index}>
              Tổng lương : {el?.totalSalary?.toLocaleString("en-US")} VND
            </p>
          </>
        ))}
      </div>
    </div>
  );
}
