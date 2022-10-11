import React from "react";
import {Filter} from "@app/components/Filter";
import moment from "moment";

interface FilterWorkScheduleProps {
  setFilterState: React.Dispatch<React.SetStateAction<number>>;
  setFilterYear: React.Dispatch<React.SetStateAction<number>>;
  setFilterMonth: React.Dispatch<React.SetStateAction<number>>;
  visible: boolean;
}

interface DataFilter {
  title: string;
  value: number;
  default?: boolean;
}

export function FilterWorkSchedule({
  setFilterState,
  setFilterYear,
  setFilterMonth,
  visible,
}: FilterWorkScheduleProps): JSX.Element {
  const dataFilterYear = (): DataFilter[] => {
    const years = [];
    const currentYear = moment().year();
    for (let i = 0; i <= 10; i++) {
      years[i] = {
        title: currentYear - i + "",
        value: currentYear - i,
      };
      years[0] = {...years[0], default: true};
    }
    return years;
  };

  const dataFilterMonth = (): DataFilter[] => {
    const currentMonth = moment().month() + 1;
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) =>
      item === currentMonth
        ? {title: item + "", value: item, default: true}
        : {title: item + "", value: item}
    );
  };

  const dataFilterState: DataFilter[] = [
    {
      title: "Tất cả",
      value: -1,
      default: true,
    },
    {
      title: "Chưa đăng ký",
      value: 1,
    },
    {
      title: "Đã đăng ký",
      value: 0 || 2,
    },
    {
      title: "Đang khóa",
      value: 3,
    },
  ];

  return (
    <Filter
      listSearch={
        visible
          ? [
              {
                visible: true,
                isSelect: true,
                data: dataFilterYear(),
                handleOnChange: (value: number): void => {
                  setFilterYear(value);
                },
              },
              {
                visible: true,
                isSelect: true,
                data: dataFilterMonth(),
                handleOnChange: (value: number): void => {
                  setFilterMonth(value);
                },
              },
              {
                visible: true,
                isSelect: true,
                data: dataFilterState,
                handleOnChange: (value: number): void => {
                  setFilterState(value);
                },
              },
            ]
          : [
              {
                visible: true,
                isSelect: true,
                data: dataFilterYear(),
                handleOnChange: (value: number): void => {
                  setFilterYear(value);
                },
              },
              {
                visible: true,
                isSelect: true,
                data: dataFilterMonth(),
                handleOnChange: (value: number): void => {
                  setFilterMonth(value);
                },
              },
            ]
      }
    />
  );
}
