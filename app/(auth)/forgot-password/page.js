"use client";
import { useState, useRef } from "react";
import { App, Flex, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";

import Button from "@/components/Button";

import Title from "../Title";
import Subtitle from "../Subtitle";

import { PATH_LOGIN } from "@/constants/paths";
import api from "@/api";

const Container = styled.div``;

const RecaptchaWrapper = styled.div`
  transform: scale(1.16);
  transform-origin: 0 0;
  height: 90px;
`;

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const recaptchaRef = useRef();
  const { message } = App.useApp();

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

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
      .post("/auth/forgotPassword", {
        vendor_code: values.vendorCode,
        account: values.account,
        recaptchaResponse: recaptchaValue,
      })
      .then(() => {
        message.success("已發送密碼重設信件，請檢查信箱");
        router.push(PATH_LOGIN);
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

  return (
    <Container>
      <Title>忘記密碼</Title>
      <Subtitle>輸入廠商代號與帳號以變更密碼</Subtitle>

      <Form
        form={form}
        initialValues={{
          vendorCode: "",
          account: "",
        }}
        layout="vertical"
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
          <Input size="large" placeholder="請輸入廠商" autoComplete="off" />
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
          <Input size="large" placeholder="請輸入帳號" autoComplete="off" />
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
          <Flex vertical gap={20}>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={isSubmitDisabled || !recaptchaValue}
            >
              確認
            </Button>

            <Button
              style={{ width: "100%" }}
              type="secondary"
              onClick={() => router.push(PATH_LOGIN)}
            >
              取消
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default Page;
