"use client";
import { Button, Flex, Form, Input, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import styled from "styled-components";

const Container = styled.div`
  .title {
    text-align: center;
  }
`;

const { Text, Title } = Typography;

const Page = () => {
  const form = Form.useForm();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  return (
    <Container>
      <Title className="title" level={1}>
        密碼設定
      </Title>

      <Form
        form={form[0]}
        initialValues={{}}
        layout="vertical"
        preserve={false}
        onFinish={() => {}}
      >
        <Form.Item
          name="password1"
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
          name="password2"
          rules={[
            {
              required: true,
              message: "必填",
            },
          ]}
        >
          <Input.Password size="large" placeholder="請重複輸入新密碼" />
        </Form.Item>

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
