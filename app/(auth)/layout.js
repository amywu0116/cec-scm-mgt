"use client";
import { Suspense } from "react";
import styled from "styled-components";
import { Col, Row } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useBoundStore } from "@/store";

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
  margin: auto;
`;

const LogoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 120px;
  height: 107px;
`;

const Layout = (props) => {
  const { children } = props;
  const router = useRouter();

  // 已經登入的話不能再進入登入頁
  const user = useBoundStore((state) => state.user);
  if (user?.token) {
    router.push("/");
    return null;
  }

  return (
    <Suspense>
      <Container>
        <Row style={{ height: "100%" }}>
          <Col className="left" flex="auto">
            <Image src="/banner.svg" alt="" width={580} height={453} />
          </Col>

          <Col style={{ display: "flex" }} flex="0 0 480px">
            <LogoWrapper>
              <Image src="/logo.svg" alt="" fill />
            </LogoWrapper>

            <FormWrapper>{children}</FormWrapper>
          </Col>
        </Row>
      </Container>
    </Suspense>
  );
};

export default Layout;
