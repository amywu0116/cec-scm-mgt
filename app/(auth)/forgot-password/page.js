"use client";
import { useState, useRef } from "react";
import { Button, Flex, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import ReCAPTCHA from "react-google-recaptcha";

import { PATH_LOGIN } from "@/constants/paths";
import api from "@/api";

const Container = styled.div`
  .title {
    text-align: center;
  }
`;

const Page = () => {
  const router = useRouter();
  const form = Form.useForm();
  const recaptchaRef = useRef();

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = (values) => {
    console.log("values", values);
    setLoading(true);
    api
      .post("/auth/forgotPassword", {
        vendor_code: values.vendorCode,
        account: values.account,
        recaptchaResponse: recaptchaRef.current.getValue(),
      })
      .then(() => router.push(PATH_LOGIN))
      .catch((err) => setErrorMsg(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <Container>
      <Typography.Title className="title" level={1}>
        忘記密碼？
      </Typography.Title>

      <Typography.Title className="title" level={4}>
        輸入廠商代號與帳號以變更密碼
      </Typography.Title>

      <Form
        form={form[0]}
        initialValues={{}}
        layout="vertical"
        preserve={false}
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
          <Input size="large" placeholder="請輸入廠商代號" autoComplete="off" />
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
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              確認
            </Button>

            <Button size="large" onClick={() => router.push(PATH_LOGIN)}>
              取消
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default Page;
