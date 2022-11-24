import React, {useState} from "react";
import {logoutUser} from "@app/redux/slices/UserSlice";
import {Form, Modal, notification} from "antd";
import ApiUser, {IChangePassword} from "@app/api/ApiChangePassword";
import {useRouter} from "next/router";
import {Formik} from "formik";

import {useMutation} from "react-query";
import {InputPassword} from "@app/components/InputPassword";
import {useDispatch} from "react-redux";

interface ModalChangePassword {
  handleCancel: () => void;
  isModalVisible: boolean;
}

export function ModalChangePassword({
  isModalVisible,
  handleCancel,
}: ModalChangePassword): JSX.Element {
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    newPasswordAgain: "",
  });

  const dispatch = useDispatch();

  const router = useRouter();

  const changePasswordMutation = useMutation(ApiUser.changePassword);

  const handleOk = (values: any) => {
    if (!data.oldPassword) {
      notification.error({
        message: `Chưa nhập mật khẩu cũ`,
      });
    } else if (!data.newPassword) {
      notification.error({
        message: `Chưa nhập mật khẩu mới`,
      });
    } else if (!data.newPasswordAgain) {
      notification.error({
        message: `Chưa nhập lại mật khẩu`,
      });
    } else if (data.newPasswordAgain !== data.newPassword) {
      notification.error({
        message: `Mật khẩu nhập lại sai`,
      });
    } else if (data.oldPassword === data.newPassword) {
      notification.error({
        message: `Mật khẩu mới trùng với mật khẩu cũ`,
      });
    } else {
      HandleSubmit(values);
    }
  };
  const HandleSubmit = (values: IChangePassword): void => {
    changePasswordMutation.mutate(
      {
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          notification.success({
            message: "Đổi mật khẩu thành công",
          });
          dispatch(logoutUser());
          router.push("/login");
        },
        onError: (error) => {
          notification.error({
            message:
              "Mật khẩu phải có ít nhất 6 ký tự chứa 1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt",
          });
        },
      }
    );
  };

  return (
    <Formik
      initialValues={{newPassword: "", oldPassword: ""}}
      validateOnChange={false}
      validateOnBlur
      onSubmit={HandleSubmit}
    >
      {({
        values,
        handleChange,

        handleBlur,
        isSubmitting,
        handleSubmit,
      }): JSX.Element => {
        const handleChangePass = (e: any) => {
          setData({...data, [e.target.name]: e.target.value});
        };
        data.newPassword = values.newPassword;

        return (
          <Form onFinish={handleSubmit}>
            <div className="modal-ant">
              <Modal
                title="Đổi mật khẩu"
                open={isModalVisible}
                onOk={(): void => {
                  handleOk(values);
                }}
                onCancel={handleCancel}
                okText="Xác nhận"
                cancelText="Huỷ"
                className="w-35x "
              >
                <InputPassword
                  label="Mật khẩu cũ:"
                  handleBlur={handleBlur}
                  handleChange={handleChangePass}
                  name="oldPassword"
                  type="password"
                />

                <InputPassword
                  label="Mật khẩu mới:"
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  name="newPassword"
                  type="password"
                />

                <InputPassword
                  label="Nhập lại mật khẩu mới:"
                  handleBlur={handleBlur}
                  handleChange={handleChangePass}
                  name="newPasswordAgain"
                  type="password"
                />
              </Modal>
            </div>

            {/* <Button onClick={()=>{handleSubmitUpdate(values,true)}}>dsdsds</Button> */}
          </Form>
        );
      }}
    </Formik>
  );
}
