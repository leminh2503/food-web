import "./index.scss";
import React, {useEffect, useState} from "react";
import {NewPassword} from "@app/module/login/NewPassword";
import {ForgotPassword} from "@app/module/login/ForgotPassword";
import {InputOTP} from "@app/module/login/InputOTP";
import {SignIn} from "@app/module/login/SignIn";

export function Login(): JSX.Element {
  const [data, setData] = useState("")


  const [tab, setTab] = useState("signIn");

  const tabList = {
    signIn: {
      component: SignIn,
    },
    forgotPassword: {
      component: ForgotPassword,
      
    },
    inputOTP: {
      component: InputOTP,
    },
    newPassword: {
      component: NewPassword,
    },
  };


  return (
    <div className="container-login">
      <div className="form-container">
        <div className="form">
          {React.createElement(tabList[tab as keyof typeof tabList].component, {
            changeTab: setTab,
            setData:setData,
            data:data,
            
             })}
        </div>
      </div>
    </div>
  );
}
