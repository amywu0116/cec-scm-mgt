"use client";
import styled from "styled-components";
import { Col, Row } from "antd";
import Image from "next/image";

const Container = styled.div`
  width: 100vw;
  height: 100vh;

  .left {
    background-color: #e9f1ff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const FormWrapper = styled.div`
  width: 352px;
  margin: 133px auto 0;
`;

const Layout = (props) => {
  const { children } = props;

  return (
    <Container>
      <Row style={{ height: "100%" }}>
        <Col className="left" flex="auto">
          <Image src="/banner.svg" alt="" width={580} height={453} />
        </Col>

        <Col flex="0 0 480px">
          <Image src="/logo.svg" alt="" width={120} height={107} />
          <FormWrapper>{children}</FormWrapper>
        </Col>
      </Row>
    </Container>
  );
};

export default Layout;
