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

export default function ModalDeductionHourSalary(
  props: IModalCreateDeduction
): JSX.Element {
  const [date, setDate] = useState<string>();
  const [hourLateWork, setHourLateWork] = useState<number>();
  const createDeductionHourSalary = useMutation(
    ApiSalary.createDeductionHourSalary
  );
  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <Form labelCol={{span: 6}} wrapperCol={{span: 18}}>
          <Form.Item label="Ngày đi muộn" name="a">
            <Input
              name="a"
              type="date"
              className="w-full"
              onChange={(e) => {
                setDate(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            label="Số giờ đi muộn"
            name="b"
            rules={[
              {min: 0, message: "Giá trị phải lớn hơn 0"},
              {max: 24, message: "Giá trị phải nhỏ hơn hoặc bằng 24"},
            ]}
          >
            <InputNumber
              name="b"
              max={24}
              min={0}
              className="w-full"
              onChange={(e) => {
                setHourLateWork(Number(e));
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
      hourLateWork: hourLateWork || 0,
    };
    createDeductionHourSalary.mutate(data, {
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
      title="Thêm lương khấu trừ theo giờ"
      content={renderContent()}
    />
  );
}
