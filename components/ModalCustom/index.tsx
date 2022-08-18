import "./index.scss";
import {Modal} from "antd";

interface ModalCustomProps {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  title: string;
  content: JSX.Element;
}

export function ModalCustom(props: ModalCustomProps): JSX.Element {
  const {isModalVisible, handleOk, handleCancel, title, content} = props;
  return (
    <Modal
      centered
      title={title}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="modal-ant"
    >
      {content}
    </Modal>
  );
}
