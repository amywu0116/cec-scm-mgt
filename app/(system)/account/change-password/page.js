"use client";
import { useState } from "react";
import { Breadcrumb, Form, Typography } from "antd";
import styled from "styled-components";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import InputPassword from "@/components/Input/InputPassword";

import { useBoundStore } from "@/store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  width: 352px;
`;

const Info = styled.div`
  font-size: 12px;
  font-weight: 400;
  color: rgba(145, 158, 171, 1);
  text-align: right;
`;

const Page = () => {
  const [form] = Form.useForm();

  const user = useBoundStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleFinish = () => {};

  const handleFieldsChange = (changedFields, allFields) => {
    const isFormValid = allFields.every(
      (field) => field.errors.length === 0 && field.value
    );
    setIsSubmitDisabled(!isFormValid);
  };

  console.log("user", user);

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>修改密碼</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "帳戶",
            },
            {
              title: "修改密碼",
            },
          ]}
        />
      </LayoutHeader>

      <Container>
        <Info>
          {user.vendorCode} / {user.vendorName}
        </Info>

        <Form
          form={form}
          layout="vertical"
          initialValues={{ password: "", passwordConfirm: "" }}
          onFinish={handleFinish}
          onFieldsChange={handleFieldsChange}
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
            <InputPassword size="large" placeholder="請輸入密碼" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            rules={[
              {
                required: true,
                message: "必填",
              },
            ]}
          >
            <InputPassword size="large" placeholder="請輸入新密碼" />
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
            <InputPassword size="large" placeholder="請再次輸入新密碼" />
          </Form.Item>

          {errorMsg && (
            <Form.Item>
              <Typography.Text type="danger">{errorMsg}</Typography.Text>
            </Form.Item>
          )}

          <Form.Item style={{ margin: 0 }}>
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
        </Form>
      </Container>
    </>
  );
};

export default Page;
