import "../my-salary-detail/index.scss";
import React, {useState} from "react";
import {ModalCustom} from "@app/components/ModalCustom";
import {Form, Input, InputNumber, notification} from "antd";
import {useMutation} from "react-query";
import ApiSalary from "@app/api/ApiSalary";
import {formatNumber} from "@app/utils/fomat/FormatNumber";

interface IModalCreateProject {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  userId: number;
  month: number;
  year: number;
  handleRefetch?: () => void;
}

export default function ModalOtherSalary(
  props: IModalCreateProject
): JSX.Element {
  const [reason, setReason] = useState<string>();
  const [salary, setSalary] = useState<number>();
  const createBonusSalary = useMutation(ApiSalary.createBonusSalary);
  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <Form labelCol={{span: 3}} wrapperCol={{span: 22}}>
          <Form.Item label="Lý do" name="nameProject">
            <Input
              className="w-full"
              onChange={(e) => {
                setReason(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Số tiền" name="salary">
            <InputNumber
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              onChange={(e) => {
                setSalary(Number(e));
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
      reason: reason || "",
      salary: salary || 0,
      date:
        props.year +
        "/" +
        formatNumber(props.month) +
        "/" +
        formatNumber(props.month),
    };
    createBonusSalary.mutate(data, {
      onSuccess: () => {
        notification.success({message: "create success"});
        if (props?.handleRefetch) {
          props.handleRefetch();
        }
      },
    });
    props.handleOk();
  };

  return (
    <ModalCustom
      destroyOnClose
      isModalVisible={props.isModalVisible}
      handleOk={handleOkModal}
      handleCancel={props.handleCancel}
      title="Thêm lương dự án"
      content={renderContent()}
    />
  );
}
