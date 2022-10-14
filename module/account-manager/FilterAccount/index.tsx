import React from "react";
import {Filter} from "@app/components/Filter";

interface FilterLeaveWorkProps {
  setFilterState: React.Dispatch<React.SetStateAction<number>>;
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
  setFilterPosition: React.Dispatch<React.SetStateAction<number>>;
  handleOnSearchText: (value: string) => void;
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
  handleOnSearchText,
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
            handleOnSearchText(value);
          },
        },
        {
          visible: true,
          isSelect: true,
          label: "Chức vụ:",
          data: dataFilterPosition,
          handleOnChange: (value: number): void => {
            setFilterPosition(value);
          },
        },
        {
          visible: true,
          isSelect: true,
          label: "Trạng thái:",
          data: dataFilterState,
          handleOnChange: (value: number): void => {
            setFilterState(value);
          },
        },
      ]}
    />
  );
}
