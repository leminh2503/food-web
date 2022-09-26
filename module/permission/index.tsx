import "./index.scss";
import React, {useState} from "react";
import {
  Button,
  Card,
  Modal,
  notification,
  Pagination,
  PaginationProps,
  Table,
} from "antd";
import {ColumnsType} from "antd/es/table";
import {FilterPermissionGroup} from "@app/module/permission/components/FilterPermissionGroup";
import {IMetadata} from "@app/api/Fetcher";
import {useMutation, useQuery} from "react-query";
import {queryKeys} from "@app/utils/constants/react-query";
import ApiPermisstion, {
  IAddRoleGroupBody,
  IPermission,
  IPermissionModify,
  IRole,
} from "@app/api/ApiPermisstion";
import {CheckOutlined, DeleteOutlined} from "@ant-design/icons";
import {ModalAddRoleGroup} from "@app/module/permission/components/ModalAddRoleGroup";

export function Permission(): JSX.Element {
  const [filterText, setFilterText] = useState<string>("");
  const [isModalAddPermission, setIsModalAddPermission] = useState(false);
  const [dataDetail, setDataDetail] = useState<IAddRoleGroupBody>({
    roleName: "",
    permissions: [],
  });
  const [pagingCurrent, setPagingCurrent] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const getPermissionGroup = (): Promise<{
    data: IPermission[];
    meta: IMetadata;
  }> => {
    return ApiPermisstion.getAllPermission();
  };

  const {data: dataPermissionGroup, isFetching: isFetchingPermission} =
    useQuery(queryKeys.GET_ALL_PERMISSION, getPermissionGroup);

  const getRoles = (): Promise<{
    data: IRole[];
    meta: IMetadata;
  }> => {
    const params = {
      pageSize: pagingCurrent.pageSize,
      pageNumber: pagingCurrent.currentPage,
      searchFields: ["roleName"],
      search: filterText,
    };
    return ApiPermisstion.getAllRole(params);
  };

  const {
    data: dataRoles,
    refetch: refetchRoles,
    isFetching: isFetchingRoles,
  } = useQuery(queryKeys.GET_ROLES, getRoles);

  const getPermissionModify = (): Promise<IPermissionModify[]> => {
    return ApiPermisstion.getAllPermissionModify();
  };

  const {data: dataPermissionModify} = useQuery(
    queryKeys.GET_PERMISSION_MODIFY,
    getPermissionModify
  );

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ): void => {
    setPagingCurrent({
      currentPage: current,
      pageSize: pageSize,
    });
  };

  const handleOnSearchText = (value: string): void => {
    setFilterText(value);
    refetchRoles();
  };

  const handleChangePagination: PaginationProps["onChange"] = (
    pageNumber,
    pageSize
  ) => {
    setPagingCurrent({
      currentPage: pageNumber,
      pageSize: pageSize,
    });
  };

  const deleteRoleGroup = useMutation(ApiPermisstion.deleteRoleGroup, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Xóa thành công`,
      });
      refetchRoles();
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Xóa thất bại`,
      });
    },
  });

  const handleDeleteRoleGroup = (id: number): void => {
    Modal.confirm({
      title: "Xác nhận xóa nhóm quyền?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        deleteRoleGroup.mutate(id);
      },
    });
  };

  const addRoleGroup = useMutation(ApiPermisstion.addNewRoleGroup, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Tạo thành công`,
      });
      refetchRoles();
      setIsModalAddPermission(false);
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Tạo thất bại`,
      });
    },
  });

  const updateRoleGroup = useMutation(ApiPermisstion.updateRoleGroup, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Cập nhật thành công`,
      });
      refetchRoles();
      setIsModalAddPermission(false);
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Cập nhật thất bại`,
      });
    },
  });

  const handleAddRoleGroup = (data: IAddRoleGroupBody): void => {
    Modal.confirm({
      title: "Xác nhận tạo nhóm quyền?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        if (data.id) {
          updateRoleGroup.mutate(data);
        } else {
          addRoleGroup.mutate(data);
        }
      },
    });
  };

  const handleCloseModalFamily = (): void => {
    setIsModalAddPermission(false);
  };

  const columns: ColumnsType<IRole> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Nhóm quyền",
      dataIndex: "roleName",
      key: "roleName",
      width: 200,
      align: "center",
      fixed: "left",
    },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "name",
      align: "center",
      children: dataPermissionGroup?.data?.map((permission, index) => ({
        title: permission.permissionName,
        align: "center",
        width: 175,
        dataIndex: "permissionGroup",
        render: (_, data) => {
          return data.permissions?.find((per) => per.id === permission.id) ? (
            <CheckOutlined style={{color: "#006400", fontSize: "19px"}} />
          ) : (
            "-"
          );
        },
      })),
    },
    {
      title: "Xóa",
      align: "center",
      width: 60,
      fixed: "right",
      render: (_, el) => {
        return (
          <DeleteOutlined
            style={{fontSize: "1rem", color: "red"}}
            title="Xóa nhóm quyền"
            onClick={(record) => {
              handleDeleteRoleGroup(el.id);
            }}
          />
        );
      },
    },
  ];
  return (
    <div className="permission-page">
      <Card>
        <div className="mb-5 flex justify-between">
          <FilterPermissionGroup
            setFilterText={setFilterText}
            handleOnSearchText={handleOnSearchText}
          />
          <Button
            onClick={(): void => {
              setDataDetail({
                id: undefined,
                permissions: [],
                roleName: "",
              });
              setIsModalAddPermission(true);
            }}
            className="bg-blue-500 text-neutral-50"
          >
            Thêm nhóm quyền
          </Button>
        </div>
        <Table
          scroll={{x: Number(dataPermissionGroup?.meta.totalItems) * 175}}
          loading={isFetchingRoles || isFetchingPermission}
          bordered
          columns={columns}
          dataSource={dataRoles?.data}
          pagination={false}
          onRow={(record, rowIndex) => {
            const data: IAddRoleGroupBody = {
              id: record.id,
              roleName: record.roleName,
              permissions: record.permissions.map((el) => el.id),
            };
            return {
              onDoubleClick: (): void => {
                setIsModalAddPermission(true);
                setDataDetail(data);
              },
            };
          }}
        />
        <Pagination
          className="mt-3 float-right"
          showSizeChanger
          onShowSizeChange={onShowSizeChange}
          onChange={handleChangePagination}
          defaultCurrent={pagingCurrent.currentPage}
          total={dataRoles?.meta.totalItems || 1}
        />
      </Card>
      <ModalAddRoleGroup
        dataDetail={dataDetail}
        handleAddRoleGroup={handleAddRoleGroup}
        dataPermissionModify={dataPermissionModify || []}
        isModalVisible={isModalAddPermission}
        handleCloseModalFamily={handleCloseModalFamily}
      />
    </div>
  );
}
