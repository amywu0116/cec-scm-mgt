"use client";
import React, { useEffect, useState } from "react";
import { ConfigProvider, Layout } from "antd";
import styled, { css } from "styled-components";

import Sider from "./Sider";

import api from "@/api";
import { useBoundStore } from "@/store";
import { useRouter } from "next/navigation";
import { PATH_LOGIN } from "@/constants/paths";
import zhTW from "antd/locale/zh_TW";
import "dayjs/locale/zh-tw";

const Container = styled.div`
  ${(props) =>
    props.$headerHeight &&
    css`
      margin: 124px 36px 33px;
    `}
`;

const PageLayout = (props) => {
  const router = useRouter();
  const { children } = props;

  // 如果沒有登入，跳回登入頁
  const userStorage = localStorage.getItem("cec-scm-mgt");
  const token = JSON.parse(userStorage)?.state?.user?.token;
  if (!token) {
    router.push(PATH_LOGIN);
    return null;
  }
  
  const updateOptions = useBoundStore((state) => state.updateOptions);

  const [headerHeight, setHeaderHeight] = useState(100);

  if (updateOptions) {
    const fetchOptions = () => {
      api
        .get("v1/system/option")
        .then((res) => updateOptions(res.data))
        .catch((err) => console.log(err))
        .finally(() => {});
    };
    fetchOptions();
  }

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
        <ConfigProvider locale={zhTW}>
          <Container $headerHeight={headerHeight}>{children}</Container>
        </ConfigProvider>
      </Layout>
    </Layout>
  );
};

export default PageLayout;
