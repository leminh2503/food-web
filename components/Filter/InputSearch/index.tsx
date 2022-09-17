import "./index.scss";
import {Input} from "antd";
import React, {ChangeEvent} from "react";
import classNames from "classnames";

interface InputSearchProps {
  searchString?: string;
  onSearchString?: (
    value: string,
    event?:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
  visible?: boolean;
  placeholder: string;
  onChangeSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
  index: number;
}

export function InputSearch({
  searchString,
  onSearchString,
  visible,
  placeholder,
  onChangeSearch,
  index,
}: InputSearchProps): JSX.Element {
  return (
    <div
      className={classNames("search-input-container", {"pl-5": index !== 0})}
    >
      {visible && onChangeSearch && (
        <Input.Search
          defaultValue={searchString}
          placeholder={placeholder}
          onSearch={onSearchString}
          onChange={onChangeSearch}
        />
      )}
    </div>
  );
}
