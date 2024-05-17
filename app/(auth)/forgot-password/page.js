"use client";
import { useState, useRef } from "react";
import { App, Flex, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";

import Title from "../Title";
import Subtitle from "../Subtitle";
import Button from "@/components/Button";

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

  const [recaptchaValue, setRecaptchaValue] = useState("");

  // 檢查是否表單 Input 都有填
  const isNotAllFieldsFilled = () => {
    return Object.values(form.getFieldsValue()).includes("");
  };

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

  return (
    <Container>
      <Title>忘記密碼</Title>
      <Subtitle>輸入廠商代號與帳號以變更密碼</Subtitle>

      <Form
        form={form}
        initialValues={{
          vendorCode: "K0001",
          account: "edward_hsu@syscom.com.tw",
        }}
        layout="vertical"
        onFinish={handleFinish}
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
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={isNotAllFieldsFilled() || !recaptchaValue}
            >
              確認
            </Button>

            <Button onClick={() => router.push(PATH_LOGIN)}>取消</Button>
          </Flex>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default Page;
