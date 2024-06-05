"use client";
import React, { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Layout } from "antd";
import styled, { css } from "styled-components";

import Sider from "./Sider";

const Container = styled.div`
  ${(props) =>
    props.$headerHeight &&
    css`
      margin: 124px 36px 33px;
    `}
`;

const PageLayout = (props) => {
  const { children } = props;
  // const accessToken = localStorage.getItem("cec-scm-mgt-accessToken");

  const [headerHeight, setHeaderHeight] = useState(100);

  useEffect(() => {
    const header = document.querySelector("header.ant-layout-header");
    const headerHeight = header.getBoundingClientRect().height;
    setHeaderHeight(headerHeight);
  }, []);

  // useEffect(() => {
  //   if (!accessToken) {
  //     redirect("/login");
  //   }
  // }, [accessToken]);

  return (
    <Layout hasSider>
      <Sider />

      <Layout
        style={{
          marginLeft: 280,
          backgroundColor: "#fff",
          minHeight: "100vh",
        }}
      >
        <Container $headerHeight={headerHeight}>{children}</Container>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
