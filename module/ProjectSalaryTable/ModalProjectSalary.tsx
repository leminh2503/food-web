import "../my-salary-detail/index.scss";
import React, {useState} from "react";
import {ModalCustom} from "@app/components/ModalCustom";
import {Form, InputNumber, notification, Select} from "antd";
import {IDataProjectList} from "@app/types";
import {useMutation} from "react-query";
import ApiSalary from "@app/api/ApiSalary";
import {formatNumber} from "@app/utils/fomat/FormatNumber";

interface IModalCreateProject {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  listProject?: IDataProjectList[];
  userId: number;
  month: number;
  year: number;
  handleRefetch?: () => void;
}

export default function ModalProjectSalary(
  props: IModalCreateProject
): JSX.Element {
  const [project, setProject] = useState<number>();
  const [salary, setSalary] = useState<number>();
  const createProjectSalary = useMutation(ApiSalary.createSalaryProject);
  const renderContent = (): JSX.Element => {
    return (
      <div className="modal-info">
        <Form labelCol={{span: 3}} wrapperCol={{span: 22}}>
          <Form.Item label="Dự án" name="nameProject">
            <Select
              style={{width: 120}}
              onChange={(e) => {
                setProject(Number(e));
              }}
            >
              {props?.listProject?.map((el, index) => (
                <Select.Option key={index} value={el?.id}>
                  {el?.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Thưởng" name="salary">
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
      project: project || 0,
      salary: salary || 0,
      date:
        props.year +
        "/" +
        formatNumber(props.month) +
        "/" +
        formatNumber(props.month),
    };
    createProjectSalary.mutate(data, {
      onSuccess: () => {
        if (props.handleRefetch) {
          props.handleRefetch();
        }
        notification.success({message: "create success"});
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
