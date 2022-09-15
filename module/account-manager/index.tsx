import "./index.scss";
import {
  Button,
  Card,
  Col,
  Image,
  Modal,
  notification,
  Pagination,
  PaginationProps,
  Row,
  Table,
} from "antd";
import type {ColumnsType} from "antd/es/table";
import React, {useEffect, useState} from "react";
import ApiUser, {
  IInformationAccountBody,
  IRegisterAccountBody,
  IResetPasswordBody,
} from "@app/api/ApiUser";
import {IUserLogin, IWorkType} from "@app/types";
import {useMutation, useQuery} from "react-query";
import {ModalInfo} from "@app/module/account-manager/ModalConfirm";
import {renameKeys} from "@app/utils/convert/ConvertHelper";
import {ModalChangePass} from "@app/module/account-manager/ModalChangePass";
import {ModalAddEmployee} from "@app/module/account-manager/ModalAddEmployee";
import {ModalFamilyCircumstance} from "@app/module/account-manager/ModalFamilyCircumstances";
import {FilterAccount} from "@app/module/account-manager/FilterAccount";
import {LockOutlined, UnlockOutlined} from "@ant-design/icons";
import {IMetadata} from "@app/api/Fetcher";
import fileDownload from "js-file-download";
import {queryKeys} from "@app/utils/constants/react-query";

export function AccountManager(): JSX.Element {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalFamilyVisible, setIsModalFamilyVisible] = useState(false);
  const [isModalAddEmployeeVisible, setIsModalAddEmployeeVisible] =
    useState(false);
  const [isModalChangePassVisible, setIsModalChangePassVisible] =
    useState(false);

  const [filterState, setFilterState] = useState<number>(-1);
  const [filterText, setFilterText] = useState<string>("");
  const [filterPosition, setFilterPosition] = useState<number>(-1);
  const [pagingCurrent, setPagingCurrent] = useState({
    currentPage: 1,
    pageSize: 10,
  });

  const defaultValuesDetail: IUserLogin = {
    fullName: "",
    email: "",
    avatar: "",
    personId: "",
    address: "",
    phoneNumber: "",
    phoneNumberRelative: "",
    baseSalary: 0,
    position: null,
    workType: null,
    dateOfBirth: "",
    deductionOwn: 0,
    familyCircumstances: null,
  };

  const [dataDetail, setDataDetail] = useState<IUserLogin>(defaultValuesDetail);

  const handleOk = (data: IUserLogin): void => {
    Modal.confirm({
      title: "Xác nhận sửa thông tin nhân viên?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        handleUpdateInformationAccount(data);
        setIsModalVisible(false);
      },
    });
  };

  const handleCancel = (): void => {
    setIsModalVisible(false);
  };

  const handleCloseModalFamily = (): void => {
    setIsModalFamilyVisible(false);
  };

  const handleConfirmAddEmployee = (data: IRegisterAccountBody): void => {
    Modal.confirm({
      title: "Xác nhận tạo tài khoản nhân viên?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        handleAddNewEmployee(data);
        setIsModalAddEmployeeVisible(false);
      },
    });
  };

  const handleCancelAddEmployee = (): void => {
    setIsModalAddEmployeeVisible(false);
  };

  const handleConfirmChangePass = (newPassword: string): void => {
    Modal.confirm({
      title: "Xác nhận sửa thông tin nhân viên?",
      okType: "primary",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: () => {
        handleResetPasswordForAccount(newPassword);
        setIsModalChangePassVisible(false);
      },
    });
  };

  const handleCancelChangePass = (): void => {
    setIsModalChangePassVisible(false);
  };

  const getUserAccount = (): Promise<{data: IUserLogin[]; meta: IMetadata}> => {
    const params = {
      pageSize: pagingCurrent.pageSize,
      pageNumber: pagingCurrent.currentPage,
      searchFields: ["fullName"],
      search: filterText,
      filter: {
        position: filterPosition !== -1 ? filterPosition : "",
        state: filterState !== -1 ? filterState : "",
      },
    };
    return ApiUser.getUserAccount(params);
  };

  const {
    data: dataUserAccount,
    refetch,
    isFetching,
  } = useQuery(queryKeys.GET_LIST_ACCOUNT, getUserAccount);

  useEffect(() => {
    refetch();
  }, [filterPosition, filterState, pagingCurrent]);

  const handleOnSearchText = (value: string): void => {
    setFilterText(value);
    refetch();
  };

  const getListWorkType = (): Promise<IWorkType[]> => {
    return ApiUser.getListWorkType();
  };

  const getListPosition = (): Promise<IWorkType[]> => {
    return ApiUser.getListPosition();
  };

  const listWorkType = useQuery(queryKeys.GET_LIST_WORK_TYPE, getListWorkType);
  const listPosition = useQuery(queryKeys.GET_LIST_POSITION, getListPosition);

  const newKeys = {id: "value", name: "label"};

  const listPositionConvert: {value: number; label: string}[] = [];
  listPosition?.data?.map((el) => {
    const renamedObj = renameKeys(el || {}, newKeys);
    listPositionConvert.push(renamedObj);
    return listPositionConvert;
  });

  const newKeysFilter = {id: "value", name: "title"};
  const listPositionConvertForFilter: {
    value: number;
    title: string;
    default?: boolean;
  }[] = [];
  listPosition?.data?.map((el) => {
    const renamedObj = renameKeys(el || {}, newKeysFilter);
    listPositionConvertForFilter.push(renamedObj);
    return listPositionConvert;
  });

  const listWorkTypeConvert: {value: number; label: string}[] = [];
  listWorkType?.data?.map((el) => {
    const renamedObj = renameKeys(el || {}, newKeys);
    listWorkTypeConvert.push(renamedObj);
    return listPositionConvert;
  });

  const handleUserAction = (record: IUserLogin, type: string): void => {
    const title = type === "lock" ? "Khóa" : "Mở khóa";
    Modal.confirm({
      title: `Bạn có muốn ${title.toLowerCase()} tài khoản ${record.email}?`,
      content: `Tài khoản ${record.email} sẽ bị khoá`,
      okType: "primary",
      cancelText: "Huỷ",
      okText: title,
      onOk: () => {
        const values = {id: record.id, state: type === "lock" ? 0 : 1};
        handleBlockAccount(values);
      },
    });
  };

  const updateProfile = useMutation(ApiUser.updateInformationAccount, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Sửa thành công`,
      });
      refetch();
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Sửa thất bại`,
      });
    },
  });

  const handleUpdateInformationAccount = (values: IUserLogin): void => {
    const body: IInformationAccountBody = {
      id: Number(dataDetail.id),
      personId: values.personId,
      dateOfBirth: values.dateOfBirth,
      position: values.positionId,
      workType: values.workTypeId,
      address: values.address,
      phoneNumber: values.phoneNumber,
      phoneNumberRelative: values.phoneNumberRelative,
      baseSalary: values.baseSalary,
      email: values.email,
      fullName: values.fullName,
      deductionOwn: values.deductionOwn,
    };
    updateProfile.mutate(body);
  };

  const blockAccount = useMutation(ApiUser.updateInformationAccount, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Thành công`,
      });
      refetch();
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Thất bại`,
      });
    },
  });

  const handleBlockAccount = (values: IUserLogin): void => {
    const body: IInformationAccountBody = {
      id: Number(values.id),
      state: values.state,
    };
    blockAccount.mutate(body);
  };

  const resetPasswordForAccount = useMutation(ApiUser.resetPasswordForAccount, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Sửa thành công`,
      });
      refetch();
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Sửa thất bại`,
      });
    },
  });

  const handleResetPasswordForAccount = (newPassword: string): void => {
    const body: IResetPasswordBody = {
      id: Number(dataDetail.id),
      newPassword: newPassword,
    };
    resetPasswordForAccount.mutate(body);
  };

  const addNewEmployee = useMutation(ApiUser.addNewEmployee, {
    onSuccess: (data) => {
      notification.success({
        duration: 1,
        message: `Thêm thành công`,
      });
      refetch();
    },
    onError: () => {
      notification.error({
        duration: 1,
        message: `Thêm thất bại`,
      });
    },
  });

  const handleAddNewEmployee = (data: IRegisterAccountBody): void => {
    addNewEmployee.mutate(data);
  };

  const handleExportExcel = async (): Promise<any> => {
    const response = await ApiUser.exportListAccount();
    fileDownload(response.data, response.headers["x-file-name"] || "user.xlsx");
  };

  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    current,
    pageSize
  ) => {
    setPagingCurrent({
      currentPage: current,
      pageSize: pageSize,
    });
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

  const columns: ColumnsType<IUserLogin> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "Ảnh",
      key: "avatar",
      align: "center",
      width: 80,
      render: (_, record): JSX.Element => {
        return (
          <div>
            <Image
              width="40px"
              height="40px"
              style={{objectFit: "cover"}}
              src={record.avatar || "img/avatar/avatar.jpg"}
              fallback="img/avatar/avatar.jpg"
              // preview={false}
            />
          </div>
        );
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Họ & Tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Quản lý",
      dataIndex: "manager",
      key: "manager",
      align: "center",
      render: (_, record): JSX.Element => {
        return (
          <div>
            <span>{record?.manager?.fullName}</span>
          </div>
        );
      },
    },
    {
      title: "Vị trí",
      dataIndex: "workType",
      key: "workType",
      align: "center",
      render: (_, record): JSX.Element => {
        return (
          <div>
            <span>{record?.workType?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      align: "center",
      render: (_, record): JSX.Element => {
        return (
          <div>
            <span>{record?.position?.name}</span>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      align: "center",
      key: "state",
      render: (_, record): JSX.Element => {
        return (
          <div
            className={
              record.state === 1
                ? "light-status-account active"
                : "light-status-account"
            }
          />
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div>
          {Number(record.id) === 1 ? (
            <div />
          ) : (
            <Button
              className="mr-1"
              onClick={(): void => {
                const type = record.state === 1 ? "lock" : "unlock";
                handleUserAction(record, type);
              }}
              icon={
                record.state === 1 ? (
                  <LockOutlined style={{color: "red"}} />
                ) : (
                  <UnlockOutlined style={{color: "green"}} />
                )
              }
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="account-manager-page">
      <Card className="mb-4">
        <div>
          <Row>
            <Col lg={9}>
              <FilterAccount
                setFilterState={setFilterState}
                setFilterText={setFilterText}
                setFilterPosition={setFilterPosition}
                handleOnSearchText={handleOnSearchText}
                listPositionConvertForFilter={listPositionConvertForFilter}
              />
            </Col>
            <Col lg={15}>
              <div className="" style={{float: "right"}}>
                <Button
                  className="mr-4 bg-blue-500 text-neutral-50"
                  onClick={handleExportExcel}
                >
                  Xuất Excel
                </Button>
                <Button
                  onClick={(): void => setIsModalAddEmployeeVisible(true)}
                  className="bg-blue-500 text-neutral-50"
                >
                  Tạo tài khoản mới
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
      <Card>
        <Table
          loading={isFetching}
          columns={columns}
          dataSource={dataUserAccount?.data}
          bordered
          pagination={false}
          onRow={(record, rowIndex) => {
            return {
              onDoubleClick: (): void => {
                setDataDetail(record);
                setIsModalVisible(true);
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
          total={dataUserAccount?.meta.totalItems || 1}
        />
      </Card>
      <ModalInfo
        listPositionConvert={listPositionConvert}
        listWorkTypeConvert={listWorkTypeConvert}
        dataDetail={dataDetail}
        defaultValuesDetail={defaultValuesDetail}
        isModalVisible={isModalVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        setIsModalChangePassVisible={setIsModalChangePassVisible}
        setIsModalFamilyVisible={setIsModalFamilyVisible}
      />
      <ModalAddEmployee
        listPositionConvert={listPositionConvert}
        listWorkTypeConvert={listWorkTypeConvert}
        isModalVisible={isModalAddEmployeeVisible}
        handleConfirmAddEmployee={handleConfirmAddEmployee}
        handleCancelAddEmployee={handleCancelAddEmployee}
      />
      <ModalChangePass
        isModalVisible={isModalChangePassVisible}
        handleConfirmChangePass={handleConfirmChangePass}
        handleCancelChangePass={handleCancelChangePass}
      />
      {isModalFamilyVisible && (
        <ModalFamilyCircumstance
          isModalVisible={isModalFamilyVisible}
          handleCloseModalFamily={handleCloseModalFamily}
          accountId={dataDetail.id}
          idUser={Number(dataDetail?.id)}
        />
      )}
    </div>
  );
}
