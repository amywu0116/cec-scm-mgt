"use client";
import { App, Form, Input, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";

import Subtitle from "../Subtitle";
import Title from "../Title";

import api from "@/api";
import { routes } from "@/routes";

const Container = styled.div`
  width: 350px;
`;

export default function Page() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { message } = App.useApp();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // 表單提交
  const handleFinish = (values) => {
    if (values.password !== values.passwordConfirm) {
      setErrorMsg("密碼輸入不相同");
      return;
    }

    setLoading(true);
    api
      .post("/auth/resetPassword", { token, newPassword: values.password })
      .then(() => {
        message.success("修改成功，請重新登入");
        router.push(routes.login);
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  const handleFieldsChange = (changedFields, allFields) => {
    const isFormValid = allFields.every(
      (field) => field.errors.length === 0 && field.value
    );
    setIsSubmitDisabled(!isFormValid);
  };

  return (
    <Container>
      <Title>密碼設定</Title>
      <Subtitle>輸入新密碼以變更密碼</Subtitle>

      <Form
        form={form}
        layout="vertical"
        initialValues={{ password: "", passwordConfirm: "" }}
        onFinish={handleFinish}
        onFieldsChange={handleFieldsChange}
      >
        <Form.Item
          name="password"
          rules={[{ required: true, message: "必填" }]}
        >
          <Input.Password size="large" placeholder="請輸入新密碼" />
        </Form.Item>

        <Form.Item
          name="passwordConfirm"
          rules={[{ required: true, message: "必填" }]}
        >
          <Input.Password size="large" placeholder="請重複輸入新密碼" />
        </Form.Item>

        {errorMsg && (
          <Form.Item>
            <Typography.Text type="danger">{errorMsg}</Typography.Text>
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            disabled={isSubmitDisabled}
          >
            確認
          </Button>
        </Form.Item>

        <Form.Item>
          <Button block onClick={() => router.push(routes.login)}>
            返回登入頁
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}
