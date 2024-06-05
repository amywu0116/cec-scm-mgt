import React from "react";
import { App, Layout, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";
import styled from "styled-components";
import Image from "next/image";
import { useRouter } from "next/navigation";

import api from "@/api";

const StyledSider = styled(Layout.Sider)`
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;

    width: 50%;
    height: 8px;
  }

  &::before {
    left: 0;
    background-color: #fd0202;
  }

  &::after {
    right: 0;
    background-color: #10439c;
  }

  .ant-menu,
  .ant-menu-item {
    background-color: #1e5bc6;
  }

  .ant-menu {
    padding: 0 16px;
  }

  .ant-menu-dark .ant-menu-item-selected {
    background-color: #fff;
    color: #1e5bc6;
    font-size: 14px;
    font-weight: 600;
  }

  .ant-menu-dark.ant-menu-inline .ant-menu-sub.ant-menu-inline {
    background-color: #1e5bc6;
  }

  .ant-layout-sider-children {
    padding: 0 16px;
  }

  .ant-menu {
    padding: 0;
  }
`;

const items = [
  { key: "sub1", label: "訊息與公告", icon: React.createElement(UserOutlined) },
  {
    key: "/product",
    label: "商品",
    icon: React.createElement(UserOutlined),
    children: [
      {
        key: "/product/product-list",
        label: "商品列表",
        icon: React.createElement(UserOutlined),
      },
      {
        key: "/product/product-application",
        label: "提品申請",
        icon: React.createElement(UserOutlined),
      },
    ],
  },
  {
    key: "/order",
    label: "訂單",
    icon: React.createElement(UserOutlined),
    children: [
      {
        key: "/order",
        label: "訂單管理",
        icon: React.createElement(UserOutlined),
      },
    ],
  },
  {
    key: "sub4",
    label: "供應商",
    icon: React.createElement(UserOutlined),
  },
  {
    key: "logout",
    label: "登出",
    icon: React.createElement(UserOutlined),
  },
];

const Sider = () => {
  const router = useRouter();
  const { message } = App.useApp();

  const logout = () => {
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
        message.success("登出成功");
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const handleClickItem = ({ item, key, keyPath, domEvent }) => {
    if (key === "logout") {
      logout();
    } else {
      router.push(key);
    }
  };

  return (
    <StyledSider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: "#1E5BC6",
        paddingTop: 32,
      }}
      width={280}
    >
      <Image src="/logo-1.svg" width={40} height={27} />
      <Menu
        theme="dark"
        mode="inline"
        items={items}
        onClick={handleClickItem}
      />
    </StyledSider>
  );
};

export default Sider;
