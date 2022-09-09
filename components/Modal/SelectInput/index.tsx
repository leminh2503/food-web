import "./index.scss";
import {Select} from "antd";
import classNames from "classnames";

interface InputModalProps {
  className?: string;
  label: string;
  setValue: (value: any) => void;
  value?: number;
  required?: boolean;
  keyValue: string;
  data?: {
    value?: number;
    label?: string;
  }[];
}

export function SelectInput({
  className,
  label,
  setValue,
  value,
  required,
  data,
  keyValue,
}: InputModalProps): JSX.Element {
  const onChange = (value: number): void => {
    setValue((prev: any) => ({
      ...prev,
      [keyValue]: value,
    }));
  };

  return (
    <div className={classNames("input-select-container", className)}>
      <h4 className={classNames("label-item mb-2", {required: required})}>
        {label}
      </h4>
      <Select value={value} onChange={onChange}>
        {data?.map(({value, label}, index) => (
          <Select.Option key={index} value={value}>
            {label}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
}
