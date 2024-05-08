"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "antd";

import api from "@/api";

import FormLogin from "./FormLogin";
import FormForgotPassword from "./FormForgotPassword";

const Page = () => {
  const router = useRouter();
  const loginForm = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const MODE_LOGIN = "MODE_LOGIN";
  const MODE_FORGOT_PASSWORD = "MODE_FORGOT_PASSWORD";
  const [mode, setMode] = useState(MODE_LOGIN);

  const goToLogin = () => setMode(MODE_LOGIN);
  const goToForgotPassword = () => setMode(MODE_FORGOT_PASSWORD);

  const handleLogin = (values) => {
    console.log("Received values of form: ", values);
    api
      .post("auth/signin", {
        vendorCode: values.vendorCode,
        password: values.password,
        account: values.account,
        token: "123",
        testToken: "9527",
      })
      .then((res) => {
        if (res.code === "200") {
          localStorage.setItem("token", "xxx");
          router.push("/");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  return (
    <>
      {mode === MODE_LOGIN ? (
        <FormLogin
          form={loginForm[0]}
          loading={loading}
          errorMsg={errorMsg}
          goToForgotPassword={goToForgotPassword}
          onFinish={handleLogin}
        />
      ) : (
        <FormForgotPassword goToLogin={goToLogin} />
      )}
    </>
  );
};

export default Page;
