import React, {useEffect} from "react";
import {Filter} from "@app/components/Filter";
import moment from "moment";
import {queryKeys} from "@app/utils/constants/react-query";
import {useQuery} from "react-query";
import ApiWorkType from "@app/api/ApiWorkType";
import {IWorkType} from "@app/types";
import {IMetadata} from "@app/api/Fetcher";

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

  const getWorkType = (): Promise<{data: IWorkType[]; meta: IMetadata}> => {
    return ApiWorkType.getWorkType({
      pageSize: 30,
      pageNumber: 1,
    });
  };
  const {data: dataWorkType, refetch} = useQuery(
    queryKeys.GET_LIST_WORK_TYPE_FOR_SETTING,
    getWorkType
  );

  useEffect(() => {
    refetch();
  }, []);

  const dataFilterState = (): DataFilter[] => {
    const workTypeArray: DataFilter[] = [
      {
        title: "Tất cả",
        value: 0,
        default: true,
      },
    ];
    dataWorkType?.data.forEach((item) => {
      if (item.name && item.id) {
        const newWorkType = {
          title: `${item?.name.charAt(0).toUpperCase()}${item?.name.slice(1)}`,
          value: item?.id,
        };
        workTypeArray.push(newWorkType);
      }
    });
    return workTypeArray;
  };

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
                data: dataFilterState(),
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
