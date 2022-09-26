import React, {useEffect} from "react";
import {Checkbox, Form, Input, Modal} from "antd";
import {IAddRoleGroupBody, IPermissionModify} from "@app/api/ApiPermisstion";
import {defaultValidateMessages} from "@app/validate/user";

interface ModalInfoProps {
  dataDetail: IAddRoleGroupBody;
  handleAddRoleGroup: (data: IAddRoleGroupBody) => void;
  dataPermissionModify: IPermissionModify[];
  isModalVisible: boolean;
  handleCloseModalFamily: () => void;
}

export function ModalAddRoleGroup(props: ModalInfoProps): JSX.Element {
  const {
    dataDetail,
    handleAddRoleGroup,
    dataPermissionModify,
    isModalVisible,
    handleCloseModalFamily,
  } = props;

  // const [defaultValue, setDefaultValue] = useState<number[]>(
  //   dataDetail?.permissions
  // );

  const [form] = Form.useForm();

  // const onCheckAllChange = (isChecked: boolean) => {
  //   setDefaultValue([]);
  //   if (isChecked) {
  //     setDefaultValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  //   }
  // };

  const onFinish = (fieldsValue: any): void => {
    // handle filter role was selected
    let arrayRoleChosen: number[] = [];
    for (let i = 0; i < dataPermissionModify.length; i++) {
      if (fieldsValue["permissions" + i])
        arrayRoleChosen = arrayRoleChosen.concat(
          fieldsValue["permissions" + i]
        );
    }
    const data = {
      id: dataDetail.id,
      roleName: fieldsValue.nameGroupRole,
      permissions: arrayRoleChosen,
    };
    handleAddRoleGroup(data);
  };

  useEffect(() => {
    form.resetFields();
  }, [isModalVisible]);

  useEffect(() => {
    form.setFieldsValue({
      nameGroupRole: dataDetail?.roleName,
    });
  }, [dataDetail]);

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
          {/* <Form.Item name="checkAll"> */}
          {/*  <Checkbox */}
          {/*    onChange={(e): void => onCheckAllChange(e.target.checked)} */}
          {/*  > */}
          {/*    Chọn tất cả */}
          {/*  </Checkbox> */}
          {/* </Form.Item> */}
          <div className="content-permission-checkbox">
            <div className="flex flex-wrap">
              {dataPermissionModify?.map((permission, index) => {
                return (
                  <div className="w-6/12" key={permission.permissionGroup}>
                    <div className="group-permission-checkbox">
                      <Form.Item
                        name={"permissions" + index}
                        label={permission.permissionGroup}
                        initialValue={dataDetail?.permissions}
                      >
                        <Checkbox.Group>
                          <div className="flex flex-col">
                            {permission.permissions?.map((el, index) => {
                              return (
                                <Checkbox
                                  key={el.permissionKey + index}
                                  value={el.id}
                                  style={{lineHeight: "32px"}}
                                >
                                  {el.permissionName}
                                </Checkbox>
                              );
                            })}
                          </div>
                        </Checkbox.Group>
                      </Form.Item>
                    </div>
                  </div>
                );
              })}
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
      onCancel={handleCloseModalFamily}
      className="modal-ant modal-add-role-group"
    >
      {renderContent()}
    </Modal>
  );
}
