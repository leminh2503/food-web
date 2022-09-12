import "./index.scss";
import {Select, Table} from "antd";
import type {ColumnsType} from "antd/es/table";
import React, {useEffect, useState} from "react";
import {useQuery} from "react-query";
import {useRouter} from "next/router";
import baseURL from "@app/config/baseURL";
import Config from "@app/config";
import ApiSalary from "@app/api/ApiSalary";
import {IDataProjectList} from "@app/types";
import ApiUser from "@app/api/ApiUser";

export function AcceptSalaryEmployee(): JSX.Element {
  const router = useRouter();
  const date = new Date();
  const userId = ApiUser.getInfoMe()?.id;
  const [year, setYear] = useState<number>(date.getFullYear());
  const [idProject, setIdProject] = useState<string>("0");
  const [nameProject, setNameProject] = useState<string>();
  const [month, setMonth] = useState<number>(date.getMonth() + 1);

  const getListTotalSalary = (): Promise<any> => {
    return ApiSalary.getUserOfProject(Number(idProject), year, month);
  };

  const getListProject = (): Promise<IDataProjectList[]> => {
    return ApiSalary.getListProject();
  };

  const {data: listProject} = useQuery("listProject", getListProject) || [];

  const {data, refetch: listUserRefetch} =
    useQuery("listUser", getListTotalSalary, {enabled: false}) || [];

  const dataYear = (): JSX.Element => {
    const year = [];
    for (let i = Config.NOW.YEAR; i <= date.getFullYear(); i++) {
      year.push(i);
    }
    return (
      <>
        {year.map((el, index) => (
          <Select.Option key={index} value={el}>
            {el}
          </Select.Option>
        ))}
      </>
    );
  };

  const dataMonth = (): JSX.Element => {
    const month = [];
    for (
      let i = Config.NOW.YEAR === date.getFullYear() ? Config.NOW.Month : 1;
      i <= date.getMonth() + 1;
      i++
    ) {
      month.push(i);
    }
    return (
      <>
        {month.map((el, index) => (
          <Select.Option key={index} value={el}>
            {el}
          </Select.Option>
        ))}
      </>
    );
  };

  const onRow = (record: any): {onDoubleClick: () => void} => {
    return {
      onDoubleClick: (): void => {
        router.push({
          pathname: baseURL.SALARY.ACCEPT_SALARY_DETAIL,
          query: {
            month: month,
            year: year,
            idUser: record?.userId,
            idProject: idProject,
            projectName: nameProject,
            userName: record?.username,
          },
        });
      },
    };
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      width: "5%",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Dự án",
      dataIndex: "nameProject",
      key: "nameProject",
      align: "center",
      width: "30%",
    },
    {
      title: "Tên nhân viên",
      dataIndex: "username",
      key: "month",
      align: "center",
      width: "23.75%",
    },
    {
      title: "Số ngày Onsite",
      dataIndex: "totalDayOnsite",
      key: "totalDayOnsite",
      align: "center",
      width: "23.75%",
    },
    {
      title: "Số giờ OT",
      dataIndex: "totalHourOT",
      key: "totalHourOT",
      align: "center",
      width: "23.75%",
    },
  ];

  useEffect(() => {
    if (idProject && year && month) {
      listUserRefetch();
    }
  }, [idProject, year, month]);

  const dataSource = data?.map((el: any, index: number) => {
    return {
      index: index + 1,
      userId: el?.user?.id,
      username: el?.user?.fullName,
      nameProject: nameProject,
      totalHourOT: el?.overtime,
      totalDayOnsite: el?.onsite,
    };
  });
  return (
    <div>
      <div className="flex items-end">
        <span className="text-[15px] font-medium mr-2">Dự án : </span>
        <Select
          style={{width: 120}}
          onChange={(e) => {
            const namePj = listProject?.filter(
              (el) => Number(el.id) === Number(e)
            );
            if (namePj) {
              setNameProject(namePj[0].name);
            }
            setIdProject(e);
          }}
        >
          {listProject?.map((el, index) =>
            el?.projectManager?.id === userId ? (
              <Select.Option key={index} value={el?.id}>
                {el?.name}
              </Select.Option>
            ) : null
          )}
        </Select>
        <span className="text-[15px] font-medium mr-2 ml-4">Tháng : </span>
        <Select
          defaultValue={(date.getMonth() + 1).toString()}
          style={{width: 120}}
          onChange={(e) => setMonth(Number(e))}
        >
          {dataMonth()}
        </Select>
        <span className="text-[15px] font-medium mr-2 ml-4">Năm : </span>
        <Select
          defaultValue={date.getFullYear().toString()}
          style={{width: 120}}
          onChange={(e) => setYear(Number(e))}
        >
          {dataYear()}
        </Select>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource || []}
        bordered
        className="hover-pointer mt-4"
        onRow={onRow}
      />
    </div>
  );
}
