import "./index.scss";
import React from "react";
import {ProjectSalaryTable} from "@app/module/my-salary-detail/ProjectSalaryTable";
import {OtherSalaryTable} from "@app/module/my-salary-detail/OtherSalaryTable";
import {LeftOutlined} from "@ant-design/icons";
import {useRouter} from "next/router";
import {OnsiteSalaryTable} from "@app/module/my-salary-detail/OnsiteSalaryTable";
import {OverTimeSalaryTable} from "@app/module/my-salary-detail/OverTimeSalaryTable";

export function MySalaryDetail(): JSX.Element {
  const router = useRouter();
  const {month} = router.query;
  const {year} = router.query;
  const baseSalary = 0;
  const manageSalary = 0;

  return (
    <div>
      <div className="flex items-center mb-6">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
        <span className="ml-2">Lương tháng {month + "/" + year}</span>
      </div>
      <div className="flex items-center mb-6">
        <span>Lương cứng : {baseSalary}</span>
        <span className="ml-4">Lương quản lý : {manageSalary}</span>
      </div>
      <div className="flex justify-between">
        <ProjectSalaryTable />
        <OtherSalaryTable />
      </div>
      {month && year && (
        <div className="mt-4">
          <OnsiteSalaryTable month={Number(month)} year={Number(year)} />
        </div>
      )}
      {month && year && (
        <div className="mt-4">
          <OverTimeSalaryTable month={Number(month)} year={Number(year)} />
        </div>
      )}
    </div>
  );
}
