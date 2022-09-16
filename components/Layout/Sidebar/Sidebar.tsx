import React from "react";
import {Menu, Modal} from "antd";
import Image from "next/image";
import {ArrowLeftOutlined} from "@ant-design/icons";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import ApiUser from "../../../api/ApiUser";
import RouteList from "../../../routes/RouteList";
import {logoutUser} from "@app/redux/slices/UserSlice";
import Icon from "@app/components/Icon/Icon";
import {IRootState, persistor} from "@app/redux/store";
import {closeMenu, openMenu} from "@app/redux/slices/MenuSlice";

const RenderMenu = React.memo(() => {
  const router = useRouter();
  const userRole = ApiUser?.getUserRole();

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
      {RouteList.map(({path, name, icon, children, role}) => {
        // if (role?.includes(userRole ?? IAccountRole.ANONYMOUS)) {
        //   return null;
        // }
        if (role) {
          if (children) {
            return (
              <Menu.SubMenu
                key={path}
                title={name}
                icon={<Icon icon={icon as string} size={15} color="#fff" />}
              >
                {children.map((child) => (
                  <Menu.Item
                    key={path + child.path}
                    onClick={(): void => {
                      router.push(path + child.path);
                    }}
                    className="sidebar-item"
                    hidden={child.role !== userRole}
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
              hidden={role !== userRole}
              onClick={(): void => {
                router.push(path);
              }}
            >
              <Icon icon={icon as string} size={40} color="#fff" />
              {name}
            </Menu.Item>
          );
        }
        return (
          <Menu.Item
            key={path}
            className="sidebar-item"
            onClick={(): void => {
              router.push(path);
            }}
          >
            <Icon icon={icon as string} size={40} color="#fff" />
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
  const isOpen = useSelector((state: IRootState) => state.menu.isOpen);
  const dispatch = useDispatch();
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

      {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
      <div
        className={classNames("sidebar", {open: isOpen})}
        onMouseOver={(): void => {
          dispatch(closeMenu());
        }}
        onMouseLeave={(): void => {
          dispatch(openMenu());
        }}
      >
        <div className="logo-container">
          <Image
            src="/img/logo_detail.png"
            width={565}
            height={217}
            alt="logo"
          />
        </div>
        <RenderMenu />
        <div
          className="sidebar-item cursor-pointer"
          role="presentation"
          onClick={handleLogout}
        >
          <ArrowLeftOutlined />
          {!isOpen && <span>Đăng xuất</span>}
        </div>
      </div>
    </>
  );
}
