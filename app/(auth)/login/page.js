"use client";
import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { Button, Flex, Form, Input, Typography } from "antd";

import api from "@/api";
import { PATH_FORGOT_PASSWORD } from "@/constants/paths";

const Container = styled.div`
  .title {
    text-align: center;
  }
`;

const { Text, Title } = Typography;

const rules = [
  {
    required: true,
    message: "必填",
  },
];

const Page = () => {
  const router = useRouter();
  const form = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (values) => {
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
          // localStorage.setItem("token", "xxx");
          router.push("/");
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  return (
    <Container>
      <Title className="title" level={1}>
        SCM 線上商城
      </Title>

      <Title className="title" level={4}>
        輸入您的帳號與密碼
      </Title>

      <Form
        form={form[0]}
        initialValues={{
          vendorCode: "K0001",
          account: "admin@syscom.com.tw",
          password: "100200",
        }}
        layout="vertical"
        onFinish={handleLogin}
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

        <Text type="danger">{errorMsg}</Text>

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
