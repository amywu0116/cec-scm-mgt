"use client";
import { useState } from "react";
import { Button, Flex, Form, Input, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

import api from "@/api";
import { PATH_LOGIN } from "@/constants/paths";

const Container = styled.div`
  .title {
    text-align: center;
  }
`;

const Page = () => {
  const form = Form.useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [errorMsg, setErrorMsg] = useState("");

  const handleFinish = (values) => {
    if (values.password !== values.passwordConfirm) {
      setErrorMsg("密碼輸入不相同");
      return;
    }

    api
      .post("/auth/resetPassword", { token, newPassword: values.password })
      .then(() => router.push(PATH_LOGIN))
      .catch((err) => setErrorMsg(err.message));
  };

  return (
    <Container>
      <Typography.Title className="title" level={1}>
        密碼設定
      </Typography.Title>

      <Form
        form={form[0]}
        layout="vertical"
        preserve={false}
        onFinish={handleFinish}
      >
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "必填",
            },
          ]}
        >
          <Input.Password size="large" placeholder="請輸入新密碼" />
        </Form.Item>

        <Form.Item
          name="passwordConfirm"
          rules={[
            {
              required: true,
              message: "必填",
            },
          ]}
        >
          <Input.Password size="large" placeholder="請重複輸入新密碼" />
        </Form.Item>

        {errorMsg && (
          <Form.Item>
            <Typography.Text type="danger">{errorMsg}</Typography.Text>
          </Form.Item>
        )}

        <Form.Item style={{ margin: 0 }}>
          <Flex justify="space-between">
            <Button size="large" type="primary" htmlType="submit">
              確認
            </Button>

            <Button size="large" onClick={() => {}}>
              取消
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default Page;
