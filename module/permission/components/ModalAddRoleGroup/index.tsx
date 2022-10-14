import React, {useEffect, useState} from "react";
import {Checkbox, Form, Input, Modal} from "antd";
import {IAddRoleGroupBody, IPermissionModify} from "@app/api/ApiPermisstion";
import {defaultValidateMessages} from "@app/validate/user";
import {CheckboxChangeEvent} from "antd/es/checkbox";

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
  const [isCheckAll, setIsCheckAll] = useState(false);

  const defaultCheckedGroup = {
    a: false,
    b: false,
    c: false,
    d: false,
    e: false,
    f: false,
    g: false,
    h: false,
    i: false,
    j: false,
  };

  const dataArrDefault: {
    a: number[];
    b: number[];
    c: number[];
    d: number[];
    e: number[];
    f: number[];
    g: number[];
    h: number[];
    i: number[];
    j: number[];
  } = {
    a: [],
    b: [],
    c: [],
    d: [],
    e: [],
    f: [],
    g: [],
    h: [],
    i: [],
    j: [],
  };

  const [arrayDataDefaultCheckedGroup, setArrayDataDefaultCheckedGroup] =
    useState(defaultCheckedGroup);

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

  const onChange = (checkedValues: any[], name: string): void => {
    setArrayDataDefault((prevState: any) => ({
      ...prevState,
      [name]: checkedValues,
    }));
    setDataChosen([...dataChosen, ...checkedValues]);
  };

  const onCheckAllChange = (e: CheckboxChangeEvent): void => {
    const isChecked = e.target.checked;
    setIsCheckAll(isChecked);
    if (isChecked) {
      setArrayDataDefaultCheckedGroup((prevState: any) => ({
        ...prevState,
        a: true,
        b: true,
        c: true,
        d: true,
        e: true,
        f: true,
        g: true,
        h: true,
        i: true,
        j: true,
      }));
      setArrayDataDefault((prevState: any) => ({
        ...prevState,
        a: dataPermissionModify[0].permissions.map((el) => el.id),
        b: dataPermissionModify[1].permissions.map((el) => el.id),
        c: dataPermissionModify[2].permissions.map((el) => el.id),
        d: dataPermissionModify[3].permissions.map((el) => el.id),
        e: dataPermissionModify[4].permissions.map((el) => el.id),
        f: dataPermissionModify[5].permissions.map((el) => el.id),
        g: dataPermissionModify[6].permissions.map((el) => el.id),
        h: dataPermissionModify[7].permissions.map((el) => el.id),
        i: dataPermissionModify[8].permissions.map((el) => el.id),
        j: dataPermissionModify[9].permissions.map((el) => el.id),
      }));
    } else {
      setArrayDataDefaultCheckedGroup(defaultCheckedGroup);
      setArrayDataDefault(dataArrDefault);
    }
  };

  const onCheckAllChangeGroup = (
    e: CheckboxChangeEvent,
    name: string,
    index: number
  ) => {
    const isChecked = e.target.checked;
    setArrayDataDefaultCheckedGroup((prevState: any) => ({
      ...prevState,
      [name]: e.target.checked,
    }));
    if (isChecked) {
      setArrayDataDefault((prevState: any) => ({
        ...prevState,
        [name]: dataPermissionModify[index].permissions.map((el) => el.id),
      }));
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dataChange = dataArrDefault[`${name}`];
      setArrayDataDefault((prevState: any) => ({
        ...prevState,
        [name]: dataChange,
      }));
    }
  };

  useEffect(() => {
    const listKey = Object.keys(arrayDataDefault || {});
    for (const key of listKey) {
      const index = listKey.indexOf(key);
      if (
        arrayDataDefault[key].length ===
        dataPermissionModify[index].permissions.map((el) => el.id).length
      ) {
        setArrayDataDefaultCheckedGroup((prevState: any) => ({
          ...prevState,
          [key]: true,
        }));
      } else {
        setArrayDataDefaultCheckedGroup((prevState: any) => ({
          ...prevState,
          [key]: false,
        }));
      }
    }
  }, [arrayDataDefault]);

  useEffect(() => {
    if (
      arrayDataDefaultCheckedGroup.a &&
      arrayDataDefaultCheckedGroup.b &&
      arrayDataDefaultCheckedGroup.c &&
      arrayDataDefaultCheckedGroup.d &&
      arrayDataDefaultCheckedGroup.e &&
      arrayDataDefaultCheckedGroup.f &&
      arrayDataDefaultCheckedGroup.g &&
      arrayDataDefaultCheckedGroup.h &&
      arrayDataDefaultCheckedGroup.i &&
      arrayDataDefaultCheckedGroup.j
    ) {
      setIsCheckAll(true);
    } else {
      setIsCheckAll(false);
    }
  }, [arrayDataDefaultCheckedGroup]);

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
            rules={[{required: true, whitespace: true}]}
          >
            <Input placeholder="Tên nhóm quyền" />
          </Form.Item>
          <Checkbox checked={isCheckAll} onChange={onCheckAllChange}>
            Chọn tất cả
          </Checkbox>
          <div className="content-permission-checkbox">
            <div className="flex flex-wrap">
              <div className="w-6/12">
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.a}
                  onChange={(e): void => onCheckAllChangeGroup(e, "a", 0)}
                >
                  <h5>{dataPermissionModify[0]?.permissionGroup}</h5>
                </Checkbox>
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
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.b}
                  onChange={(e): void => onCheckAllChangeGroup(e, "b", 1)}
                >
                  <h5>{dataPermissionModify[1]?.permissionGroup}</h5>
                </Checkbox>
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
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.c}
                  onChange={(e): void => onCheckAllChangeGroup(e, "c", 2)}
                >
                  <h5>{dataPermissionModify[2]?.permissionGroup}</h5>
                </Checkbox>
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
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.d}
                  onChange={(e): void => onCheckAllChangeGroup(e, "d", 3)}
                >
                  <h5>{dataPermissionModify[3]?.permissionGroup}</h5>
                </Checkbox>
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
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.e}
                  onChange={(e): void => onCheckAllChangeGroup(e, "e", 4)}
                >
                  <h5>{dataPermissionModify[4]?.permissionGroup}</h5>
                </Checkbox>
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
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.f}
                  onChange={(e): void => onCheckAllChangeGroup(e, "f", 5)}
                >
                  <h5>{dataPermissionModify[5]?.permissionGroup}</h5>
                </Checkbox>
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
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.g}
                  onChange={(e): void => onCheckAllChangeGroup(e, "g", 6)}
                >
                  <h5>{dataPermissionModify[6]?.permissionGroup}</h5>
                </Checkbox>
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
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.h}
                  onChange={(e): void => onCheckAllChangeGroup(e, "h", 7)}
                >
                  <h5>{dataPermissionModify[7]?.permissionGroup}</h5>
                </Checkbox>
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
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.i}
                  onChange={(e): void => onCheckAllChangeGroup(e, "i", 8)}
                >
                  <h5>{dataPermissionModify[8]?.permissionGroup}</h5>
                </Checkbox>
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
                <Checkbox
                  checked={arrayDataDefaultCheckedGroup.j}
                  onChange={(e): void => onCheckAllChangeGroup(e, "j", 9)}
                >
                  <h5>{dataPermissionModify[9]?.permissionGroup}</h5>
                </Checkbox>
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
      onCancel={(): void => {
        handleCloseModalFamily();
        form.resetFields();
      }}
      className="modal-ant modal-add-role-group"
    >
      {renderContent()}
    </Modal>
  );
}
