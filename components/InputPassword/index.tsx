import "./index.scss";
import {Col, Input, Row} from "antd";
import {ChangeEvent, useCallback} from "react";
import {EyeInvisibleOutlined, EyeTwoTone} from "@ant-design/icons";
import { DatePicker, Space } from 'antd';
import moment from 'moment';

interface TextInputProps {
  type?: string;
  label: string;
  // placeholder: string;
  value: string;
  handleChange: (e: string | ChangeEvent<any>) => void;
  handleBlur: (e: string | ChangeEvent<any>) => void;
  name: string;
}

export function InputPassword (props: TextInputProps): JSX.Element {


  const {
    label,
    handleChange,
    // placeholder,
    value,
    handleBlur,
    name,
    type ,
  } = props;



  return (
    <Row className="input-container password-label">
        <Col span={10}>
      <div  className="label-container ">
      <div className="require-label">*</div>
      <div className="input-label">{label}</div>
      
      </div>
      </Col>
    
        <Col span={1}></Col>
      <Col span={13}>
      {type === "password" && (
        <Input
          type="password"
          name={name}
          className="input"
          // placeholder={placeholder}
        //   value={value}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      )}


   
     
     </Col>
    </Row>
  );
}
