"use client";
import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import styled, { css } from "styled-components";

import Sider from "./Sider";

import api from "@/api";
import { useBoundStore } from "@/store";

const Container = styled.div`
  ${(props) =>
    props.$headerHeight &&
    css`
      margin: 124px 36px 33px;
    `}
`;

const PageLayout = (props) => {
  const { children } = props;

  const updateOptions = useBoundStore((state) => state.updateOptions);

  const [headerHeight, setHeaderHeight] = useState(100);

  const fetchOptions = () => {
    api
      .get("v1/system/option")
      .then((res) => updateOptions(res.data))
      .catch((err) => console.log(err))
      .finally(() => {});
  };
  fetchOptions();

  useEffect(() => {
    const header = document.querySelector("header.ant-layout-header");
    const headerHeight = header.getBoundingClientRect().height;
    setHeaderHeight(headerHeight);
  }, []);

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
