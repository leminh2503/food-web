import React from "react";
import {Filter} from "@app/components/Filter";
import moment from "moment";

interface IFilterLeaveWork {
  state: number[];
  month: number;
  year: number;
}
interface FilterLeaveWorkProps {
  setFilter: React.Dispatch<React.SetStateAction<IFilterLeaveWork>>;
}

interface DataFilter {
  title: string;
  value: number;
  default?: boolean;
}

export function FilterLeaveWork({
  setFilter,
}: FilterLeaveWorkProps): JSX.Element {
  const dataFilterState: DataFilter[] = [
    {title: "Tất cả", value: 3, default: true},
    {title: "Đang chờ duyệt", value: 0},
    {title: "Đã chấp nhận", value: 1},
    {title: "Bị từ chối", value: 2},
  ];

  const dataFilterYear = (): DataFilter[] => {
    const years: any = [];
    const currentYear = moment().year();
    for (let i = 0; i <= 10; i++) {
      years[i] = {
        title: currentYear - i + "",
        value: currentYear - i,
      };
      years[0] = {...years[0], default: true};
    }
    return years.reverse();
  };

  const dataFilterMonth = (): DataFilter[] => {
    const currentMonth = moment().month() + 1;
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) =>
      item === currentMonth
        ? {title: item + "", value: item, default: true}
        : {title: item + "", value: item}
    );
  };

  return (
    <Filter
      listSearch={[
        {
          visible: true,
          isSelect: true,
          data: dataFilterState,
          handleOnChange: (value: number): void => {
            if (value === 3) {
              setFilter((prev) => ({...prev, state: [0, 1, 2]}));
            } else {
              setFilter((prev) => ({...prev, state: [value]}));
            }
          },
        },
        {
          visible: true,
          isSelect: true,
          data: dataFilterYear(),
          handleOnChange: (value: number): void => {
            setFilter((prev) => ({...prev, year: value}));
          },
        },
        {
          visible: true,
          isSelect: true,
          data: dataFilterMonth(),
          handleOnChange: (value: number): void => {
            setFilter((prev) => ({...prev, month: value}));
          },
        },
      ]}
    />
  );
}
