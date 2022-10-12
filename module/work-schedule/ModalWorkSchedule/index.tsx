import {IWorkingDaySchedule, IWorkScheduleCustom} from "@app/types";
import {Input} from "antd";
import Table, {ColumnType} from "antd/lib/table";
import moment from "moment";
import React, {useEffect, useState} from "react";
import "../index.scss";
import {getAllDaysInMonth} from "../UserWorkSchedule";

interface TypeColumn {
  dataRecord?: IWorkingDaySchedule[];
}

export function ModalWorkSchedule({dataRecord}: TypeColumn): JSX.Element {
  const [dataSource, setDataSource] = useState<IWorkScheduleCustom[]>([]);

  // const onChangeDataSession = (record: IWorkScheduleCustom): session[] => {
  //   const sessionArray = dataSession.map((item) => {
  //     const newData =
  //       item.title === record.session
  //         ? {...item, default: true}
  //         : {...item, default: false};
  //     return newData;
  //   });
  //   return sessionArray;
  // };

  const columnUser: ColumnType<IWorkScheduleCustom>[] = [
    {
      title: "Ngày (thứ)",
      dataIndex: "day",
      key: "day",
      align: "center",
      render: (day) => (
        <p>
          {moment(day).format("DD-MM")} (
          {moment(day).isoWeek() === 7
            ? "Chủ nhật"
            : "thứ " + (moment(day).isoWeekday() + 1)}
          )
        </p>
      ),
    },
    {
      title: "Ca làm",
      dataIndex: "session",
      key: "session",
      align: "center",
      render: (_, record, index): JSX.Element => <div>{record.session}</div>,
    },
    {
      title: "Bắt đầu - Kết thúc",
      dataIndex: "time",
      key: "time",
      align: "center",
      render: (_, record, index: number) => (
        <div className="flex items-center justify-center">
          <Input
            readOnly
            name="hour"
            value={dataSource[index].startTime?.hour}
          />
          <Input
            readOnly
            name="minute"
            value={dataSource[index].startTime?.minute}
          />
          <span className="mr-2"> - </span>
          <Input readOnly name="hour" value={dataSource[index].endTime?.hour} />
          <Input
            readOnly
            name="minute"
            value={dataSource[index].endTime?.minute}
          />
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center",
    },
  ];
  useEffect(() => {
    const now = new Date();
    const allDay = getAllDaysInMonth(now.getFullYear(), now.getMonth());
    if (dataRecord?.length !== 0) {
      const dataArray: IWorkScheduleCustom[] = [];
      dataRecord?.forEach((item, index) => {
        const newData: IWorkScheduleCustom = {
          day: allDay[index].toISOString(),
          session: item.session,
          note: item.note,
          startTime: {
            hour: item.startTime?.slice(0, 2),
            minute: item.startTime?.slice(3),
          },
          endTime: {
            hour: item.endTime?.slice(0, 2),
            minute: item.endTime?.slice(3),
          },
        };
        dataArray.push(newData);
      });
      setDataSource(dataArray);
    } else {
      setDataSource([]);
    }
  }, [dataRecord]);

  return (
    <div className="table_modal_work">
      <Table
        pagination={false}
        columns={columnUser}
        bordered
        dataSource={dataSource}
      />
    </div>
  );
}
