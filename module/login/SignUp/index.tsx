import "./index.scss";
import {Formik} from "formik";
import {Form, Image, notification} from "antd";
import {TextInput} from "@app/components/TextInput";
import {ButtonSubmit} from "@app/components/ButtonSubmit";
import {useMutation} from "react-query";
import ApiUser, {IRegisterBody} from "@app/api/ApiUser";
import {useDispatch} from "react-redux";
import {loginUser} from "@app/redux/slices/UserSlice";
import {IAccountInfo} from "@app/types";

interface SignUpProps {
  changeTab: (tab: string) => void;
}
export function SignUp({changeTab}: SignUpProps): JSX.Element {
  const dispatch = useDispatch();
  const registerMutation = useMutation(ApiUser.register);
  const handleRegister = (
    values: IRegisterBody,
    {setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void}
  ): void => {
    console.log(values);
    if (values.username && values.password) {
      registerMutation.mutate(
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
      validate={(values): void => {
        console.log("test register", values);
        if (!values.username) {
          notification.error({
            message: "Tài khoản và mật khẩu không được để trống!",
          });
        }
      }}
      validateOnChange={false}
      onSubmit={handleRegister}
    >
      {({values, handleChange, isSubmitting, handleSubmit}): JSX.Element => (
        <div className="container-sign-up">
          <Form onFinish={handleSubmit} className="container-sign-up">
            <div className="header-wrapper">
              <Image
                className="sign-up-image"
                src="img/logo.png"
                preview={false}
              />
              <div className="sign-up-text">Đăng ký</div>
            </div>
            <div>
              <TextInput
                label="Tài khoản"
                placeholder="Nhập tài khoản"
                value={values.username}
                handleChange={handleChange}
                name="username"
                type="text"
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

            <ButtonSubmit
              label="Đăng ký"
              isSubmitting={isSubmitting}
              classRow="pt-20"
            />
          </Form>
        </div>
      )}
    </Formik>
  );
}
