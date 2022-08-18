import React from "react";
import {Menu, Modal} from "antd";
import Image from "next/image";
import {ArrowLeftOutlined} from "@ant-design/icons";
import classNames from "classnames";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import ApiUser from "../../../api/ApiUser";
import RouteList from "../../../routes/RouteList";
import {logoutUser} from "@app/redux/slices/UserSlice";
import {IAccountRole} from "@app/types";

const RenderMenu = React.memo(() => {
  const router = useRouter();
  const userRole = ApiUser.getUserRole();

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     dispatch(closeMenu());
  //   }, 50);
  //   const ele = document.querySelector(".sidebar .ant-menu-item-selected");
  //   if (ele) {
  //     ele.scrollIntoView({block: "center", inline: "nearest"});
  //   }
  // }, [router]);

  return (
    <Menu
      mode="inline"
      theme="dark"
      defaultSelectedKeys={[router.pathname]}
      defaultOpenKeys={["/" + router.pathname.split("/")[1]]}
    >
      {RouteList.map(({path, name, children, role}) => {
        // if (role?.includes(userRole ?? IAccountRole.ANONYMOUS)) {
        //   return null;
        // }
        if (children) {
          return (
            <Menu.SubMenu key={path} title={name}>
              {children.map((child) => (
                <Menu.Item
                  key={path + child.path}
                  onClick={(): void => {
                    router.push(path + child.path);
                  }}
                  className="sidebar-item"
                  hidden={child.role?.includes(
                    userRole ?? IAccountRole.ANONYMOUS
                  )}
                >
                  {child.name}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          );
        }
        return (
          <Menu.Item
            key={path}
            className="sidebar-item"
            hidden={role && userRole ? !role?.includes(userRole) : undefined}
            onClick={(): void => {
              router.push(path);
            }}
          >
            {name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
});
RenderMenu.displayName = "RenderMenu";

/**
 *
 */
export default function Sidebar(): JSX.Element {
  // const isOpen = useSelector((state: IRootState) => state.menu.isOpen);
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    Modal.confirm({
      title: "Đăng xuất",
      content: "Bạn có chắc chắn?",
      onOk: () => {
        // dispatch(UserAction.userLogout())
        dispatch(logoutUser());
      },
    });
  };

  return (
    <>
      {/* Sidebar overlay. Only work with screen < 768px */}

      {/* <div */}

      {/*  role="presentation" */}

      {/*  className={classNames("sidebar-overlay", {open: isOpen})} */}

      {/*  onClick={(): void => { */}

      {/*    dispatch(toggleMenu()); */}

      {/*  }} */}

      {/* /> */}

      {/* Sidebar */}

      <div className={classNames("sidebar")}>
        <div className="logo-container">
          <Image src="/img/logo/logo.png" alt="logo" width={20} height={20} />
        </div>
        <RenderMenu />
        <div
          className="sidebar-item cursor-pointer"
          role="presentation"
          onClick={handleLogout}
        >
          <ArrowLeftOutlined />
          <span>Đăng xuất</span>
        </div>
      </div>
    </>
  );
}
