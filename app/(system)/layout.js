"use client";
import React, { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Layout, theme } from "antd";
import styled, { css } from "styled-components";

import Sider from "@/app/Sider";
import api from "@/api";

const Container = styled.div`
  ${(props) =>
    props.$headerHeight &&
    css`
      margin: 124px 36px 33px;
    `}
`;

const PageLayout = (props) => {
  const { children } = props;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  // const accessToken = localStorage.getItem("cec-scm-mgt-accessToken");

  const [headerHeight, setHeaderHeight] = useState(100);

  const handleLogout = () => {
    const accessToken = localStorage.getItem("cec-scm-mgt-accessToken");
    api
      .post(
        "/auth/signout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        router.push("/login");
      })
      .catch((err) => {})
      .finally(() => {});
  };

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
        }}
      >
        <Container $headerHeight={headerHeight}>{children}</Container>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
