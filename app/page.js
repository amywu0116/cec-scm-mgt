"use client";
import React, { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Button, Layout, theme } from "antd";

import Sider from "./Sider";
import api from "@/api";

const { Header, Content, Footer } = Layout;

const Page = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const accessToken = localStorage.getItem("cec-scm-mgt-accessToken");

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

  // useEffect(() => {
  //   if (!accessToken) {
  //     redirect("/login");
  //   }
  // }, [accessToken]);

  console.log("accessToken", accessToken);

  return (
    <Layout hasSider>
      <Sider />

      <Layout
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          style={{
            padding: "0 50px",
            position: "fixed",
            top: 0,
            zIndex: 1,
            width: "90vw",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            style={{ marginLeft: "auto" }}
            type="primary"
            onClick={handleLogout}
          >
            登出
          </Button>
        </Header>

        <Content
          style={{
            margin: "64px 16px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <p>long content</p>
            {
              // indicates very long content
              Array.from(
                {
                  length: 100,
                },
                (_, index) => (
                  <React.Fragment key={index}>
                    {index % 20 === 0 && index ? "more" : "..."}
                    <br />
                  </React.Fragment>
                )
              )
            }
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Page;
