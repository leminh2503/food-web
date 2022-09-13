import "./index.scss";
import {DatePicker} from "antd";
import React from "react";
import classNames from "classnames";
import {ISetStateModal} from "@app/types";
import moment, {Moment} from "moment";

interface DateInputProps {
  className?: string;
  label: string;
  onChange: React.Dispatch<React.SetStateAction<ISetStateModal>>;
  value: string;
  required?: boolean;
  keyValue: string;
  disabledDate?: (d: Moment) => boolean;
}

export function DateInput3({
  className,
  label,
  onChange,
  value,
  required,
  keyValue,
  disabledDate,
}: DateInputProps): JSX.Element {
  const handleChange = (value: Moment | null, dateString: string): void => {
    onChange((prev: ISetStateModal) => ({
      ...prev,
      [keyValue]:
        dateString === "" ? moment().format("YYYY-MM-DD") : dateString,
    }));
  };

  return (
    <div className={classNames("date-input-container3", className)}>
      <h4 className={classNames("label-item mb-2", {required: required})}>
        {label}
      </h4>
      <DatePicker
        value={moment(value)}
        format="YYYY-MM-DD"
        onChange={handleChange}
        disabledDate={disabledDate}
      />
    </div>
  );
}
