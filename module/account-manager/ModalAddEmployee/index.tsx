import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import {SelectInput} from "@app/components/Modal/SelectInput";
import {InputModal2} from "@app/components/Modal/InputModal2";
import {DateInput2} from "@app/components/Modal/DateInput2";
import {IRegisterAccountBody} from "@app/api/ApiUser";
import {EEnglishCertificate, EUserGender} from "@app/types";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleConfirmAddEmployee: (data: IRegisterAccountBody) => void;
  handleCancelAddEmployee: () => void;
  listPositionConvert: {value: number; label: string}[];
  listWorkTypeConvert: {value: number; label: string}[];
}

export function ModalAddEmployee(props: ModalInfoProps): JSX.Element {
  const {
    isModalVisible,
    handleConfirmAddEmployee,
    handleCancelAddEmployee,
    listPositionConvert,
    listWorkTypeConvert,
  } = props;

  const defaultFormValues = {
    password: "123123",
    gender: EUserGender.OTHER,
    englishCertificate: EEnglishCertificate.OTHER,
    englishScore: 0,
    workRoom: "",
    personId: "",
    dateOfBirth: "",
    position: 0,
    workType: 0,
    address: "",
    phoneNumber: "",
    phoneNumberRelative: "",
    baseSalary: 0,
    manageSalary: 0,
    manager: 1,
    email: "",
    employeeCode: "",
    fullName: "",
  };

  const [adString, setAdString] =
    useState<IRegisterAccountBody>(defaultFormValues);

  useEffect(() => {
    setAdString(defaultFormValues);
  }, [isModalVisible]);

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <InputModal2
          label="Họ và tên"
          required
          value={adString.fullName || ""}
          onChange={setAdString}
          keyValue="fullName"
          placeholder="Nhập họ và tên"
          className="pt-12"
        />
        <InputModal2
          label="Mã nhân viên"
          required
          value={adString.employeeCode || ""}
          onChange={setAdString}
          keyValue="employeeCode"
          placeholder="Nhập họ và tên"
          className="pt-12"
        />
        <InputModal2
          label="Email"
          required
          value={adString.email || ""}
          onChange={setAdString}
          keyValue="email"
          placeholder="Nhập email"
          className="pt-12"
        />
        <DateInput2
          className="pt-12"
          keyValue="dateOfBirth"
          label="Ngày sinh"
          value={adString.dateOfBirth ?? ""}
          onChange={() => {
            console.log(123);
          }}
        />
        <InputModal2
          label="Số điện thoại"
          value={adString.phoneNumber || ""}
          required
          onChange={setAdString}
          keyValue="phoneNumber"
          placeholder="Nhập số điện thoại"
          className="pt-12"
        />
        <InputModal2
          label="Số điện thoại người thân"
          value={adString.phoneNumberRelative || ""}
          required
          onChange={setAdString}
          keyValue="phoneNumberRelative"
          placeholder="Nhập số điện thoại người thân"
          className="pt-12"
        />
        <InputModal2
          label="CMND/CCCD"
          required
          value={adString.personId?.toString() || ""}
          onChange={setAdString}
          keyValue="personId"
          placeholder="Nhập CMND/CCCD"
          className="pt-12"
        />
        <InputModal2
          label="Địa chỉ"
          value={adString.address || ""}
          onChange={setAdString}
          keyValue="address"
          placeholder="Nhập địa chỉ"
          className="pt-12"
        />
        <SelectInput
          className="pt-12"
          require
          label="Chức vụ"
          keyValue="position"
          setValue={setAdString}
          value={adString?.position || 0}
          data={listPositionConvert}
        />
        <SelectInput
          className="pt-12"
          require
          label="Vị trí"
          keyValue="workType"
          setValue={setAdString}
          value={adString?.workType || 0}
          data={listWorkTypeConvert}
        />
        {/* <SelectInput */}
        {/*  className="pt-12" */}
        {/*  label="Người quản lý" */}
        {/*  keyValue="manager" */}
        {/*  setValue={setAdString} */}
        {/*  value={1} */}
        {/*  data={initDataPosition} */}
        {/* /> */}
        <InputModal2
          label="Lương cứng"
          required
          value={adString.baseSalary?.toString() || ""}
          onChange={setAdString}
          keyValue="baseSalary"
          placeholder="Nhập lương cứng"
          className="pt-12"
        />
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleOk={() => {
        handleConfirmAddEmployee(adString);
      }}
      handleCancel={handleCancelAddEmployee}
      title="Tạo tài khoản"
      content={renderContent()}
    />
  );
}
