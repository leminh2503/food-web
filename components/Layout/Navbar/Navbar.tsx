import React, {useEffect} from "react";
import {MenuOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {IRootState, persistor} from "@app/redux/store";
import {loginUser, logoutUser} from "@app/redux/slices/UserSlice";
import {toggleMenu} from "@app/redux/slices/MenuSlice";
import {useQuery} from "react-query";
import {IUserLogin} from "@app/types";
import ApiUser from "@app/api/ApiUser";
import {Dropdown, Image, Menu, Modal} from "antd";
import Link from "next/link";
import Icon from "@app/components/Icon/Icon";
import {queryKeys} from "@app/utils/constants/react-query";

/**
 *
 */
export default function Navbar(): JSX.Element {
  const user = useSelector((state: IRootState) => state.user);

  const dispatch = useDispatch();

  const getMeData = (): Promise<IUserLogin> => {
    return ApiUser.getMe();
  };

  const dataUser = useQuery(queryKeys.GET_DATA_USER_IN_USE, getMeData);

  useEffect(() => {
    dataUser.refetch().then((data) => {
      dispatch(loginUser({...user, user: data?.data}));
    });
  }, []);

  const handleLogout = (): void => {
    Modal.confirm({
      title: "Đăng xuất",
      content: "Bạn có chắc chắn?",
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
        window.location.reload();
      },
    });
  };
  /**
   *
   * @returns {*}
   */
  const renderDropdown = (): JSX.Element => (
    <Menu>
      <Menu.Item key="0">
        <Link href="/user/home" passHref>
          <div>
            <Icon icon="BlockUser" size={20} color="#000" className="mr-2" />
            Đổi mật khẩu
          </div>
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={handleLogout}>
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
              src={dataUser?.data?.avatar}
              preview={false}
              width={30}
              height={30}
              fallback="/img/avatar/avatar.jpg"
              className="rounded-full"
              alt="avatar"
            />
            <span className="ml-2 hidden md:flex">
              {dataUser?.data?.fullName}
            </span>
            <Icon icon="ArrowDown" size={20} color="#000" />
          </div>
        </Dropdown>
      </div>
    </div>
  );
}
