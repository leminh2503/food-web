import "./index.scss";
import {Select} from "antd";
import classNames from "classnames";

interface SelectSearchProps {
  visible?: boolean;
  handleChange?: (value: number) => void;
  data?: {
    title: string;
    value: number;
    default?: boolean;
  }[];
  index: number;
  label?: string;
}

export function SelectSearch({
  visible,
  handleChange,
  data,
  index,
  label,
}: SelectSearchProps): JSX.Element {
  const defaultItem = data?.find((item) => item.default);

  return (
    <div
      className={classNames("select-input-container flex items-center", {
        "pl-5": index !== 0,
      })}
    >
      {label && <span className="label">{label}</span>}
      {visible && data && (
        <Select
          defaultValue={defaultItem?.value}
          onChange={handleChange}
          className="w-full"
        >
          {data.map((item, index) => (
            <Select.Option key={index} value={item.value}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      )}
    </div>
  );
}
