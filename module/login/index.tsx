import "./index.scss";
import React, {useState} from "react";
import {NewPassword} from "@app/module/login/NewPassword";
import {ForgotPassword} from "@app/module/login/ForgotPassword";
import {SignIn} from "@app/module/login/SignIn";
import {SignUp} from "@app/module/login/SignUp";

export function Login(): JSX.Element {
  const [data, setData] = useState("");

  const [tab, setTab] = useState("signIn");

  const tabList = {
    signIn: {
      component: SignIn,
    },
    signUp: {
      component: SignUp,
    },
    forgotPassword: {
      component: ForgotPassword,
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
            setData: setData,
            data: data,
          })}
        </div>
      </div>
    </div>
  );
}
