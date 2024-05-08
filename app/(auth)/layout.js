"use client";
import styled from "styled-components";
import { Card } from "antd";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCard = styled(Card)`
  width: 400px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
`;

const Layout = (props) => {
  const { children } = props;

  return (
    <Container>
      <StyledCard>{children}</StyledCard>
    </Container>
  );
};

export default Layout;
