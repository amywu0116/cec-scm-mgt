"use client";
import { ConfigProvider, Layout } from "antd";
import zhTW from "antd/locale/zh_TW";
import "dayjs/locale/zh-tw";
import { useEffect, useState } from "react";
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

export default function PageLayout(props) {
  const { children } = props;

  const [headerHeight, setHeaderHeight] = useState(100);
  const updateOptions = useBoundStore((state) => state.updateOptions);

  const fetchOptions = () => {
    api
      .get("v1/system/option")
      .then((res) => updateOptions(res.data))
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  useEffect(() => {
    const header = document.querySelector("header.ant-layout-header");
    const headerHeight = header.getBoundingClientRect().height;
    setHeaderHeight(headerHeight);
  }, []);

  useEffect(() => {
    if (updateOptions) {
      fetchOptions();
    }
  }, [updateOptions]);

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
        <ConfigProvider locale={zhTW}>
          <Container $headerHeight={headerHeight}>{children}</Container>
        </ConfigProvider>
      </Layout>
    </Layout>
  );
}
