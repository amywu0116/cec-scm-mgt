import { Button, Flex, Form, Input, Typography } from "antd";
import styled from "styled-components";

const Container = styled.div`
  .title {
    text-align: center;
  }
`;

const BtnGroup = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px 0;
`;

const { Text, Title } = Typography;

const FormLogin = (props) => {
  const { errorMsg, form, loading, goToForgotPassword, onFinish } = props;

  return (
    <Container>
      <Title className="title" level={1}>
        SCM 線上商城
      </Title>

      <Title className="title" level={4}>
        輸入您的帳號與密碼
      </Title>

      <Form
        form={form}
        initialValues={{
          vendorCode: "K0001",
          account: "admin@syscom.com.tw",
          password: "100200",
        }}
        layout="vertical"
        preserve={false}
        onFinish={onFinish}
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
          <Input
            size="large"
            placeholder="廠商代號"
            autoComplete="off"
            disabled={loading}
          />
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
          <Input
            size="large"
            placeholder="帳號"
            autoComplete="off"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "必填",
            },
          ]}
        >
          <Input.Password size="large" placeholder="密碼" disabled={loading} />
        </Form.Item>

        <Text type="danger">{errorMsg}</Text>

        <Form.Item style={{ margin: 0 }}>
          <Flex justify="space-between">
            <Button
              size="large"
              type="link"
              disabled={loading}
              onClick={goToForgotPassword}
            >
              忘記密碼
            </Button>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              登入
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default FormLogin;
