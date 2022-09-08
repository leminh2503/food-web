import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import {InputModal2} from "@app/components/Modal/InputModal2";
import {IFamilyCircumstance, TypeOfAction} from "@app/types";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleConfirmModal: (data: IFamilyCircumstance, type: TypeOfAction) => void;
  handleCancelModal: () => void;
  idUser: number;
  dataFamily: IFamilyCircumstance;
}

export function ModalAddFamily(props: ModalInfoProps): JSX.Element {
  const {
    isModalVisible,
    handleConfirmModal,
    handleCancelModal,
    idUser,
    dataFamily,
  } = props;

  const defaultFormValues = {
    id: dataFamily?.id,
    userId: idUser,
    fullName: dataFamily?.fullName,
    IDCode: dataFamily?.IDCode,
    yearOfBirth: dataFamily?.yearOfBirth,
    relationship: dataFamily?.relationship,
    phoneNumber: dataFamily?.phoneNumber,
  };

  const [adString, setAdString] =
    useState<IFamilyCircumstance>(defaultFormValues);

  useEffect(() => {
    setAdString(defaultFormValues);
  }, [isModalVisible, dataFamily]);

  const type = dataFamily.fullName ? TypeOfAction.EDIT : TypeOfAction.ADD;

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <InputModal2
          label="Họ và tên"
          value={adString.fullName || ""}
          onChange={setAdString}
          keyValue="fullName"
          placeholder="Nhập họ và tên"
          className="pt-12"
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
          label="CMND/CCCD"
          value={adString.IDCode?.toString() || ""}
          onChange={setAdString}
          keyValue="IDCode"
          placeholder="Nhập CMND/CCCD"
          className="pt-12"
        />
        <InputModal2
          label="Quan hệ"
          value={adString.relationship || ""}
          onChange={setAdString}
          keyValue="relationship"
          placeholder="Nhập quan hệ"
          className="pt-12"
        />
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleOk={() => {
        handleConfirmModal(adString, type);
      }}
      handleCancel={handleCancelModal}
      title="Thêm/Sửa người phụ thuộc"
      content={renderContent()}
    />
  );
}
