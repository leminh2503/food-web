import "./index.scss";
import {ModalCustom} from "@app/components/ModalCustom";
import React, {useEffect, useState} from "react";
import {InputModal2} from "@app/components/Modal/InputModal2";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleConfirmChangePass: (newPassword: string) => void;
  handleCancelChangePass: () => void;
}

export function ModalChangePass(props: ModalInfoProps): JSX.Element {
  const {isModalVisible, handleConfirmChangePass, handleCancelChangePass} =
    props;
  const [adString, setAdString] = useState({
    newPassword: "",
    passwordConfirm: "",
  });

  useEffect(() => {
    setAdString({
      newPassword: "",
      passwordConfirm: "",
    });
  }, [isModalVisible]);

  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <InputModal2
          type="password"
          label="Mật khẩu mới"
          value={adString.newPassword || ""}
          required
          onChange={setAdString}
          keyValue="newPassword"
          placeholder="Nhập mật khẩu mới"
          className="pt-12"
        />
        <InputModal2
          type="password"
          label="Nhập lại mật khẩu mới"
          value={adString.passwordConfirm || ""}
          required
          onChange={setAdString}
          keyValue="passwordConfirm"
          placeholder="Nhập lại mật khẩu mới"
          className="pt-12"
        />
      </div>
    );
  };

  return (
    <ModalCustom
      isModalVisible={isModalVisible}
      handleOk={() => {
        handleConfirmChangePass(adString.newPassword);
      }}
      handleCancel={handleCancelChangePass}
      title="Đổi mật khẩu"
      content={renderContent()}
    />
  );
}
