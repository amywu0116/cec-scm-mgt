"use client";
import React from "react";
import { redirect, useRouter } from "next/navigation";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";

import api from "@/api";

const { Header, Content, Footer, Sider } = Layout;

const menuList = [
  { key: "sub1", label: "公告欄", icon: React.createElement(UserOutlined) },
  { key: "sub2", label: "儀表板", icon: React.createElement(UserOutlined) },
  {
    key: "sub3",
    label: "促銷",
    icon: React.createElement(UserOutlined),
    children: [],
  },
  {
    key: "sub4",
    label: "訂單",
    icon: React.createElement(UserOutlined),
    children: [],
  },
  {
    key: "sub5",
    label: "商品",
    icon: React.createElement(UserOutlined),
    children: [],
  },
  {
    key: "sub6",
    label: "財務",
    icon: React.createElement(UserOutlined),
    children: [],
  },
];

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const Page = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();

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

  // if (true) {
  //   redirect("/login");
  // }

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={menuList}
        />
      </Sider>

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
