import "./index.scss";
import {Input} from "antd";
import React from "react";
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
}

export function InputModal2({
  className,
  label,
  placeholder,
  onChange,
  value,
  required,
  keyValue,
  type,
}: InputModalProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange((prev: any) => ({
      ...prev,
      [keyValue]: e.target.value,
    }));
  };

  return (
    <div className={classNames("input-modal-container2", className)}>
      <h4 className={classNames("label-item mb-2", {required: required})}>
        {label}
      </h4>
      {type === "password" ? (
        <Input.Password
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
        />
      ) : (
        <Input
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
        />
      )}
    </div>
  );
}
