import "./index.scss";
import React from "react";
import {Formik} from "formik";
import {Form, notification} from "antd";
import {TextInput} from "@app/components/TextInput";
import {ButtonSubmit} from "@app/components/ButtonSubmit";
import {useMutation} from "react-query";
import ApiUser, {ISetPassword} from "@app/api/ApiUser";
import {LeftOutlined} from "@ant-design/icons";

interface SignInProps {
  changeTab: (tab: string) => void;
  data: string;
}

export function NewPassword({changeTab, data}: SignInProps): JSX.Element {
  const setPassword = useMutation(ApiUser.setPassword);
  const handleSetPassword = (
    values: ISetPassword,
    {setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void}
  ): void => {
    const regex = /^[0-9]{6,6}$/g;
    if (
      values.newPassword &&
      regex.test(values.otp) &&
      values.newPassword === values.confirmPass
    ) {
      setPassword.mutate(
        {
          email: data,
          newPassword: values.newPassword,
          confirmPass: values.confirmPass,
          otp: values.otp,
        },
        {
          onSuccess: () => {
            changeTab("signIn");
            setSubmitting(false);
            notification.success({
              duration: 1,
              message: "Đổi mật khẩu thành công!",
            });
          },
          onError: (error) => {
            setSubmitting(false);
          },
        }
      );
    } else {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{newPassword: "", confirmPass: "", otp: "", email: data}}
      validate={(values) => {
        if (!values.newPassword || !values.confirmPass || !values.otp) {
          notification.error({
            message:
              "Mật khẩu mới, Xác nhận mật khẩu, OTP không được để trống!",
          });
          return;
        }
        if (values.newPassword !== values.confirmPass) {
          notification.error({
            message: "Mật khẩu mới và Xác nhận mật khẩu không trùng nhau!",
          });
          return;
        }
        const regex = /^[0-9]{6,6}$/g;
        if (!regex.test(values.otp)) {
          notification.error({
            message: "OTP phải là số nguyên 6 ký tự!",
          });
        }
      }}
      validateOnChange={false}
      onSubmit={handleSetPassword}
    >
      {({values, handleChange, isSubmitting, handleSubmit}): JSX.Element => (
        <div className="container-sign-in">
          <button
            type="button"
            className="btn-back-page"
            onClick={(): void => changeTab("forgotPassword")}
          >
            <LeftOutlined />
          </button>
          <Form onFinish={handleSubmit} className="container-sign-in">
            <div className="header-wrapper">
              <div className="login-text">NHẬP MẬT KHẨU MỚI</div>
            </div>
            <div className="mb-5">
              <TextInput
                placeholder="Nhập mật khẩu mới"
                label="Mật khẩu mới"
                value={values.newPassword}
                handleChange={handleChange}
                name="newPassword"
                type="password"
              />
            </div>
            <div className="mb-5">
              <TextInput
                placeholder="Xác nhận mật khẩu"
                label="Xác nhận mật khẩu"
                value={values.confirmPass}
                handleChange={handleChange}
                name="confirmPass"
                type="password"
              />
            </div>
            <div>
              <TextInput
                placeholder="Nhập OTP"
                label="OTP"
                value={values.otp}
                handleChange={handleChange}
                name="otp"
              />
            </div>
            <ButtonSubmit
              label="Xác nhận"
              isSubmitting={isSubmitting}
              classRow="pt-20"
            />
          </Form>
        </div>
      )}
    </Formik>
  );
}
