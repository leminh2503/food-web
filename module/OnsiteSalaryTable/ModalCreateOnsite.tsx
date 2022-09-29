import "../my-salary-detail/index.scss";
import React, {useEffect, useState} from "react";
import {ModalCustom} from "@app/components/ModalCustom";
import {notification, Select, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {IDataOnsite, IDataProjectList} from "@app/types";
import {getDayOnMonth} from "@app/utils/date/getDayOnMonth";
import {findDayOnWeek} from "@app/utils/date/findDayOnWeek";
import {CloseCircleOutlined} from "@ant-design/icons";
import {formatNumber} from "@app/utils/fomat/FormatNumber";
import ApiSalary from "@app/api/ApiSalary";
import {CheckPermissionEvent} from "@app/check_event/CheckPermissionEvent";
import NameEventConstant from "@app/check_event/NameEventConstant";

interface IModalCreateOnsite {
  dataOnsite: IDataOnsite[];
  refetchDataOnsite: () => void;
  idUser: number;
  month: number;
  year: number;
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  isManager?: boolean;
  listProject?: IDataProjectList[];
  projectName?: string;
}

export default function ModalCreateOnsite(
  props: IModalCreateOnsite
): JSX.Element {
  const [data, setData] = useState<IDataOnsite[]>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const dataDefault: IDataOnsite[] = [];
    for (let i = 1; i <= getDayOnMonth(props.month, props.year); i++) {
      let check = 0;
      props.dataOnsite?.map((el, index) => {
        if (
          el.date ===
          props.year + "-" + formatNumber(props.month) + "-" + formatNumber(i)
        ) {
          dataDefault.push({
            day: formatNumber(i) + "/" + formatNumber(props.month),
            dayOnWeek: findDayOnWeek(props.year, props.month, i),
            onsitePlace: el.onsitePlace,
            projectId: (el as any)?.project?.id,
            action: true,
            id: el.id,
            state: el.state,
          });
          check += 1;
        }
        return el;
      });
      if (check === 0) {
        dataDefault.push({
          day: formatNumber(i) + "/" + formatNumber(props.month),
          dayOnWeek: findDayOnWeek(props.year, props.month, i),
          onsitePlace: "",
          projectId: -1,
          action: false,
          state: 0,
          id: 0,
        });
      }
    }
    setData(dataDefault);
    setLoading(false);
  }, [props.dataOnsite]);

  const columns: ColumnsType<IDataOnsite> = [
    {
      title: "Ngày",
      dataIndex: "day",
      key: "day",
      align: "center",
    },
    {
      title: "Thứ",
      dataIndex: "dayOnWeek",
      key: "dayOnWeek",
      align: "center",
    },
    {
      title: "Địa điểm Onsite",
      dataIndex: "onsitePlace",
      key: "onsitePlace",
      align: "center",
      render: (index, _record): JSX.Element => {
        const idPJ =
          props?.listProject?.filter(
            (ele) => ele.name === _record?.onsitePlace
          ) || [];
        return _record.state !== 1 && !props.isManager ? (
          <Select
            value={idPJ[0]?.id}
            onChange={(e, value) => {
              handleChangeOnsite(Number(e), _record.day, (value as any)?.key);
            }}
            className="w-full"
          >
            {props?.listProject?.map((el, index) => (
              <Select.Option key={el.name} value={el?.id}>
                {el?.name}
              </Select.Option>
            ))}
          </Select>
        ) : _record?.onsitePlace ? (
          <span>{props.projectName ?? _record?.onsitePlace}</span>
        ) : (
          <> </>
        );
      },
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      align: "center",
      width: "20px",
      render: (index, _record): JSX.Element => {
        return CheckPermissionEvent(
          NameEventConstant.PERMISSION_SALARY_MANAGER_KEY.DELETE_ONSITE_SALARY
        ) &&
          ((_record.action && _record.state !== 1) ||
            (_record.action && props.isManager)) ? (
          <CloseCircleOutlined
            onClick={() => deleteOnsite(_record.id)}
            className="text-[red] text-[20px]"
          />
        ) : (
          <div className="min-w-[20px]" />
        );
      },
    },
  ];

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <Table loading={loading} columns={columns} dataSource={data} bordered />
      </div>
    );
  };

  const handleChangeOnsite = (
    e: number,
    day: string | number | undefined,
    name: string
  ) => {
    const dataChange = data?.map((el, index) => {
      if (el.day === day) {
        el.project = e;
        el.onsitePlace = name;
      }
      return el;
    });
    setData(dataChange);
  };

  const deleteOnsite = (id: number): void => {
    setLoading(true);
    ApiSalary.deleteOnsiteSalary(id)
      .then((r) => {
        props.refetchDataOnsite();
        notification.success({message: "Xoá thành công"});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleOk = (): void => {
    const body =
      data?.map((el, index) => {
        return {
          user: props.idUser,
          onsitePlace: el?.onsitePlace ?? "",
          project: el?.project ?? -1,
          date:
            props.year +
            "-" +
            formatNumber(props.month) +
            "-" +
            formatNumber(index + 1),
        };
      }) || [];
    if (
      body.filter((el) => el.onsitePlace !== "" && el.project !== -1)?.length >
      0
    ) {
      ApiSalary.createOnsiteSalary(
        body.filter((el) => el.onsitePlace !== "" && el.project !== -1)
      ).then((r) => {
        props.refetchDataOnsite();
        notification.success({message: "Tạo thành công"});
        props.handleOk();
      });
    }
  };

  return (
    <ModalCustom
      destroyOnClose
      isModalVisible={props.isModalVisible}
      handleOk={handleOk}
      handleCancel={props.handleCancel}
      title="Sửa bảng lương Onsite"
      content={renderContent()}
    />
  );
}
