import "../my-salary-detail/index.scss";
import React, {useEffect, useState} from "react";
import {Card, InputNumber, Modal, notification, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import {getDayOnMonth} from "@app/utils/date/getDayOnMonth";
import {findDayOnWeek} from "@app/utils/date/findDayOnWeek";
import ModalCreateOnsite from "./ModalCreateOnsite";
import {CheckCircleFilled, EditFilled} from "@ant-design/icons";
import ApiSalary from "@app/api/ApiSalary";
import {useMutation, useQuery} from "react-query";
import {formatNumber} from "@app/utils/fomat/FormatNumber";
import {IDataOnsite, IDataProjectList} from "@app/types";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

export default function OnsiteSalaryTable({
  idUser,
  idTotal,
  month,
  year,
  isManager,
  projectName,
  idProject,
  setDailyOnsiteRate2,
  dailyOnsiteRate,
  setOnsiteSalary,
  listProject,
  totalSalaryOS,
}: {
  setDailyOnsiteRate2?: (val: number) => void;
  idTotal?: number;
  idProject?: number;
  totalSalaryOS?: number;
  dailyOnsiteRate?: number;
  listProject?: IDataProjectList[];
  setOnsiteSalary?: (val: number) => void;
  projectName?: string;
  idUser: number | string;
  isManager?: boolean;
  month: number;
  year: number;
}): JSX.Element {
  const [disableCheck] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [salary, setSalary] = useState<number>(dailyOnsiteRate || 0);

  const updateDataOnsite = useMutation(ApiSalary.updateOnsiteSalary);

  const showModal = (): void => {
    setIsModalVisible(true);
  };

  const handleOk = (): void => {
    setIsModalVisible(false);
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const getListOnsiteSalary = (): Promise<IDataOnsite[]> => {
    if (idProject) {
      return ApiSalary.getMyListOnsiteSalary(
        year,
        month,
        Number(idUser),
        Number(idProject)
      );
    }
    if (isManager) {
      return ApiSalary.getMyListOnsiteSalary(year, month, Number(idUser));
    }
    return ApiSalary.getMyListOnsiteSalary(year, month);
  };

  const {
    data: dataOnsite,
    refetch,
    isRefetching,
  } = useQuery("listOnsiteSalaryUser" + isManager, getListOnsiteSalary) || [];

  const handleUpdate = (): void => {
    const body = dataOnsite?.map((el) => {
      return el.id;
    });
    if (body) {
      updateDataOnsite.mutate({ids: body}, {onSuccess: refetch});
    }
  };

  const columns: ColumnsType<IDataOnsite[]> = [
    {
      title: (
        <>
          {CheckPermissionEvent(
            NameEventConstant.PERMISSION_SALARY_MANAGER_KEY.ADD_ONSITE_SALARY
          ) && (
            <EditFilled
              onClick={showModal}
              className="text-[20px] text-[#0092ff] mr-3"
            />
          )}
          {isManager &&
            CheckPermissionEvent(
              NameEventConstant.PERMISSION_SALARY_MANAGER_KEY
                .ACCEPT_SALARY_ONSITE
            ) && (
              <CheckCircleFilled
                className={
                  disableCheck
                    ? "text-[20px] text-[#ADE597FF] hover:cursor-not-allowed"
                    : "text-[20px] text-[green]"
                }
                onClick={(): void => {
                  if (!disableCheck) {
                    Modal.confirm({
                      title: "Bạn muốn duyệt tất cả lương Onsite ?",
                      centered: true,
                      onOk: handleUpdate,
                    });
                  }
                }}
                disabled={disableCheck}
              />
            )}
        </>
      ),
      dataIndex: "col1",
      key: "col1",
      align: "center",
      width: "150px",
      fixed: "left",
    },
  ];

  const data: any = [
    {col1: "Ngày"},
    {col1: "Thứ"},
    {col1: "Địa điểm Onsite"},
    {col1: "Duyệt"},
  ];

  useEffect(() => {
    const totalSalary2 = (dataOnsite?.length || 0) * (dailyOnsiteRate || 0);
    if (setOnsiteSalary) {
      setOnsiteSalary(totalSalary2);
    }
  }, [isRefetching, dailyOnsiteRate, dataOnsite?.length]);

  for (let i = 1; i <= getDayOnMonth(month, year); i++) {
    let check = 0;
    dataOnsite?.map((el) => {
      if (
        el.date ===
        year + "-" + formatNumber(month) + "-" + formatNumber(i)
      ) {
        check += 1;
        columns.push({
          title: "",
          key: i,
          align: "center",
          width: "130px",
          render: (index, _item) => {
            if (index.col1 === "Ngày") {
              return <span>{i}</span>;
            }
            if (index.col1 === "Thứ") {
              return <span>{findDayOnWeek(year, month, i)}</span>;
            }
            if (index.col1 === "Địa điểm Onsite") {
              return <span>{el?.onsitePlace}</span>;
            }
            return (
              <span
                className={
                  el.state === 0
                    ? "text-[#c4c2c2]"
                    : el.state === 1
                    ? "text-[#0092ff]"
                    : "text-[#cb2131]"
                }
              >
                {el.state === 0
                  ? "Chưa duyệt"
                  : el.state === 1
                  ? "Đã duyệt"
                  : "Đã huỷ"}
              </span>
            );
          },
        });
      }
      return el;
    });
    if (check === 0) {
      columns.push({
        title: "",
        key: i,
        align: "center",
        width: "130px",
        render: (index, _item) => {
          if (index.col1 === "Ngày") {
            return <span>{i}</span>;
          }
          if (index.col1 === "Thứ") {
            return <span>{findDayOnWeek(year, month, i)}</span>;
          }
          if (index.col1 === "Địa điểm Onsite") {
            return <span> </span>;
          }
          return <span> </span>;
        },
      });
    }
  }
  return (
    <Card className="max-w-full">
      <ModalCreateOnsite
        idUser={Number(idUser)}
        dataOnsite={dataOnsite || []}
        month={month}
        refetchDataOnsite={refetch}
        year={year}
        projectName={projectName}
        isManager={isManager}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        listProject={listProject}
      />
      <div className="flex mb-4 justify-between">
        <div className=" font-bold">
          Lương Onsite :{" "}
          {dailyOnsiteRate
            ? (
                (dataOnsite?.length || 0) * (dailyOnsiteRate || 0)
              ).toLocaleString("en-US")
            : totalSalaryOS?.toLocaleString("en-US")}{" "}
          VND
        </div>
        {dailyOnsiteRate &&
          (!isUpdate ? (
            <div className="mb-4 font-bold">
              {" "}
              {dailyOnsiteRate?.toLocaleString("en-US")} VND/ngày
              <EditFilled
                className="text-[20px] text-[#0092ff] ml-2"
                onClick={(): void => setIsUpdate(true)}
              />
            </div>
          ) : (
            <div className="mb-4 font-bold flex items-center">
              <InputNumber
                defaultValue={dailyOnsiteRate.toString()}
                className="w-full"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                onChange={(e) => {
                  setSalary(Number(e));
                }}
              />
              <CheckCircleFilled
                className="text-[green] text-[20px] ml-2"
                onClick={(): void => {
                  if (idTotal && setDailyOnsiteRate2) {
                    ApiSalary.updateOSSalary(idTotal, salary).then((r) => {
                      setDailyOnsiteRate2(salary);
                      setIsUpdate(false);
                      notification.success({message: "update success"});
                    });
                  }
                }}
              />
            </div>
          ))}
      </div>

      <Table
        columns={columns}
        dataSource={data}
        bordered
        pagination={false}
        scroll={{x: "calc( 100vw - 292px)"}}
      />
    </Card>
  );
}
