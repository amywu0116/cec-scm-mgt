"use client";
import { ConfigProvider, Layout } from "antd";
import zhTW from "antd/locale/zh_TW";
import "dayjs/locale/zh-tw";
import { Suspense, useEffect } from "react";
import styled from "styled-components";

import Sider from "./Sider";

import api from "@/api";
import { useBoundStore } from "@/store";

const Container = styled.div`
  margin: 124px 36px 150px;
`;

export default function PageLayout(props) {
  const { children } = props;

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
            <Container>{children}</Container>
          </ConfigProvider>
        </Layout>
      </Layout>
    </Suspense>
  );
}
