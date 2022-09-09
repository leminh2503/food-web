import React from "react";
import {Filter} from "@app/components/Filter";
import {useQueryClient} from "react-query";

interface FilterLeaveWorkProps {
  setFilterState: React.Dispatch<React.SetStateAction<number>>;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
  setFilterPosition: React.Dispatch<React.SetStateAction<number>>;
  listPositionConvertForFilter: {
    title: string;
    value: number;
    default?: boolean;
  }[];
}

interface DataFilter {
  title: string;
  value: number;
  default?: boolean;
}

export function FilterAccount({
  setFilterState,
  setFilterText,
  setFilterPosition,
  listPositionConvertForFilter,
}: FilterLeaveWorkProps): JSX.Element {
  const dataFilterState: DataFilter[] = [
    {title: "Tất cả", value: -1, default: true},
    {title: "Hoạt động", value: 1},
    {title: "Bị khóa", value: 0},
  ];

  const dataFilterPosition = [
    {
      title: "Tất cả",
      value: -1,
      default: true,
    },
    ...listPositionConvertForFilter,
  ];
  const queryClient = useQueryClient();

  return (
    <Filter
      listSearch={[
        {
          visible: true,
          isSearch: true,
          placeholder: "Nhập từ khóa tìm kiếm",
          handleOnChangeSearch: (e): void => {
            setFilterText(e.target.value);
          },
          handleOnSearch: (value): void => {
            setFilterText(value);
            queryClient.refetchQueries({
              queryKey: "listUserAccount",
            });
          },
        },
        {
          visible: true,
          isSelect: true,
          data: dataFilterPosition,
          handleOnChange: (value: number): void => {
            setFilterPosition(value);
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
      ]}
    />
  );
}