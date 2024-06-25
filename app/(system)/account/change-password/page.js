"use client";
import { useState, useEffect } from "react";
import { App, Breadcrumb, Form, Typography } from "antd";
import styled from "styled-components";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import InputPassword from "@/components/Input/InputPassword";

import api from "@/api";
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
  const { message } = App.useApp();

  const user = useBoundStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  const handleFinish = (values) => {
    console.log("values", values);

    if (values.newPassword !== values.newPasswordConfirm) {
      setErrorMsg("新密碼和確認密碼必須一致");
      return;
    }

    api
      .post(
        "/auth/changePassword",
        {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        message.success("修改成功");
      })
      .catch((err) => {
        setErrorMsg(err.message);
      })
      .finally(() => setLoading(false));
  };

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
            name="oldPassword"
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
            name="newPasswordConfirm"
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
