import React from "react";
import {Filter} from "@app/components/Filter";

interface FilterLeaveWorkProps {
  setFilterText: React.Dispatch<React.SetStateAction<string>>;
  handleOnSearchText: (value: string) => void;
}

export function FilterPermissionGroup({
  setFilterText,
  handleOnSearchText,
}: FilterLeaveWorkProps): JSX.Element {
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
      ]}
    />
  );
}
