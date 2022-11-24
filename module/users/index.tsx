import "./index.scss";
import React, {useEffect, useState} from "react";
import {IGetUsers} from "@app/types";
import {IMetadata} from "@app/api/Fetcher";
import ApiUser from "@app/api/ApiUser";
import {ColumnsType} from "antd/es/table";
import {Input, Modal, Spin, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {ModalEditUser} from "@app/module/users/EditUser";

export function Users(): JSX.Element {
  const [allUsers, setAllUser] = useState<Array<any>>([]);
  const [search, setSearch] = useState<string>("");
  const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const sortDataUser = (allUsers: Array<any>): Array<any> => {
    return allUsers?.sort((a, b) => {
      if (a.budget > b.budget) {
        return -1;
      }
      return 0;
    });
  };
  const dataSearch = (): Array<any> => {
    return sortDataUser(allUsers)?.filter((item) =>
      item?.username.toLowerCase().includes(search.toLowerCase())
    );
  };
  // console.log(dataSearch());
  const onChangeTextSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };
  useEffect(() => {
    setLoading(true);
    const getAllUsers = (): Promise<{data: IGetUsers[]; meta: IMetadata}> => {
      return ApiUser.getUserAccount();
    };
    getAllUsers().then((value) => {
      setLoading(false);
      const arrDataUser: React.SetStateAction<any[]> = [];
      value.data.map((user) => arrDataUser.push(user));
      setAllUser(arrDataUser);
    });
  }, []);
  const handleEditUser = (record: IGetUsers): void => {
    setIsOpenModalEdit(true);
    setUserName(record.username);
    setFirstName(record.firstName);
    setLastName(record.lastName);
  };
  const handleCancelModalEdit = (): void => {
    setIsOpenModalEdit(false);
  };

  const handleConfirmModalEdit = (): void => {
    setIsOpenModalEdit(false);
  };
  const handleDeleteUser = (): void => {
    Modal.confirm({
      title: "Delete User",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
    });
  };
  const columns: ColumnsType<IGetUsers> = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: "UserName",
      dataIndex: "username",
      key: "username",
      align: "center",
      render: (_, record) => <div>{record.username}</div>,
    },
    {
      title: "FirstName",
      dataIndex: "firstName",
      key: "firstName",
      align: "center",
      render: (_, record) => <div>{record.firstName}</div>,
    },
    {
      title: "LastName",
      dataIndex: "lastName",
      key: "lastName",
      align: "center",
      render: (_, record) => <div>{record.lastName}</div>,
    },
    {
      title: "Balance",
      dataIndex: "budget",
      key: "budget",
      align: "center",
      render: (_, record) => <div>{record.budget}</div>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <>
          <EditOutlined
            style={{color: "blue", margin: "0 5px"}}
            onClick={(): void => handleEditUser(record)}
          />
          {record.role !== "SuperAdmin" && (
            <DeleteOutlined
              style={{color: "red", margin: "0 5px"}}
              onClick={handleDeleteUser}
            />
          )}
        </>
      ),
    },
  ];
  return (
    <div className="container">
      <ModalEditUser
        handleCancelEdit={handleCancelModalEdit}
        handleConfirmEdit={handleConfirmModalEdit}
        isModalVisible={isOpenModalEdit}
        getUserName={userName}
        getFirstName={firstName}
        getLastName={lastName}
      />
      <Input.Search
        style={{width: "30vw"}}
        placeholder="Search Username"
        onChange={(e): void => onChangeTextSearch(e)}
      />
      <Table
        columns={columns}
        dataSource={dataSearch()}
        bordered
        loading={{
          indicator: (
            <div>
              <Spin />
            </div>
          ),
          spinning: loading,
        }}
        className="hover-pointer mt-4"
      />
    </div>
  );
}
