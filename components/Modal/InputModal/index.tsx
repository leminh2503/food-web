import "./index.scss";
import {Col, Input, Row} from "antd";
import React from "react";
import classNames from "classnames";

interface InputModalProps {
  className?: string;
  label: string;
  placeholder: string;
  onChange: (value: any) => void;
  value: string;
  require?: boolean;
  keyValue: string;
}

export function InputModal({
  className,
  label,
  placeholder,
  onChange,
  value,
  require,
  keyValue,
}: InputModalProps): JSX.Element {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChange((prev: any) => ({
      ...prev,
      [keyValue]: e.target.value,
    }));
  };

  return (
    <Row className={classNames("input-modal-container", className)}>
      <Col md={6} className="label-item">
        {label}
        <span className="require">{require ? "*" : ""}</span>
      </Col>
      <Col md={18}>
        <Input
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
        />
      </Col>
    </Row>
  );
}
