import "./index.scss";
import {Modal} from "antd";

interface ModalCustomProps {
  isModalVisible: boolean;
  handleOk?: () => void;
  handleCancel?: () => void;
  okeText?: string;
  cancelText?: string;
  title: string;
  content: JSX.Element;
  footer?: null;
  destroyOnClose?: boolean;
  width?: string;
}

export function ModalCustom({
  isModalVisible,
  handleOk,
  handleCancel,
  okeText = "Xác nhận",
  cancelText = "Hủy",
  title,
  content,
  footer,
  width,
  destroyOnClose,
}: ModalCustomProps): JSX.Element {
  return (
    <Modal
      width={width}
      destroyOnClose={destroyOnClose}
      centered
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText={okeText}
      cancelText={cancelText}
      className="modal-ant"
      footer={footer}
    >
      {content}
    </Modal>
  );
}
