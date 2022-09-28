import "./index.scss";
import React from "react";
import {useRouter} from "next/router";
import OnsiteSalaryTable from "@app/module/OnsiteSalaryTable";
import OverTimeSalaryTable from "@app/module/OverTimeSalaryTable";
import {LeftOutlined} from "@ant-design/icons";
import {formatNumber} from "@app/utils/fomat/FormatNumber";

export function SalaryTableDetail(): JSX.Element {
  const router = useRouter();
  const {month, projectName, year, idUser, userName, idProject} = router.query;

  return (
    <div>
      <div className="flex items-center mb-6">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
        <span className="ml-2 text-[18px] font-bold">
          Duyệt lương tháng {formatNumber(Number(month)) + "/" + year}
        </span>
      </div>
      <div className="flex items-center mb-6">
        <span className="ml-2 text-[18px] font-bold">
          Nhân viên : {userName}
        </span>
      </div>
      {month && year && (
        <div className="mt-4">
          <OnsiteSalaryTable
            idUser={idUser?.toString() || ""}
            projectName={projectName?.toString() || ""}
            idProject={Number(idProject || 0)}
            isManager
            month={Number(month)}
            year={Number(year)}
          />
        </div>
      )}
      {month && year && (
        <div className="mt-4">
          <OverTimeSalaryTable
            projectName={projectName?.toString() || ""}
            idUser={idUser?.toString() || ""}
            isManager
            month={Number(month)}
            year={Number(year)}
            idProject={Number(idProject || 0)}
          />
        </div>
      )}
    </div>
  );
}
