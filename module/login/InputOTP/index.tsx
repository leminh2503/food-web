import "./index.scss";

import React, {useState} from "react";
import {Formik} from "formik";
import {Form, Image, Row, Input, notification, Descriptions} from "antd";
import {TextInput} from "@app/components/TextInput";
import {ButtonSubmit} from "@app/components/ButtonSubmit";
import {useMutation} from "react-query";
import ApiUser, {ISetPassword} from "@app/api/ApiUser";
import {useDispatch} from "react-redux";
import {loginUser} from "@app/redux/slices/UserSlice";
import {useRouter} from "next/router";
import { useContext } from "react";
import {LeftOutlined} from "@ant-design/icons";
import { values } from "lodash";
import { validate } from "class-validator";

interface SignInProps {
  changeTab: (tab: string) => void;
  data:string

}



export function InputOTP({changeTab,data}: SignInProps): JSX.Element {

  // const [data, setData] = useState<IForgotPassword>(
  //   {
  //     email:"",
  //   }
  // )
  const confirmPassword ="";
  const dispatch = useDispatch();

  const router = useRouter();
  const [pass,getPass] =useState(false)
  const setPassMutation = useMutation(ApiUser.setPassword);
 
  
  const handleForgotPassword = (
    values :ISetPassword,
    {setSubmitting}: {setSubmitting: (isSubmitting: boolean) => void}
    ):void =>{
    
   
      setPassMutation.mutate(
        {
          email:data,
          otp:values.otp,
          newPassword:values.newPassword,
          
        },
        {
          onSuccess: () => {
            changeTab("signIn")
            setSubmitting(false);
          },
          onError: (error) => {
            setSubmitting(false);
          },
        }
      )
  
       
   
    
    
    
    
    
  }
  return (
    <Formik
      initialValues={{email: "",otp: "", newPassword: "", confirmPassword:""}}
      
      validate={values => {

        if (!values.otp||!values.newPassword||!values.confirmPassword) {
          
          notification.error({
            message:"Chưa nhập đủ trường"
            
          })
        }else if(values.newPassword!==values.confirmPassword)
        {
          notification.error({
            message:"Mật khẩu nhập lại chưa đúng"
            
          })
        }else(
          getPass(true)
        )

  
      }}
      validateOnChange={false}
      validateOnBlur={false}
     
      
      onSubmit={
        handleForgotPassword
        
      }
    >
      {({
        
        values,
        handleChange,
        handleBlur,
        isSubmitting,
        handleSubmit,
      }): JSX.Element => (
        
        
        <div className="container-sign-in">
          <button type="button" className="btn-back-page" onClick={(): void => changeTab("signIn")}>
            <LeftOutlined />
          </button>
          <Form onFinish={handleSubmit} className="container-sign-in">
            <div className="header-wrapper">

              <div className="login-text">MẬT KHẨU MỚI</div>
            </div>
            <div>
              <div className="mb-5">
              <TextInput 
                label="Mật khẩu mới"
                placeholder="Nhập mật khẩu mới"
                value={values.newPassword}
                handleChange={handleChange}
                handleBlur={handleBlur}
                name="newPassword"
                type="password"
              />
              </div>
              
              <div className="mb-5">
              <TextInput
                label="Xác nhận mật khẩu"
                placeholder="Xác nhận mật khẩu"
                value={values.confirmPassword}
                handleChange={handleChange}
                handleBlur={handleBlur}
                name="confirmPassword"
                type="password"
              />
              </div>
              
              <TextInput
                placeholder="Nhập mã OTP"
                label="Mã OTP"
                value={values.otp}
                handleBlur={handleBlur}
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
      )
      
      }
      
    </Formik>
    
  );
}


