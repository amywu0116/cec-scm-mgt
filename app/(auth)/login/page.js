"use client";
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { redirect, useRouter } from "next/navigation";
import { Form, Input, Typography } from "antd";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";

import Button from "@/components/Button";

import Title from "../Title";
import Subtitle from "../Subtitle";

import api from "@/api";
import { PATH_FORGOT_PASSWORD } from "@/constants/paths";

import { useBoundStore } from "@/store";

const Container = styled.div``;

const RecaptchaWrapper = styled.div`
  transform: scale(1.16);
  transform-origin: 0 0;
  height: 90px;
`;

const ForgotPasswordLink = styled(Link)`
  color: #212b36;
  text-decoration: underline;
  text-align: right;
`;

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();

  const recaptchaRef = useRef();

  const updateUser = useBoundStore((state) => state.updateUser);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [recaptchaValue, setRecaptchaValue] = useState("");

  // 重置 recaptcha
  const resetRecaptcha = () => {
    recaptchaRef.current.reset();
    setRecaptchaValue("");
  };

  // 表單提交
  const handleFinish = (values) => {
    setLoading(true);
    api
      .post("/auth/signin", {
        vendorCode: values.vendorCode,
        password: values.password,
        account: values.account,
        token: recaptchaValue,
      })
      .then((res) => {
        localStorage.setItem("cec-scm-mgt-accessToken", res.data.accessToken);
        updateUser(res.data);
        router.push("/");
      })
      .catch((err) => {
        setErrorMsg(err.message);
        resetRecaptcha();
      })
      .finally(() => setLoading(false));
  };

  // 勾選 recaptcha
  const handleChangeRecaptcha = (value) => {
    setRecaptchaValue(value);
  };

  const handleFieldsChange = (changedFields, allFields) => {
    const isFormValid = allFields.every(
      (field) => field.errors.length === 0 && field.value
    );
    setIsSubmitDisabled(!isFormValid);
  };

  // if (localStorage.getItem("cec-scm-mgt-accessToken")) {
  //   redirect("/");
  // }

  return (
    <Container>
      <Title>歡迎，供應商管理系統！</Title>
      <Subtitle>請輸入您的帳號密碼</Subtitle>

      <Form
        form={form}
        initialValues={{
          vendorCode: "",
          account: "",
          password: "",
        }}
        layout="vertical"
        disabled={loading}
        onFinish={handleFinish}
        onFieldsChange={handleFieldsChange}
      >
        <Form.Item
          name="vendorCode"
          rules={[
            {
              required: true,
              message: "必填",
            },
          ]}
        >
          <Input size="large" placeholder="廠商代號" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="account"
          rules={[
            {
              required: true,
              message: "必填",
            },
          ]}
        >
          <Input size="large" placeholder="帳號" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "必填",
            },
          ]}
        >
          <Input.Password size="large" placeholder="密碼" />
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <ForgotPasswordLink href={PATH_FORGOT_PASSWORD}>
            忘記密碼
          </ForgotPasswordLink>
        </Form.Item>

        <Form.Item>
          <RecaptchaWrapper>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY}
              onChange={handleChangeRecaptcha}
            />
          </RecaptchaWrapper>
        </Form.Item>

        {errorMsg && (
          <Form.Item>
            <Typography.Text type="danger">{errorMsg}</Typography.Text>
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            block
            htmlType="submit"
            loading={loading}
            disabled={isSubmitDisabled || !recaptchaValue}
          >
            登入
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default Page;
