import type {ColumnsType} from "antd/es/table";
import {Table} from "antd";
import {IRules} from "@app/types";
import React from "react";

export function Rules(): JSX.Element {
  // eslint-disable-next-line camelcase
  const data_rules: IRules[] = [
    {
      tittle: "THỰC HIỆN THỜI GIAN LÀM VIỆC, NGHỈ PHÉP",
      startTime: "01/01/2022",
      link: "",
    },
    {
      tittle: "QUY ĐỊNH THƯỞNG CHO NHÂN VIÊN GIỚI THIỆU ỨNG VIÊN",
      startTime: "01/01/2022",
      link: "",
    },
    {
      tittle: "QUY ĐỊNH VỀ THUẾ THU NHẬP CÁ NHÂN",
      startTime: "01/01/2022",
      link: "",
    },
    {
      tittle: "QUY ĐỊNH VỀ HỖ TRỢ NHÂN VIÊN OT",
      startTime: "01/01/2022",
      link: "",
    },
    {
      tittle: "QUY ĐỊNH VỀ BẢO HIỂM",
      startTime: "01/01/2022",
      link: "",
    },
  ];

  const onRow = (): {onDoubleClick: () => void} => {
    return {
      onDoubleClick: (): void => {
        <> </>;
      },
    };
  };

  const columns: ColumnsType<IRules> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Nội quy/Quy định",
      dataIndex: "tittle",
      key: "tittle",
      align: "center",
    },
    {
      title: "Ngày bắt đầu hiệu lực",
      dataIndex: "startTime",
      key: "startTime",
      align: "center",
    },
  ];

  return (
    // eslint-disable-next-line camelcase
    <Table columns={columns} dataSource={data_rules} bordered onRow={onRow} />
  );
}
