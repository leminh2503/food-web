import "../index.scss";
import React, {useEffect, useState} from "react";
import {
  IWorkingDaySchedule,
  IWorkSchedule,
  IWorkScheduleCustom,
} from "@app/types";
import ApiWorkSchedule from "@app/api/ApiWorkSchedule";
import {useMutation, useQuery} from "react-query";
import moment from "moment";
import Table, {ColumnType} from "antd/lib/table";
import {Button, Input, Modal, notification, Select} from "antd";
import {queryKeys} from "@app/utils/constants/react-query";
import {FilterWorkSchedule} from "../FilterWorkSchedule";
import {FileExcelFilled} from "@ant-design/icons";
import {Tooltip} from "@mui/material";
import {useSelector} from "react-redux";
import {IRootState} from "@app/redux/store";
import {IMetadata} from "@app/api/Fetcher";

export interface session {
  title: string;
  value: number;
  default: boolean;
}

interface invalid {
  startTime?: boolean;
  endTime?: boolean;
}

export function getAllDaysInMonth(year: number, month: number): Date[] {
  const date = new Date(year, month, 1);

  const dates = [];

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

function getHourInDay() {
  const days: string[] = [];
  for (let i = 1; i <= 24; i++) {
    if (i < 10) {
      const day = "0" + i.toString();
      days.push(day);
    } else days.push(i.toString());
  }
  return days;
}

const {Option} = Select;

export function UserWorkSchedule(): JSX.Element {
  const id = useSelector((state: IRootState) => state.user.user?.id);
  const [workingDay, setWorkingDay] = useState<IWorkScheduleCustom[]>([]);
  const [invalid, setInvalid] = useState<invalid[]>([]);
  const [filterYear, setFilterYear] = useState<number>(moment().year());
  const [filterMonth, setFilterMonth] = useState<number>(moment().month() + 1);
  const [filterState, setFilterState] = useState<number>(0);

  const dataSession = ["Cả ngày", "Sáng", "Chiều", "Nghỉ"];
  const dataMinutes = ["00", "30"];
  const dataHours = getHourInDay();

  const getAllWorkSchedule = (): Promise<{
    data: IWorkSchedule[];
    meta: IMetadata;
  }> => {
    return ApiWorkSchedule.getAllWorkSchedule({
      filter: {
        createdAt_MONTH: filterMonth,
        createdAt_YEAR: filterYear,
        user: id,
      },
    });
  };
  const dataWorkSchedule = useQuery(
    queryKeys.GET_ALL_WORK_SCHEDULE,
    getAllWorkSchedule
  );

  const dataRefetch = (): void => {
    dataWorkSchedule.refetch();
  };

  const data =
    dataWorkSchedule?.status === "success"
      ? dataWorkSchedule?.data.data.length !== 0
        ? dataWorkSchedule.data.data[0]
        : null
      : null;

  useEffect(() => {
    dataRefetch();
  }, [filterMonth, filterYear, filterState]);

  useEffect(() => {
    const date = new Date();
    const states: IWorkScheduleCustom[] = [];
    const invaliArray: invalid[] = [];
    if (data === null) {
      getAllDaysInMonth(date.getFullYear(), date.getMonth()).forEach((item) => {
        const dayItem = {
          day: item.toISOString(),
          note: "",
          startTime: {
            hour: "08",
            minute: "00",
          },
          endTime: {
            hour: "17",
            minute: "00",
          },
          session: "Cả ngày",
        };
        states.push(dayItem);
        invaliArray.push({startTime: false, endTime: false});
      });
    } else {
      const dayInMonth = getAllDaysInMonth(date.getFullYear(), date.getMonth());
      data?.workingDay.forEach((item, index) => {
        const dayItem = {
          day: dayInMonth[index].toISOString(),
          note: item.note,
          startTime: {
            hour: item.startTime?.slice(0, 2),
            minute: item.startTime?.slice(3),
          },
          endTime: {
            hour: item.endTime?.slice(0, 2),
            minute: item.endTime?.slice(3),
          },
          session: item.session,
        };
        states.push(dayItem);
        invaliArray.push({startTime: false, endTime: false});
      });
    }
    setWorkingDay(states);
    setInvalid(invaliArray);
  }, [data]);

  const handlerOnChangeTime = (
    value: string,
    index: number,
    props: string,
    name: string
  ): void => {
    if (value.length <= 2) {
      const workingDayArray = workingDay?.map((item, i) => {
        const newData =
          i === index
            ? props === "startTime"
              ? {...item, [props]: {...item.startTime, [name]: value}}
              : {...item, [props]: {...item.endTime, [name]: value}}
            : item;
        return newData;
      });
      setWorkingDay(workingDayArray);
      const endTime = `${workingDayArray[index]?.endTime?.hour}:${workingDayArray[index]?.endTime?.minute}`;
      const startTime = `${workingDayArray[index]?.startTime?.hour}:${workingDayArray[index]?.startTime?.minute}`;
      const checkInvalid = (param: boolean): void => {
        const newInvalid = invalid.map((item, i) => {
          const newData: invalid =
            i === index ? {...item, [props]: param} : item;
          return newData;
        });
        setInvalid(newInvalid);
      };
      if (
        moment(endTime, "hh:mm").diff(
          moment(startTime, "hh:mm"),
          "milliseconds"
        ) <= 0
      ) {
        checkInvalid(true);
      } else {
        checkInvalid(false);
      }
    }
  };

  const handleOnchangeSession = (value: string, index: number) => {
    const workingDayItem = workingDay.map((item, i) => {
      const newData = i === index ? {...item, session: value} : item;
      return newData;
    });
    setWorkingDay(workingDayItem);
  };

  const onChangeNote = (e: any, index: number): void => {
    const workingDayItem = workingDay?.map((item, i) => {
      const newData = i === index ? {...item, note: e.target.value} : item;
      return newData;
    });
    setWorkingDay(workingDayItem);
  };

  const createWorkMutation = useMutation(ApiWorkSchedule.createWorkSchedule);
  const updateWorkMutation = useMutation(ApiWorkSchedule.updateWorkSchedule);

  const handlerOnClick = (): void => {
    const dayArray: IWorkingDaySchedule[] = [];
    workingDay.forEach((item, index) => {
      const dayItem = {
        day: index + 1,
        session: item.session,
        note: item.note,
        startTime: `${item.startTime?.hour}:${item.startTime?.minute}`,
        endTime: `${item.endTime?.hour}:${item.endTime?.minute}`,
      };
      dayArray.push(dayItem);
    });
    const validTime = (time: invalid): boolean =>
      !time.startTime && !time.endTime;
    const check = invalid.every(validTime);
    if (check) {
      if (data === null) {
        createWorkMutation.mutate(dayArray, {
          onSuccess: () => {
            notification.success({
              duration: 5,
              message: "Đăng kí lịch làm việc thành công 😙",
            });
            dataRefetch();
          },
        });
      } else {
        updateWorkMutation.mutate(
          {
            id: data?.id,
            workingDay: dayArray,
          },
          {
            onSuccess: () => {
              notification.success({
                duration: 5,
                message: "Cập nhật lịch làm việc thành công 😎",
              });
              dataRefetch();
            },
          }
        );
      }
    } else {
      notification.error({
        duration: 5,
        message: "Invalid date input 😭",
      });
    }
  };

  const columnUser: ColumnType<IWorkScheduleCustom>[] = [
    {
      title: "Ngày (thứ)",
      dataIndex: "day",
      key: "day",
      align: "center",
      render: (day: any) => (
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
      render: (_, record, index): JSX.Element => (
        <div className="flex justify-center">
          <Select
            className="session_select"
            onChange={(value) => handleOnchangeSession(value, index)}
            value={workingDay[index].session}
          >
            {dataSession.map((item, index) => {
              return (
                <Option key={index} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </div>
      ),
    },
    {
      title: "Bắt đầu - Kết thúc",
      dataIndex: "time",
      key: "time",
      align: "center",
      render: (_: any, record: any, index: number) => (
        <div className="flex items-center justify-center">
          <Select
            className="margin_right"
            value={workingDay[index].startTime?.hour}
            onChange={(value) => {
              handlerOnChangeTime(value, index, "startTime", "hour");
            }}
            status={`${
              invalid.length !== 0 && invalid[index].startTime ? "error" : ""
            }`}
          >
            {dataHours.map((item, index) => {
              return (
                <Option key={index} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
          <Select
            value={workingDay[index].startTime?.minute}
            onChange={(value) => {
              handlerOnChangeTime(value, index, "startTime", "minute");
            }}
            status={`${
              invalid.length !== 0 && invalid[index].startTime ? "error" : ""
            }`}
          >
            {dataMinutes.map((item, index) => {
              return (
                <Option key={index} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
          <p>-</p>
          <Select
            className="margin_right"
            value={workingDay[index].endTime?.hour}
            onChange={(value) => {
              handlerOnChangeTime(value, index, "endTime", "hour");
            }}
            status={`${
              invalid.length !== 0 && invalid[index].endTime ? "error" : ""
            }`}
          >
            {dataHours.map((item, index) => {
              return (
                <Option key={index} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
          <Select
            value={workingDay[index].endTime?.minute}
            onChange={(value) => {
              handlerOnChangeTime(value, index, "endTime", "minute");
            }}
            status={`${
              invalid.length !== 0 && invalid[index].endTime ? "error" : ""
            }`}
          >
            {dataMinutes.map((item, index) => {
              return (
                <Option key={index} value={item}>
                  {item}
                </Option>
              );
            })}
          </Select>
        </div>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center",
      render: (_, record, index) => (
        <div>
          <Input
            className="note_input"
            size="middle"
            onChange={(e): void => onChangeNote(e, index)}
            value={workingDay[index]?.note}
          />
        </div>
      ),
    },
  ];

  const exportExcelFile = (): void => {
    Modal.confirm({
      title: "Chưa có API export file 😭",
      content: "Khi nào có thì làm tiếp! 🙂",
      okType: "primary",
      cancelText: "Huỷ",
      okText: "Oki",
    });
  };

  return (
    <div className="container-work-schedule">
      <h6>
        ĐĂNG KÝ LỊCH LÀM VIỆC{" "}
        {data === null || data.state === 1 ? (
          <span className="not_yet_register">(Chưa đăng ký 🤔)</span>
        ) : data.state === 0 || data.state === 2 ? (
          <span className="done_register">(Đã đăng ký 🤗)</span>
        ) : (
          <span className="pending_approval">(Đang khóa 😟)</span>
        )}
      </h6>
      <div className="flex justify-between mt-5">
        <FilterWorkSchedule
          visible={false}
          setFilterState={setFilterState}
          setFilterMonth={setFilterMonth}
          setFilterYear={setFilterYear}
        />
        <Tooltip title="Xuất excel" placement="left">
          <FileExcelFilled onClick={exportExcelFile} className="excel_icon" />
        </Tooltip>
      </div>
      <Table
        pagination={false}
        className="mt-5"
        columns={columnUser}
        bordered
        dataSource={workingDay}
      />
      <div className="flex justify-end button">
        <Button onClick={handlerOnClick} className="btn-primary mt-5">
          Xác nhận
        </Button>
      </div>
    </div>
  );
}
