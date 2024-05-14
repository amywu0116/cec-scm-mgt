import React from "react";
import { Layout, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";

const items = [
  { key: "sub1", label: "公告欄", icon: React.createElement(UserOutlined) },
  { key: "sub2", label: "儀表板", icon: React.createElement(UserOutlined) },
  {
    key: "sub3",
    label: "促銷",
    icon: React.createElement(UserOutlined),
    children: [
      {
        key: "sub3-1",
        label: "促銷方案維護",
        icon: React.createElement(UserOutlined),
      },
    ],
  },
  {
    key: "sub4",
    label: "訂單",
    icon: React.createElement(UserOutlined),
    children: [
      {
        key: "sub4-1",
        label: "B2C訂單管理",
        icon: React.createElement(UserOutlined),
      },
      {
        key: "sub4-2",
        label: "貨運公司維護",
        icon: React.createElement(UserOutlined),
      },
    ],
  },
  {
    key: "sub5",
    label: "商品",
    icon: React.createElement(UserOutlined),
    children: [
      {
        key: "sub4-2",
        label: "商品維護",
        icon: React.createElement(UserOutlined),
      },
    ],
  },
  {
    key: "sub6",
    label: "財務",
    icon: React.createElement(UserOutlined),
  },
];

const Sider = () => {
  return (
    <Layout.Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["4"]}
        items={items}
      />
    </Layout.Sider>
  );
};

export default Sider;
