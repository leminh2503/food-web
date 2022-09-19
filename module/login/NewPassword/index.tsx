import "./index.scss";
import React from "react";
import {Formik} from "formik";
import {Form} from "antd";
import {TextInput} from "@app/components/TextInput";
import {ButtonSubmit} from "@app/components/ButtonSubmit";
import {useMutation} from "react-query";
import ApiUser, {IForgotPassword} from "@app/api/ApiUser";

import {LeftOutlined} from "@ant-design/icons";

interface SignInProps {
  changeTab: (tab: string) => void;
}

export function NewPassword({changeTab}: SignInProps): JSX.Element {
  // const [data, setData] = useState<IForgotPassword>(
  //   {
  //     email:"",
  //   }
  // )

  const forgotPassMutation = useMutation(ApiUser.forgotPassword);

  const handleForgotPassword = (values: IForgotPassword): void => {
    forgotPassMutation.mutate({
      email: values.email,
    });
    changeTab("signIn");
  };
  return (
    <Formik
      initialValues={{email: "", password: ""}}
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
            onClick={(): void => changeTab("inputOTP")}
          >
            <LeftOutlined />
          </button>
          <Form onFinish={handleSubmit} className="container-sign-in">
            <div className="header-wrapper">
              <div className="login-text">NHẬP MẬT KHẨU MỚI</div>
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
