import "./index.scss";
import React from "react";
import {Formik} from "formik";
import {Form, notification} from "antd";
import {TextInput} from "@app/components/TextInput";
import {ButtonSubmit} from "@app/components/ButtonSubmit";
import {useMutation} from "react-query";
import ApiUser, {IForgotPassword} from "@app/api/ApiUser";

import {LeftOutlined} from "@ant-design/icons";

interface SignInProps {
  changeTab: (tab: string) => void;
  setData: (data: string) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  data: string;
}

export function ForgotPassword({changeTab, setData}: SignInProps): JSX.Element {
  // const [data, setData] = useState<IForgotPassword>(
  //   {
  //     email:"",
  //   }
  // )

  const forgotPassMutation = useMutation(ApiUser.forgotPassword);

  const handleForgotPassword = (
    values: IForgotPassword,
    {setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void}
  ): void => {
    forgotPassMutation.mutate(
      {
        email: values.email,
      },
      {
        onSuccess: () => {
          setData(values.email);
          changeTab("inputOTP");
          setSubmitting(false);
        },
        onError: (error) => {
          setSubmitting(false);
        },
      }
    );
  };
  return (
    <Formik
      initialValues={{email: ""}}
      validate={(values) => {
        if (!values.email) {
          notification.error({
            message: "Chưa nhập email",
          });
        }
      }}
      validateOnChange={false}
      validateOnBlur
      // validate={loginValidation}
      onSubmit={handleForgotPassword}
    >
      {({
        values,
        handleChange,
        handleBlur,
        isSubmitting,
        handleSubmit,
      }): JSX.Element => (
        <div className="container-sign-in">
          <button
            type="button"
            className="btn-back-page"
            onClick={(): void => changeTab("signIn")}
          >
            <LeftOutlined />
          </button>
          <Form onFinish={handleSubmit} className="container-sign-in">
            <div className="header-wrapper">
              <div className="login-text">QUÊN MẬT KHẨU</div>
            </div>
            <div>
              <TextInput
                placeholder="Nhập email"
                label="Email"
                value={values.email}
                handleBlur={handleBlur}
                handleChange={handleChange}
                name="email"
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
