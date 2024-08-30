"use client";
import { ConfigProvider, Flex, Layout } from "antd";
import zhTW from "antd/locale/zh_TW";
import "dayjs/locale/zh-tw";
import { Suspense, useEffect } from "react";
import styled from "styled-components";

import Sider from "./Sider";

import api from "@/api";
import { useBoundStore } from "@/store";

const Container = styled.div`
  padding: 124px 36px 150px;
  position: relative;
  min-height: 100vh;
`;

const Footer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 30px;
  color: rgba(89, 89, 89, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export default function PageLayout(props) {
  const { children } = props;

  const buildDate = useBoundStore((state) => state.buildDate);
  const updateOptions = useBoundStore((state) => state.updateOptions);

  const fetchOptions = () => {
    api
      .get("v1/system/option")
      .then((res) => updateOptions(res.data))
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  useEffect(() => {
    if (updateOptions) {
      fetchOptions();
    }
  }, [updateOptions]);

  return (
    <Suspense>
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
            <Container>
              {children}

              <Footer>
                <div>2024 © 家樂福線上商城供應商服務系統</div>
                <Flex gap={20}>
                  <span>前端版本：{process.env.NEXT_PUBLIC_BUILD_DATE}</span>
                  <span>API版本：{buildDate}</span>
                </Flex>
              </Footer>
            </Container>
          </ConfigProvider>
        </Layout>
      </Layout>
    </Suspense>
  );
}
