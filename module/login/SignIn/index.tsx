import "./index.scss";
import {Formik} from "formik";
import {Form, Image, notification} from "antd";
import {TextInput} from "@app/components/TextInput";
import {ButtonSubmit} from "@app/components/ButtonSubmit";
import {useMutation} from "react-query";
import ApiUser, {ILoginBody} from "@app/api/ApiUser";
import {useDispatch} from "react-redux";
import {loginUser} from "@app/redux/slices/UserSlice";
import {IAccountInfo} from "@app/types";

interface SignInProps {
  changeTab: (tab: string) => void;
}
export function SignIn({changeTab}: SignInProps): JSX.Element {
  const dispatch = useDispatch();
  const loginMutation = useMutation(ApiUser.login);

  const handleLogin = (
    values: ILoginBody,
    {setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void}
  ): void => {
    if (values.email && values.password) {
      loginMutation.mutate(
        {email: values.email, password: values.password},
        {
          onSuccess: (res: IAccountInfo) => {
            dispatch(loginUser({...res}));
            localStorage.setItem("role", res.role?.id?.toString() || "0");
            setSubmitting(false);
            window.location.replace("/");
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
      initialValues={{email: "", password: ""}}
      validate={(values): void => {
        if (!values.email) {
          notification.error({
            message: "Tài khoản và mật khẩu không được để trống!",
          });
        }
      }}
      validateOnChange={false}
      onSubmit={handleLogin}
    >
      {({values, handleChange, isSubmitting, handleSubmit}): JSX.Element => (
        <div className="container-sign-in">
          <Form onFinish={handleSubmit} className="container-sign-in">
            <div className="header-wrapper">
              <Image
                className="login-image"
                src="img/logo.png"
                preview={false}
              />
              <div className="login-text">Đăng nhập</div>
            </div>
            <div>
              <TextInput
                placeholder="Nhập tài khoản"
                label="Tài khoản"
                value={values.email}
                handleChange={handleChange}
                name="email"
              />
            </div>
            <div className="pt-20">
              <TextInput
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                value={values.password}
                handleChange={handleChange}
                name="password"
                type="password"
              />
            </div>
            <div className="flex justify-end">
              <span
                role="button"
                tabIndex={0}
                className="forgot-pass pt-20"
                onClick={(): void => changeTab("forgotPassword")}
              >
                Quên mật khẩu?
              </span>
            </div>

            <ButtonSubmit
              label="Đăng nhập"
              isSubmitting={isSubmitting}
              classRow="pt-20"
            />
          </Form>
        </div>
      )}
    </Formik>
  );
}
