"use client";
import React, { Children, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { Breadcrumb, Button, Layout, theme } from "antd";

import Sider from "@/app/Sider";
import api from "@/api";

const PageLayout = (props) => {
  const { children } = props;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  // const accessToken = localStorage.getItem("cec-scm-mgt-accessToken");

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

  return (
    <Layout hasSider>
      <Sider />

      <Layout
        style={{
          marginLeft: 280,
          backgroundColor: "#fff",
        }}
      >
        {children}

        {/* <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default PageLayout;
