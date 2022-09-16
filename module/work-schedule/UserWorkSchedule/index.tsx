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
import {Filter} from "@app/components/Filter";
import {Button, Input, notification} from "antd";
import {queryKeys} from "@app/utils/constants/react-query";

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

export function UserWorkSchedule(): JSX.Element {
  const [workingDay, setWorkingDay] = useState<IWorkScheduleCustom[]>([]);
  const [invalid, setInvalid] = useState<invalid[]>([]);

  const dataSession = [
    {
      title: "Cả ngày",
      value: 0,
      default: true,
    },
    {
      title: "Sáng",
      value: 1,
      default: false,
    },
    {
      title: "Chiều",
      value: 2,
      default: false,
    },
    {
      title: "Nghỉ",
      value: 3,
      default: false,
    },
  ];

  const getWorkSchedule = (): Promise<IWorkSchedule> => {
    return ApiWorkSchedule.getWorkSchedule();
  };
  const dataWorkSchedule = useQuery(
    queryKeys.GET_WORK_SCHEDULE,
    getWorkSchedule
  );

  const dataRefetch = (): void => {
    dataWorkSchedule.refetch();
  };

  const data =
    dataWorkSchedule?.status !== "error"
      ? dataWorkSchedule?.data?.workingDay
      : null;

  useEffect(() => {
    dataRefetch();
  }, []);

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
      data?.forEach((item, index) => {
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

  const handlerOnChangeStartTime = (e: any, index: number): void => {
    const {value, name} = e.target;
    if (value.length <= 2) {
      const workingDayArray = workingDay?.map((item, i) => {
        const newData =
          i === index
            ? {...item, startTime: {...item.startTime, [name]: value}}
            : item;
        return newData;
      });
      setWorkingDay(workingDayArray);
      const endTime = `${workingDayArray[index]?.endTime?.hour}:${workingDayArray[index]?.endTime?.minute}`;
      const startTime = `${workingDayArray[index]?.startTime?.hour}:${workingDayArray[index]?.startTime?.minute}`;
      const checkInvalid = (param: boolean): void => {
        const newInvalid = invalid.map((item, i) => {
          const newData: invalid =
            i === index ? {...item, startTime: param} : item;
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

  const handlerOnChangeEndTime = (e: any, index: number): void => {
    const {value, name} = e.target;
    if (value.length <= 2) {
      const workingDayArray = workingDay?.map((item, i) => {
        const newData =
          i === index
            ? {...item, endTime: {...item.endTime, [name]: value}}
            : item;
        return newData;
      });
      setWorkingDay(workingDayArray);
      const endTime = `${workingDayArray[index]?.endTime?.hour}:${workingDayArray[index]?.endTime?.minute}`;
      const startTime = `${workingDayArray[index]?.startTime?.hour}:${workingDayArray[index]?.startTime?.minute}`;
      const checkInvalid = (param: boolean): void => {
        const newInvalid = invalid.map((item, i) => {
          const newData: invalid =
            i === index ? {...item, endTime: param} : item;
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

  const onChangeSession = (value: number, index: number): void => {
    const workingDayItem = workingDay?.map((item, i) => {
      const newData =
        i === index ? {...item, session: dataSession[value].title} : item;
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
              message: "Đăng kí lịch làm việc thành công ^^",
            });
            dataRefetch();
          },
        });
      } else {
        updateWorkMutation.mutate(
          {
            id: dataWorkSchedule?.data?.id,
            workingDay: dayArray,
          },
          {
            onSuccess: () => {
              notification.success({
                duration: 5,
                message: "Cập nhật lịch làm việc thành công ^^",
              });
              dataRefetch();
            },
          }
        );
      }
    } else {
      notification.error({
        duration: 5,
        message: "Invalid date input",
      });
    }
  };

  const onChangeDataSession = (record: IWorkScheduleCustom): session[] => {
    const sessionArray = dataSession.map((item) => {
      const newData =
        item.title === record.session
          ? {...item, default: true}
          : {...item, default: false};
      return newData;
    });
    return sessionArray;
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
          <Filter
            listSearch={[
              {
                visible: true,
                isSelect: true,
                data: onChangeDataSession(record),
                handleOnChange: (value: number): void =>
                  onChangeSession(value, index),
              },
            ]}
          />
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
          <Input
            status={`${invalid[index].startTime ? "error" : ""}`}
            required
            name="hour"
            onChange={(e): void => handlerOnChangeStartTime(e, index)}
            value={workingDay[index]?.startTime?.hour}
          />
          <Input
            status={`${invalid[index].startTime ? "error" : ""}`}
            required
            name="minute"
            onChange={(e): void => handlerOnChangeStartTime(e, index)}
            value={workingDay[index]?.startTime?.minute}
          />
          <span className="mr-2"> - </span>
          <Input
            status={`${invalid[index].endTime ? "error" : ""}`}
            required
            name="hour"
            onChange={(e): void => handlerOnChangeEndTime(e, index)}
            value={workingDay[index]?.endTime?.hour}
          />
          <Input
            status={`${invalid[index].endTime ? "error" : ""}`}
            required
            name="minute"
            onChange={(e): void => handlerOnChangeEndTime(e, index)}
            value={workingDay[index]?.endTime?.minute}
          />
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

  return (
    <div className="container-work-schedule">
      <h6>
        ĐĂNG KÝ LỊCH LÀM VIỆC{" "}
        {data === null ? (
          <span className="not_yet_register">(Chưa đăng ký)</span>
        ) : dataWorkSchedule?.data?.state === 0 ? (
          <span className="pending_approval">(Đang chờ duyệt)</span>
        ) : (
          <span className="done_register">(Đã đăng ký)</span>
        )}
      </h6>
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
