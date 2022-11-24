import React, {useEffect, useState} from "react";
import {MenuOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {IRootState, persistor} from "@app/redux/store";
import {editAcountMe, loginUser, logoutUser} from "@app/redux/slices/UserSlice";
import {toggleMenu} from "@app/redux/slices/MenuSlice";
import {useMutation, useQuery} from "react-query";
import {IEditUser, IGetUsers} from "@app/types";
import ApiUser from "@app/api/ApiUser";
import {Dropdown, Image, Menu, Modal, notification} from "antd";
import Icon from "@app/components/Icon/Icon";
import {queryKeys} from "@app/utils/constants/react-query";
import {useRouter} from "next/router";
import {ModalChangePassword} from "@app/module/users/ChangePassword/ModalChangePassword";
import "./Navbar.scss";
import {ModalEditUser} from "@app/module/users/EditUser";

export default function Navbar(): JSX.Element {
  const [toggleModalChangePass, setToggleModalChangePass] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const user = useSelector((state: IRootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const getMeData = (): Promise<IGetUsers> => {
    return ApiUser.getMe();
  };
  const dataUser = useQuery(queryKeys.GET_DATA_USER_IN_USE, getMeData);
  useEffect(() => {
    dataUser.refetch().then((data) => {
      dispatch(loginUser({...user, user: data?.data}));
    });
  }, [toggleModalChangePass, isOpenModalEdit]);
  const handleLogout = (): void => {
    Modal.confirm({
      title: "Đăng xuất",
      content: "Bạn có chắc chắn đăng xuất?",
      onOk: () => {
        persistor
          .purge()
          .then(() => {
            dispatch(logoutUser());
          })
          .catch(() => {
            // eslint-disable-next-line no-alert
            window.alert(
              "Trình duyệt bị lỗi. Xóa Cookie trình duyệt và thử lại"
            );
          });
        router.push("/");
      },
    });
  };
  const {mutate} = useMutation({
    mutationFn: (body: IEditUser) => {
      return ApiUser.setMeDataAcount(body);
    },
  });
  const handleConfirmModalEdit = (values: IEditUser): void => {
    console.log(values);
    if (values.firstName || values.lastName) {
      mutate(values, {
        onSuccess: (res: IGetUsers) => {
          dispatch(editAcountMe({...values}));
          notification.success({
            message: "Cập nhật thông tin thành công !",
          });
          setIsOpenModalEdit(false);
        },
        onError: (error) => {
          setIsOpenModalEdit(false);
        },
      });
    } else {
      setIsOpenModalEdit(false);
    }
  };
  const handleCancelModalEdit = (): void => {
    setIsOpenModalEdit(false);
  };
  const handleSetEditUser = (): void => {
    setIsOpenModalEdit(true);
    setFirstName(dataUser.data?.firstName as string);
    setLastName(dataUser.data?.lastName as string);
    setUserName(dataUser.data?.username as string);
  };
  const handleCancelModalChangePass = (): void => {
    setToggleModalChangePass(!toggleModalChangePass);
  };

  const renderDropdown = (): JSX.Element => (
    <Menu className="mr-2">
      <ModalChangePassword
        isModalVisible={toggleModalChangePass}
        handleCancel={handleCancelModalChangePass}
      />
      <ModalEditUser
        handleConfirmEdit={handleConfirmModalEdit}
        handleCancelEdit={handleCancelModalEdit}
        isModalVisible={isOpenModalEdit}
        getUserName={userName}
        getFirstName={firstName}
        getLastName={lastName}
      />
      <Menu.Item key="0" onClick={(): void => handleSetEditUser()}>
        <div>
          <Icon icon="User" size={20} color="#000" className="mr-2" />
          Thay đổi thông tin
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={(): void => handleCancelModalChangePass()}>
        <div>
          <Icon icon="BlockUser" size={20} color="#000" className="mr-2" />
          Đổi mật khẩu
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="2" onClick={(): void => handleLogout()}>
        <div>
          <Icon icon="SignOut" size={20} color="#000" className="mr-2" />
          Đăng xuất
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar flex items-center justify-between">
      <div className="flex items-center">
        <MenuOutlined
          onClick={(): void => {
            dispatch(toggleMenu());
          }}
        />
      </div>
      <div className="group-user-info">
        <Dropdown overlay={renderDropdown()} trigger={["click"]}>
          <div className="cursor-pointer flex items-center">
            <Image
              src={dataUser?.data?.avatar || "/img/avatar/avatar.jpg"}
              preview={false}
              width={30}
              height={30}
              fallback="/img/avatar/avatar.jpg"
              className="rounded-full"
              alt="avatar"
            />
            <span className="ml-2 mr-2 fa-w-3 hidden md:flex">
              {dataUser.data &&
                dataUser.data.firstName +
                  " " +
                  dataUser.data.lastName +
                  " (" +
                  dataUser.data.username +
                  ")"}
            </span>
            <Icon icon="ArrowDown" size={20} color="#000" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
