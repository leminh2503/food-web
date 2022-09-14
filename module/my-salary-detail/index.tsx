import "./index.scss";
import React from "react";
import ProjectSalaryTable from "@app/module/ProjectSalaryTable/ProjectSalaryTable";
import {LeftOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import {formatNumber} from "@app/utils/fomat/FormatNumber";
import OnsiteSalaryTable from "@app/module/OnsiteSalaryTable";
import OtherSalaryTable from "@app/module/OtherSalaryTable/OtherSalaryTable";
import OverTimeSalaryTable from "@app/module/OverTimeSalaryTable";
import ApiUser from "@app/api/ApiUser";
import DeductionSalaryTable from "@app/module/DeductionSalaryTable/DeductionSalaryTable";
import {IDataProjectList} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";

export function MySalaryDetail(): JSX.Element {
  const router = useRouter();
  const {month} = router.query;
  const {year} = router.query;
  const baseSalary = ApiUser.getInfoMe()?.baseSalary?.toLocaleString("en-US");
  const manageSalary =
    ApiUser.getInfoMe()?.manageSalary?.toLocaleString("en-US");
  const userId = ApiUser.getInfoMe()?.id;

  const getListProject = (): Promise<IDataProjectList[]> => {
    return ApiSalary.getListProjectOfMe(Number(userId));
  };
  const {data: listProject} = useQuery("listProjectMe", getListProject) || [];

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
          />
        </div>
      )}
    </div>
  );
}
