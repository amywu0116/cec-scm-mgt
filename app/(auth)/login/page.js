"use client";
import React, { useState, useRef } from "react";
import styled from "styled-components";
import { redirect, useRouter } from "next/navigation";
import { Button, Flex, Form, Input, Typography } from "antd";
import ReCAPTCHA from "react-google-recaptcha";

import api from "@/api";
import { PATH_FORGOT_PASSWORD } from "@/constants/paths";

const Container = styled.div`
  .title {
    text-align: center;
  }
`;

const rules = [
  {
    required: true,
    message: "必填",
  },
];

const Page = () => {
  const router = useRouter();
  const form = Form.useForm();
  const recaptchaRef = useRef();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFinish = (values) => {
    console.log("values", values);
    setLoading(true);
    api
      .post("/auth/signin", {
        vendorCode: values.vendorCode,
        password: values.password,
        account: values.account,
        token: recaptchaRef.current.getValue(),
      })
      .then((res) => {
        localStorage.setItem("cec-scm-mgt-accessToken", res.data.accessToken);
        router.push("/");
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  // if (localStorage.getItem("cec-scm-mgt-accessToken")) {
  //   redirect("/");
  // }

  return (
    <Container>
      <Typography.Title className="title" level={1}>
        SCM 線上商城
      </Typography.Title>

      <Typography.Title className="title" level={4}>
        輸入您的帳號與密碼
      </Typography.Title>

      <Form
        form={form[0]}
        initialValues={{
          vendorCode: "K0001",
          account: "admin@syscom.com.tw",
          password: "100200",
        }}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item name="vendorCode" rules={rules}>
          <Input
            size="large"
            placeholder="廠商代號"
            autoComplete="off"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item name="account" rules={rules}>
          <Input
            size="large"
            placeholder="帳號"
            autoComplete="off"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item name="password" rules={rules}>
          <Input.Password size="large" placeholder="密碼" disabled={loading} />
        </Form.Item>

        <Form.Item>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY}
          />
        </Form.Item>

        {errorMsg && (
          <Form.Item>
            <Typography.Text type="danger">{errorMsg}</Typography.Text>
          </Form.Item>
        )}

        <Form.Item style={{ margin: 0 }}>
          <Flex justify="space-between">
            <Button
              size="large"
              type="link"
              disabled={loading}
              onClick={() => router.push(PATH_FORGOT_PASSWORD)}
            >
              忘記密碼
            </Button>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              登入
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default Page;
