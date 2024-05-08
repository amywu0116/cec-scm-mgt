import { Button, Flex, Form, Input, Typography } from "antd";
import styled from "styled-components";

const Container = styled.div`
  .title {
    text-align: center;
  }
`;

const { Text, Title } = Typography;

const FormForgotPassword = (props) => {
  const { goToLogin } = props;
  const form = Form.useForm();

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
        onFinish={() => {}}
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

        <Form.Item style={{ margin: 0 }}>
          <Flex justify="space-between">
            <Button size="large" type="primary" htmlType="submit">
              確認
            </Button>

            <Button size="large" onClick={goToLogin}>
              取消
            </Button>
          </Flex>
        </Form.Item>
      </Form>
    </Container>
  );
};

export default FormForgotPassword;
