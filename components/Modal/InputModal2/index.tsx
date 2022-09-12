import "./index.scss";
import {Input} from "antd";
import React, {useEffect, useState} from "react";
import classNames from "classnames";

interface InputModalProps {
  className?: string;
  label: string;
  placeholder?: string;
  onChange: (value: any) => void;
  value: string;
  required?: boolean;
  keyValue: string;
  type?: string;
  rules?: any;
}

export function InputModal2({
  rules,
  className,
  label,
  placeholder,
  onChange,
  value,
  required,
  keyValue,
  type,
}: InputModalProps): JSX.Element {
  const [dataInput, setDataInput] = useState(value);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange((prev: any) => ({
      ...prev,
      [keyValue]: e.target.value,
    }));
  };

  useEffect(() => {
    setDataInput(value);
  }, [value]);
  // console.log(value, keyValue);

  return (
    <div className={classNames("input-modal-container2", className)}>
      <h4 className={classNames("label-item mb-2", {required: required})}>
        {label}
      </h4>
      {type === "password" ? (
        <Input.Password
          name={keyValue}
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
        />
      ) : (
        <Input
          name={keyValue}
          placeholder={placeholder}
          onChange={handleChange}
          value={dataInput}
        />
      )}
    </div>
  );
}
