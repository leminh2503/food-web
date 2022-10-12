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
import {IDataProjectList, IUserLogin} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {Button, Dropdown, Image, Modal, notification, Table} from "antd";
import {ColumnsType} from "antd/es/table";

export function SalaryTableDetail(): JSX.Element {
  const router = useRouter();
  const {
    month,
    year,
    userId,
    id,
    tax,
    taxSalary,
    deductionTaxMe,
    deductionFamilyTaxMe,
    taxableSalary,
    dailyOnsiteRate,
    baseSalary,
    manageSalary,
  } = router.query;
  const [taxableSalary2, setTaxableSalary] = useState<number>();
  const [onsiteSalary, setOnsiteSalary] = useState<number>(0);
  const [bonusSalary, setBonusSalary] = useState<number>(0);
  const [overtimeSalary, setOvertimeSalary] = useState<number>(0);
  const [projectSalary, setProjectSalary] = useState<number>(0);
  const [deductionSalary, setDeductionSalary] = useState<number>(0);
  const [dailyOnsiteRate2, setDailyOnsiteRate2] = useState<number>();
  const [totalSalary, setTotalSalary] = useState<number>();

  const getUserInfo = (): Promise<IUserLogin> => {
    return ApiUser.getUserInfo({id: Number(userId)});
  };

  const {data: dataUser, refetch} =
    useQuery("userInfo" + userId, getUserInfo, {enabled: false}) || [];

  const getListProject = (): Promise<IDataProjectList[]> => {
    return ApiSalary.getListProject();
  };

  const {data: listProject} = useQuery("listProjectMe", getListProject) || [];

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  const columns: ColumnsType<any> = [
    {
      title: "Họ & Tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Ảnh",
      key: "avatar",
      align: "center",
      width: 150,
      render: (_, record) => {
        return (
          <div>
            <Image
              src={record?.avatar || "img/avatar/avatar.jpg"}
              fallback="../img/avatar/avatar.jpg"
              preview={false}
            />
          </div>
        );
      },
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <span>{record?.position?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Vị trí",
      dataIndex: "workType",
      key: "workType",
      align: "center",
      render: (_, record) => {
        return (
          <div>
            <span>{record?.workType?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Lương quản lý",
      dataIndex: "manageSalary",
      key: "manageSalary",
      align: "center",
      render: (_, record, index) => (
        <div>{Number(manageSalary ?? 0)?.toLocaleString("en-US")} VND</div>
      ),
    },
    {
      title: "Lương cứng",
      dataIndex: "baseSalary",
      key: "baseSalary",
      align: "center",
      render: (_, record, index) => (
        <div>{Number(baseSalary ?? 0)?.toLocaleString("en-US")} VND</div>
      ),
    },
  ];

  useEffect(() => {
    if (taxableSalary2 && taxableSalary2 < 0) {
      setTaxableSalary(0);
    }
  }, [taxableSalary2]);

  useEffect(() => {
    setTaxableSalary(
      onsiteSalary +
        overtimeSalary +
        bonusSalary +
        projectSalary -
        deductionSalary +
        Number(manageSalary || 0) +
        Number(baseSalary || 0) -
        Number(deductionFamilyTaxMe || 0) -
        Number(deductionTaxMe || 0)
    );
    setTotalSalary(
      onsiteSalary +
        overtimeSalary +
        bonusSalary +
        projectSalary -
        deductionSalary +
        Number(Number(manageSalary) || 0) +
        Number(Number(baseSalary) || 0)
    );
  }, [
    onsiteSalary,
    overtimeSalary,
    bonusSalary,
    projectSalary,
    deductionSalary,
    tax,
    dataUser,
  ]);

  const menu = (
    <div className="p-4 bg-white shadow-2xl">
      <p className=" font-bold">
        Tổng lương : {totalSalary?.toLocaleString("en-US")} VND
      </p>
      <p className="mt-2 font-bold">
        Giảm trừ gia cảnh cá nhân:{" "}
        {Number(deductionTaxMe || 0).toLocaleString("en-US")} VND
      </p>
      <p className="mt-2 font-bold">
        Giảm trừ gia cảnh người phụ thuộc :{" "}
        {Number(deductionFamilyTaxMe || 0).toLocaleString("en-US")} VND
      </p>
      <p className="mt-2 font-bold">
        Thu nhập chịu thuế :{" "}
        {Number(taxableSalary2 ?? (taxableSalary || 0)).toLocaleString("en-US")}{" "}
        VND
      </p>
      <p className="mt-2 font-bold">Thuế suất : {tax}</p>
      <p className="mt-2 font-bold">
        Thuế thu nhập cá nhân :{" "}
        {Math.floor(
          Number(
            ((taxableSalary2 || 0) * Number(tax?.toString().replace("%", ""))) /
              100 ??
              (taxSalary || 0)
          )
        ).toLocaleString("en-US")}{" "}
        VND
      </p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center mb-6">
        <button type="button" className="btn-back-page" onClick={router.back}>
          <LeftOutlined />
        </button>
        <span className="ml-2 font-bold">
          Lương tháng {formatNumber(Number(month)) + "/" + year}
        </span>
      </div>
      <Table
        className="mb-4"
        columns={columns}
        bordered
        dataSource={[dataUser]}
        pagination={false}
      />
      {month && year && (
        <div className="flex justify-between">
          <ProjectSalaryTable
            setProjectSalary={setProjectSalary}
            userId={Number(userId)}
            listProject={listProject}
            month={Number(month)}
            year={Number(year)}
            idTotal={Number(id)}
            isAdmin
          />
          <OtherSalaryTable
            setBonusSalary={setBonusSalary}
            userId={Number(userId)}
            isAdmin
            month={Number(month)}
            year={Number(year)}
          />
        </div>
      )}
      {month && year && (
        <div className="mt-4">
          <OnsiteSalaryTable
            setDailyOnsiteRate2={setDailyOnsiteRate2}
            idTotal={Number(id)}
            dailyOnsiteRate={dailyOnsiteRate2 ?? Number(dailyOnsiteRate)}
            setOnsiteSalary={setOnsiteSalary}
            idUser={Number(userId)}
            month={Number(month)}
            year={Number(year)}
            listProject={listProject}
            isManager
            isAdmin
          />
        </div>
      )}
      {month && year && (
        <div className="mt-4">
          <OverTimeSalaryTable
            setOvertimeSalary={setOvertimeSalary}
            baseSalary={Number(baseSalary) || 0}
            listProject={listProject}
            idUser={Number(userId)}
            month={Number(month)}
            year={Number(year)}
            isManager
            isAdmin
          />
        </div>
      )}
      {month && year && (
        <div className="mt-4">
          <DeductionSalaryTable
            setDeductionSalary={setDeductionSalary}
            baseSalary={Number(baseSalary) || 0}
            isAdmin
            userId={Number(userId)}
            month={Number(month)}
            year={Number(year)}
          />
        </div>
      )}
      <div className="mt-6 h-[150px] w-[570px] bg-white p-4">
        <Dropdown
          overlay={menu}
          placement="top"
          trigger={["click"]}
          arrow={{pointAtCenter: true}}
        >
          <p className="font-bold hover-pointer ">
            Thuế thu nhập cá nhân :{" "}
            {Math.floor(
              Number(
                ((taxableSalary2 || 0) *
                  Number(tax?.toString().replace("%", ""))) /
                  100 ??
                  (taxSalary || 0)
              )
            ).toLocaleString("en-US")}{" "}
            VND
          </p>
        </Dropdown>
        <p className="mt-6 font-bold text-[26px]">
          Tổng lương sau thuế :{" "}
          {(
            Number(
              (
                Number(
                  (totalSalary || 0) -
                    Math.floor(
                      Number(
                        ((taxableSalary2 || 0) *
                          Number(tax?.toString().replace("%", ""))) /
                          100 ??
                          (taxSalary || 0)
                      )
                    )
                ) / 1000
              ).toFixed(0)
            ) * 1000
          ).toLocaleString("en-US")}{" "}
          VND
        </p>
      </div>
      <div className="w-full row-all-center mt-8 mb-16">
        <Button
          type="primary"
          className="bg-blue-500"
          onClick={() => {
            Modal.confirm({
              title: "Bạn chắc chắn muốn duyệt lương ?",
              centered: true,
              onOk: (): void => {
                ApiSalary.acceptToTalSalary([Number(id || 0)]).then((r) => {
                  notification.success({
                    message: "Duyệt bảng lương thành công",
                  });
                });
                ApiSalary.updateTotalSalary(
                  {
                    onsiteSalary: Number(onsiteSalary),
                    overtimeSalary: Number(overtimeSalary),
                    bonusSalary: Number(bonusSalary),
                    projectSalary: Number(projectSalary),
                    deductionSalary: Number(deductionSalary),
                  },
                  Number(id || 0)
                ).then((r) => {
                  //
                });
              },
            });
          }}
        >
          Duyệt bảng lương
        </Button>

        <Button
          className="ml-8 bg-red-500 text-[white]"
          onClick={() => {
            Modal.confirm({
              title: "Bạn chắc chắn muốn khoá bảng lương ?",
              centered: true,
              onOk: (): void => {
                ApiSalary.lockToTalSalary([Number(id || 0)]).then((r) => {
                  notification.success({message: "Khoá bảng lương thành công"});
                });
              },
            });
          }}
        >
          Khoá bảng lương
        </Button>
      </div>
    </div>
  );
}
