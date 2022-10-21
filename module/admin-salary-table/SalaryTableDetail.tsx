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
import {IDataProjectList, IDataSalary, IUserLogin} from "@app/types";
import ApiSalary from "@app/api/ApiSalary";
import {useQuery} from "react-query";
import {Button, Image, Modal, notification, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import ApiLeaveWork, {IDaysAllowedLeave} from "@app/api/ApiLeaveWork";
import {queryKeys} from "@app/utils/constants/react-query";
import {ModalCustom} from "@app/components/ModalCustom";

interface ITaxSalary {
  deductionOwn: number;
  deductionFamilyCircumstances: number;
  taxableSalary: number;
  tax: number;
  taxSalary: number;
}

export function SalaryTableDetail(): JSX.Element {
  const router = useRouter();
  const {month, year, userId, id, dailyOnsiteRate, baseSalary, manageSalary} =
    router.query;
  const [onsiteSalary, setOnsiteSalary] = useState<number>(0);
  const [bonusSalary, setBonusSalary] = useState<number>(0);
  const [overtimeSalary, setOvertimeSalary] = useState<number>(0);
  const [projectSalary, setProjectSalary] = useState<number>(0);
  const [deductionSalary, setDeductionSalary] = useState<number>(0);
  const [dailyOnsiteRate2, setDailyOnsiteRate2] = useState<number>();
  const [totalSalary, setTotalSalary] = useState<number>();
  const [dataTaxSalary, setDataTaxSalary] = useState<ITaxSalary>();
  const [isModalVisible, setIsModalVisible] = useState("");

  const showModalTaxSalary = (): void => {
    setIsModalVisible("taxSalary");
  };

  const toggleModal = (): void => {
    setIsModalVisible("");
  };

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

  const getUserInfo = (): Promise<IUserLogin> => {
    return ApiUser.getUserInfo({id: Number(userId)});
  };

  const {data: dataUser, refetch: refetchUser} =
    useQuery("userInfo" + userId, getUserInfo, {enabled: false}) || [];

  const getListProject = (): Promise<IDataProjectList[]> => {
    return ApiSalary.getListProject();
  };

  const {data: listProject} = useQuery("listProjectMe", getListProject) || [];

  const getDaysAllowedLeaveById = (): Promise<IDaysAllowedLeave> => {
    return ApiLeaveWork.getDaysAllowedLeaveById(Number(userId));
  };

  const {data: daysAllowedLeaveById, refetch: refetchDaysAllowedLeaveById} =
    useQuery(queryKeys.GET_DAY_ALLOWS_LEAVE_BY_ID, getDaysAllowedLeaveById, {
      enabled: false,
    });

  useEffect(() => {
    if (id) {
      refetchTotalSalaryById();
    }
  }, [id]);

  useEffect(() => {
    if (userId) {
      refetchUser();
      refetchDaysAllowedLeaveById();
    }
  }, [userId]);

  useEffect(() => {
    const total =
      onsiteSalary +
      overtimeSalary +
      bonusSalary +
      projectSalary -
      deductionSalary +
      Number(Number(manageSalary) || 0) +
      Number(Number(baseSalary) || 0);

    setTotalSalary(total);
  }, [
    onsiteSalary,
    overtimeSalary,
    bonusSalary,
    projectSalary,
    deductionSalary,
    dataUser,
  ]);

  useEffect(() => {
    ApiSalary.updateTotalSalary(
      {
        deductionSalary: Number(deductionSalary),
      },
      Number(id || 0)
    ).then((r) => {
      //
    });
  }, [deductionSalary]);

  useEffect(() => {
    if (userId && totalSalary) {
      ApiSalary.taxCalculator(totalSalary, Number(userId)).then((result) => {
        setDataTaxSalary({
          deductionOwn: result.deductionOwn,
          deductionFamilyCircumstances: result.deductionFamilyCircumstances,
          taxableSalary: result.taxableSalary,
          tax: result.tax,
          taxSalary: result.taxSalary,
        });
      });
    }
  }, [totalSalary]);

  const columns: ColumnsType<any> = [
    {
      title: "Họ & Tên",
      dataIndex: "fullName",
      key: "fullName",
      width: "15%",
      align: "center",
    },
    {
      title: "Ảnh",
      key: "avatar",
      align: "center",
      width: "15%",
      render: (_, record) => {
        return (
          <div>
            <Image
              src={record?.avatar || "img/avatar/avatar.jpg"}
              fallback="../img/avatar/avatar.jpg"
              preview={false}
              width={150}
              height={150}
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
      width: "20%",
      render: (_, record) => {
        return (
          <div>
            <span>{record?.position?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Loại hình làm việc",
      dataIndex: "workType",
      key: "workType",
      align: "center",
      width: "20%",
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
      width: "15%",
      render: (_, record, index) => (
        <div>{Number(manageSalary ?? 0)?.toLocaleString("en-US")} VND</div>
      ),
    },
    {
      title: "Lương cứng",
      dataIndex: "baseSalary",
      key: "baseSalary",
      align: "center",
      width: "15%",
      render: (_, record, index) => (
        <div>{Number(baseSalary ?? 0)?.toLocaleString("en-US")} VND</div>
      ),
    },
  ];

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
        dataSource={dataTaxSalary ? [dataTaxSalary] : []}
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
        <span className="ml-2 font-bold">
          Lương tháng {formatNumber(Number(month)) + "/" + year}
        </span>
      </div>
      <span className="block text-sm font-semibold text-[#000] mb-2">
        {"Số ngày nghỉ còn lại: " +
          (daysAllowedLeaveById?.quantity ?? "") +
          "(ngày)"}
      </span>
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
            state={dataTotalSalaryById?.state}
          />
          <OtherSalaryTable
            setBonusSalary={setBonusSalary}
            userId={Number(userId)}
            isAdmin
            month={Number(month)}
            year={Number(year)}
            state={dataTotalSalaryById?.state}
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
            state={dataTotalSalaryById?.state}
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
            state={dataTotalSalaryById?.state}
          />
        </div>
      )}
      {month && year && userId && daysAllowedLeaveById && (
        <div className="mt-4">
          <DeductionSalaryTable
            setDeductionSalary={setDeductionSalary}
            baseSalary={Number(baseSalary) || 0}
            isAdmin
            userId={Number(userId)}
            month={Number(month)}
            year={Number(year)}
            state={dataTotalSalaryById?.state}
            daysAllowedLeaveById={daysAllowedLeaveById.quantity}
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
                {(totalSalary || 0).toLocaleString("en-US")} VND
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
                {(dataTaxSalary?.taxSalary ?? 0).toLocaleString("en-US")} VND
              </p>
            </td>
          </tr>
          <tr className="font-bold text-[26px]">
            <th>
              <p className="mt-4">Tổng lương sau thuế:</p>
            </th>
            <td>
              <p className="mt-4">
                {(
                  (totalSalary ?? 0) - (dataTaxSalary?.taxSalary ?? 0)
                ).toLocaleString("en-US")}{" "}
                VND
              </p>
            </td>
          </tr>
        </table>
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
            const lock = dataTotalSalaryById?.state === 3 ? "mở khóa" : "khóa";
            Modal.confirm({
              title: `Bạn chắc chắn muốn ${lock} bảng lương ?`,
              centered: true,
              onOk: (): void => {
                if (dataTotalSalaryById?.state === 3) {
                  ApiSalary.unLockToTalSalary([Number(id || 0)]).then((r) => {
                    notification.success({
                      message: `${
                        lock.charAt(0).toUpperCase() + lock.slice(1)
                      } bảng lương thành công`,
                    });
                    refetchTotalSalaryById();
                  });
                } else {
                  ApiSalary.lockToTalSalary([Number(id || 0)]).then((r) => {
                    notification.success({
                      message: `${
                        lock.charAt(0).toUpperCase() + lock.slice(1)
                      } bảng lương thành công`,
                    });
                    refetchTotalSalaryById();
                  });
                }
              },
            });
          }}
        >
          {dataTotalSalaryById?.state === 3
            ? "Mở khóa bảng lương"
            : "Khóa bảng lương"}
        </Button>
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
