import "../my-salary-detail/index.scss";
import React, {useState} from "react";
import {ModalCustom} from "@app/components/ModalCustom";
import {Form, Input, InputNumber, notification} from "antd";
import {useMutation} from "react-query";
import ApiSalary from "@app/api/ApiSalary";

interface IModalCreateDeduction {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  userId: number;
  handleRefetch?: () => void;
}

export default function ModalDeductionSalary(
  props: IModalCreateDeduction
): JSX.Element {
  const [date, setDate] = useState<string>();
  const [dayOffWork, setDayOffWork] = useState<number>();
  const createDeductionDaySalary = useMutation(
    ApiSalary.createDeductionDaySalary
  );
  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <Form labelCol={{span: 5}} wrapperCol={{span: 19}}>
          <Form.Item label="Ngày nghỉ" name="a">
            <Input
              type="date"
              className="w-full"
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            label="số ngày nghỉ"
            name="b"
            rules={[
              {min: 0, message: "Giá trị phải lớn hơn 0"},
              {max: 31, message: "Giá trị phải nhỏ hơn hoặc bằng 31"},
            ]}
          >
            <InputNumber
              name="b"
              max={31}
              min={0}
              className="w-full"
              onChange={(e) => {
                setDayOffWork(Number(e));
              }}
            />
          </Form.Item>
        </Form>
      </div>
    );
  };

  const handleOkModal = (): void => {
    const data = {
      user: props?.userId || 0,
      date: date || "",
      dayOffWork: dayOffWork || 0,
    };
    createDeductionDaySalary.mutate(data, {
      onSuccess: () => {
        notification.success({message: "Tạo thành công"});
        if (props?.handleRefetch) {
          props.handleRefetch();
        }
        props.handleOk();
      },
    });
  };

  return (
    <ModalCustom
      destroyOnClose
      isModalVisible={props.isModalVisible}
      handleOk={handleOkModal}
      handleCancel={props.handleCancel}
      title="Thêm lương khấu trừ"
      content={renderContent()}
    />
  );
}
