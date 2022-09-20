import React from "react";
import {Modal} from "antd";
import {IPermission} from "@app/api/ApiPermisstion";

interface ModalInfoProps {
  isModalVisible: boolean;
  handleCloseModalFamily: () => void;
  dataPermissionGroup: IPermission[];
}

export function ModalAddRoleGroup(props: ModalInfoProps): JSX.Element {
  const {isModalVisible, handleCloseModalFamily, dataPermissionGroup} = props;
  console.log(
    dataPermissionGroup.filter((el) => {
      return el.permissionKey.includes("USER.");
    })
  );

  const renderContent = (): JSX.Element => {
    return <div>123</div>;
  };
  return (
    <Modal
      centered
      title="Thêm nhóm quyền"
      visible={isModalVisible}
      onCancel={handleCloseModalFamily}
      className="modal-ant modal-family-circumstances"
      footer={null}
    >
      {renderContent()}
    </Modal>
  );
}
