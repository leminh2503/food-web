import "./index.scss";
import {Formik} from "formik";
import {Form, Image} from "antd";
import {TextInput} from "@app/components/TextInput";
import {ButtonSubmit} from "@app/components/ButtonSubmit";
import {useMutation} from "react-query";
import ApiUser, {ILoginBody} from "@app/api/ApiUser";
import {useDispatch} from "react-redux";
import {loginUser} from "@app/redux/slices/UserSlice";
import {IAccountInfo} from "@app/types";
import {useValidation} from "@app/utils/class-validator";
import LoginValidation from "@app/utils/validation/LoginValidation";

interface SignInProps {
  changeTab: (tab: string) => void;
}
export function SignIn({changeTab}: SignInProps): JSX.Element {
  const dispatch = useDispatch();

  const loginMutation = useMutation(ApiUser.login);

  const [loginValidate] = useValidation(LoginValidation);

  const handleLogin = (
    values: ILoginBody,
    {setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void}
  ): void => {
    if (values.username && values.password) {
      loginMutation.mutate(
        {username: values.username, password: values.password},
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
      initialValues={{username: "", password: ""}}
      validate={loginValidate}
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
                value={values.username}
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
