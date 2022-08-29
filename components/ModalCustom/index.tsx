import "./index.scss";
import {Modal} from "antd";

interface ModalCustomProps {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  okeText?: string;
  cancelText?: string;
  title: string;
  content: JSX.Element;
}

export function ModalCustom({
  isModalVisible,
  handleOk,
  handleCancel,
  okeText = "Xác nhận",
  cancelText = "Hủy",
  title,
  content,
}: ModalCustomProps): JSX.Element {
  return (
    <Modal
      centered
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={okeText}
      cancelText={cancelText}
      className="modal-ant"
    >
      {content}
    </Modal>
  );
}
