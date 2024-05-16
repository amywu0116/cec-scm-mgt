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
  const [isNotFilledAll, setIsNotFilledAll] = useState(true);

  const validateFields = () => {
    const formValues = form.getFieldsValue();
    const isFailed =
      Object.values(formValues).includes("") ||
      !recaptchaRef.current.getValue();
    setIsNotFilledAll(isFailed);
  };

  const handleFinish = (values) => {
    setLoading(true);
    api
      .post("/auth/forgotPassword", {
        vendor_code: values.vendorCode,
        account: values.account,
        recaptchaResponse: recaptchaRef.current.getValue(),
      })
      .then(() => {
        message.success("已發送密碼重設信件，請檢查信箱");
      })
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  const handleChangeRecaptcha = () => {
    validateFields();
  };

  return (
    <Container>
      <Title>忘記密碼</Title>
      <Subtitle>輸入廠商代號與帳號以變更密碼</Subtitle>

      <Form
        form={form}
        initialValues={{ vendorCode: "", account: "" }}
        layout="vertical"
        onFinish={handleFinish}
        onValuesChange={() => validateFields()}
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
              disabled={isNotFilledAll}
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
