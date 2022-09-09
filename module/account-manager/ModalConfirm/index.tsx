import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import {Avatar, Button} from "antd";
import React, {useEffect, useState} from "react";
import {SelectInput} from "@app/components/Modal/SelectInput";
import {IUserLogin} from "@app/types";
import {InputModal2} from "@app/components/Modal/InputModal2";
import {DateInput2} from "@app/components/Modal/DateInput2";
import {initDataPosition} from "@app/utils/constants/user";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleOk: (data: IUserLogin) => void;
  handleCancel: () => void;
  setIsModalChangePassVisible: (istoggle: boolean) => void;
  setIsModalFamilyVisible: (istoggle: boolean) => void;
  dataDetail: IUserLogin;
  listPositionConvert: {value: number; label: string}[];
  listWorkTypeConvert: {value: number; label: string}[];
  defaultValuesDetail: IUserLogin;
}

export function ModalInfo(props: ModalInfoProps): JSX.Element {
  const {
    isModalVisible,
    handleOk,
    handleCancel,
    dataDetail,
    listPositionConvert,
    listWorkTypeConvert,
    setIsModalChangePassVisible,
    setIsModalFamilyVisible,
    defaultValuesDetail,
  } = props;
  const {
    fullName,
    email,
    avatar,
    personId,
    address,
    phoneNumber,
    phoneNumberRelative,
    baseSalary,
    position,
    workType,
    dateOfBirth,
    deductionOwn,
    familyCircumstances,
  } = dataDetail;

  const [adString, setAdString] = useState<IUserLogin>(defaultValuesDetail);
  useEffect(() => {
    setAdString({
      fullName,
      email,
      avatar,
      personId,
      address,
      phoneNumber,
      phoneNumberRelative,
      baseSalary,
      positionId: position?.id || 0,
      workTypeId: workType?.id || 0,
      workType,
      dateOfBirth,
      deductionOwn,
      familyCircumstances,
    });
  }, [dataDetail]);

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <div className="avatar-container mb-3">
          <Avatar size={150} src={avatar || "/img/avatar/avatar.jpg"} />
        </div>
        <InputModal2
          label="Họ và tên"
          value={adString.fullName || ""}
          onChange={setAdString}
          keyValue="fullName"
          placeholder="Nhập họ và tên"
          className="pt-12"
        />
        <InputModal2
          label="Email"
          value={adString.email || ""}
          onChange={setAdString}
          keyValue="email"
          placeholder="Nhập email"
          className="pt-12"
        />
        <DateInput2
          className="pt-12"
          keyValue="birthDay"
          label="Ngày sinh"
          value={adString.dateOfBirth ?? ""}
          onChange={() => {
            console.log(123);
          }}
        />
        <InputModal2
          label="Số điện thoại"
          value={adString.phoneNumber || ""}
          onChange={setAdString}
          keyValue="phoneNumber"
          placeholder="Nhập số điện thoại"
          className="pt-12"
        />
        <InputModal2
          label="Số điện thoại người thân"
          value={adString.phoneNumberRelative || ""}
          onChange={setAdString}
          keyValue="phoneNumberRelative"
          placeholder="Nhập số điện thoại người thân"
          className="pt-12"
        />
        <InputModal2
          label="CMND/CCCD"
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
          label="Chức vụ"
          keyValue="positionId"
          setValue={setAdString}
          value={adString?.positionId || 0}
          data={listPositionConvert}
        />
        <SelectInput
          className="pt-12"
          label="Vị trí"
          keyValue="workTypeId"
          setValue={setAdString}
          value={adString?.workTypeId || 0}
          data={listWorkTypeConvert}
        />
        <SelectInput
          className="pt-12"
          label="Người quản lý"
          keyValue="manager"
          setValue={setAdString}
          value={1}
          data={initDataPosition}
        />
        <InputModal2
          label="Lương cứng"
          value={adString.baseSalary?.toString() || ""}
          onChange={setAdString}
          keyValue="baseSalary"
          placeholder="Nhập lương cứng"
          className="pt-12"
        />
        <InputModal2
          label="Giảm trừ gia cảnh bản thân"
          value={adString.deductionOwn?.toString() || ""}
          onChange={setAdString}
          keyValue="deductionOwn"
          placeholder="Nhập lương cứng"
          className="pt-12"
        />
        <Button
          onClick={() => setIsModalFamilyVisible(true)}
          className="mt-3 button-modal-family"
        >
          Số người phụ thuộc: {familyCircumstances?.length}
        </Button>
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleOk={() => handleOk(adString)}
      handleCancel={() => {
        handleCancel();
        setAdString({
          ...adString,
          positionId: dataDetail?.position?.id || 0,
          workTypeId: dataDetail?.workType?.id || 0,
        });
      }}
      title="Thông tin nhân viên"
      content={renderContent()}
      footer={[
        <Button
          key="changePassword"
          style={{backgroundColor: "#3333"}}
          type="default"
          className="btn-action m-1 hover-pointer"
          onClick={() => setIsModalChangePassVisible(true)}
        >
          Đổi mật khẩu
        </Button>,
        <Button
          key="cancel"
          style={{backgroundColor: "#3333"}}
          type="default"
          className="btn-action m-1 hover-pointer"
          onClick={handleCancel}
        >
          Hủy
        </Button>,
        <Button
          key="save"
          style={{backgroundColor: "#40a9ff"}}
          type="primary"
          className="btn-action m-1 hover-pointer"
          onClick={() => handleOk(adString)}
        >
          Lưu
        </Button>,
      ]}
    />
  );
}
