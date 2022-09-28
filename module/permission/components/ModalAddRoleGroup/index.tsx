import React, {useEffect, useState} from "react";
import {Checkbox, Form, Input, Modal} from "antd";
import {IAddRoleGroupBody, IPermissionModify} from "@app/api/ApiPermisstion";
import {defaultValidateMessages} from "@app/validate/user";

interface ModalInfoProps {
  arrayRole: any;
  dataDetail: IAddRoleGroupBody;
  handleAddRoleGroup: (data: IAddRoleGroupBody) => void;
  dataPermissionModify: IPermissionModify[];
  isModalVisible: boolean;
  handleCloseModalFamily: () => void;
}

export function ModalAddRoleGroup(props: ModalInfoProps): JSX.Element {
  const {
    arrayRole,
    dataDetail,
    handleAddRoleGroup,
    dataPermissionModify,
    isModalVisible,
    handleCloseModalFamily,
  } = props;

  const [form] = Form.useForm();

  const [dataChosen, setDataChosen] = useState<any[]>(dataDetail.permissions);
  const [arrayDataDefault, setArrayDataDefault] = useState(arrayRole);

  useEffect(() => {
    setDataChosen(dataDetail.permissions);
    setArrayDataDefault(arrayRole);
  }, [dataDetail]);

  const onFinish = (fieldsValue: any): void => {
    const listKey = Object.keys(arrayDataDefault);
    let arrayNeed: number[] = [];
    for (const string of listKey) {
      if (arrayDataDefault[string]) {
        arrayNeed = arrayNeed.concat(arrayDataDefault[string]);
      }
    }
    const data = {
      id: dataDetail.id,
      roleName: fieldsValue.nameGroupRole,
      permissions: Array.from(new Set(arrayNeed)),
    };
    handleAddRoleGroup(data);
  };

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue({
      nameGroupRole: dataDetail?.roleName,
    });
  }, [isModalVisible, dataDetail]);

  const onChange = (checkedValues: any[], name: string) => {
    setArrayDataDefault((prevState: any) => ({
      ...prevState,
      [name]: checkedValues,
    }));
    setDataChosen([...dataChosen, ...checkedValues]);
  };

  const renderContent = (): JSX.Element => {
    return (
      <div>
        <Form
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={defaultValidateMessages}
        >
          <Form.Item
            name="nameGroupRole"
            label="Tên nhóm quyền"
            rules={[
              {
                required: true,
                message: "Tên nhóm quyền không được để trống!",
              },
            ]}
          >
            <Input placeholder="Tên nhóm quyền" />
          </Form.Item>
          <div className="content-permission-checkbox">
            <div className="flex flex-wrap">
              <div className="w-6/12">
                <h5>{dataPermissionModify[0]?.permissionGroup}</h5>
                <Checkbox.Group
                  value={arrayDataDefault?.a}
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "a");
                  }}
                >
                  {dataPermissionModify[0]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="w-6/12">
                <h5>{dataPermissionModify[1]?.permissionGroup}</h5>
                <Checkbox.Group
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "b");
                  }}
                  value={arrayDataDefault?.b}
                >
                  {dataPermissionModify[1]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="w-6/12">
                <h5>{dataPermissionModify[2]?.permissionGroup}</h5>
                <Checkbox.Group
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "c");
                  }}
                  value={arrayDataDefault?.c}
                >
                  {dataPermissionModify[2]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="w-6/12">
                <h5>{dataPermissionModify[3]?.permissionGroup}</h5>
                <Checkbox.Group
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "d");
                  }}
                  value={arrayDataDefault?.d}
                >
                  {dataPermissionModify[3]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="w-6/12">
                <h5>{dataPermissionModify[4]?.permissionGroup}</h5>
                <Checkbox.Group
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "e");
                  }}
                  value={arrayDataDefault?.e}
                >
                  {dataPermissionModify[4]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="w-6/12">
                <h5>{dataPermissionModify[5]?.permissionGroup}</h5>
                <Checkbox.Group
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "f");
                  }}
                  value={arrayDataDefault?.f}
                >
                  {dataPermissionModify[5]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="w-6/12">
                <h5>{dataPermissionModify[6]?.permissionGroup}</h5>
                <Checkbox.Group
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "g");
                  }}
                  value={arrayDataDefault?.g}
                >
                  {dataPermissionModify[6]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="w-6/12">
                <h5>{dataPermissionModify[7]?.permissionGroup}</h5>
                <Checkbox.Group
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "h");
                  }}
                  value={arrayDataDefault?.h}
                >
                  {dataPermissionModify[7]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="w-6/12">
                <h5>{dataPermissionModify[8]?.permissionGroup}</h5>
                <Checkbox.Group
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "i");
                  }}
                  value={arrayDataDefault?.i}
                >
                  {dataPermissionModify[8]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
              <div className="w-6/12">
                <h5>{dataPermissionModify[9]?.permissionGroup}</h5>
                <Checkbox.Group
                  style={{width: "100%"}}
                  onChange={(checkedValue) => {
                    onChange(checkedValue, "j");
                  }}
                  value={arrayDataDefault?.j}
                >
                  {dataPermissionModify[9]?.permissions?.map((el) => (
                    <Checkbox
                      key={el.permissionKey + el.id}
                      value={el.id}
                      style={{lineHeight: "32px"}}
                    >
                      {el.permissionName}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  };
  return (
    <Modal
      centered
      title={dataDetail?.roleName ? "Sửa nhóm quyền" : "Thêm nhóm quyền"}
      visible={isModalVisible}
      okText={dataDetail?.roleName ? " Cập nhật " : "Thêm"}
      cancelText="Hủy"
      onOk={(): void => {
        form.submit();
      }}
      onCancel={() => {
        handleCloseModalFamily();
        form.resetFields();
      }}
      className="modal-ant modal-add-role-group"
    >
      {renderContent()}
    </Modal>
  );
}
