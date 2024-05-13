"use client";
import { useRef } from "react";
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

const { Title } = Typography;

const Page = () => {
  const router = useRouter();
  const form = Form.useForm();
  const recaptchaRef = useRef();

  const handleFinish = (values) => {
    console.log("values", values);
    api
      .post("/auth/forgotPassowrd", {
        vendor_code: values.vendorCode,
        account: values.account,
        recaptchaResponse: recaptchaRef.current.getValue(),
      })
      .then((res) => {})
      .catch((err) => console.log(err));
  };

  return (
    <Container>
      <Title className="title" level={1}>
        忘記密碼？
      </Title>

      <Title className="title" level={4}>
        輸入廠商代號與帳號以變更密碼
      </Title>

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

        <Form.Item style={{ margin: 0 }}>
          <Flex justify="space-between">
            <Button size="large" type="primary" htmlType="submit">
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
