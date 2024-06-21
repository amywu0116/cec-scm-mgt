import React from "react";
import { App, Layout, Menu } from "antd";
import styled from "styled-components";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import api from "@/api";
import {
  PATH_ACCOUNT_CHANGE_PASSWORD,
  PATH_BILLING_COLLECTION_REPORT,
  PATH_BILLING_RECONCILIATION_REPORT,
  PATH_SHIPPING_COMPANY,
  PATH_SUPPLIER,
  PATH_ANNOUNCEMENT_SETTINGS,
  PATH_ANNOUNCEMENT_MESSAGE,
  PATH_PRODUCT_PRODUCT_LIST,
  PATH_PRODUCT_PRODUCT_APPLICATION,
  PATH_ORDER_MANAGEMENT,
} from "@/constants/paths";

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

  .ant-menu-submenu-open {
    > .ant-menu-submenu-title {
      background-color: rgba(255, 255, 255, 1) !important;
      color: rgba(30, 91, 198, 1) !important;
      font-weight: 600;
    }
  }

  .ant-menu-item.ant-menu-item-selected {
    background-color: transparent;
    color: rgba(255, 255, 255);
  }
`;

const items = [
  {
    key: "announcement",
    label: "訊息與公告",
    icon: <Image src="/announcement.png" alt="" width={30} height={30} />,
    children: [
      {
        key: PATH_ANNOUNCEMENT_SETTINGS,
        label: "公告設定",
        icon: <Image src="/sider-bullet.svg" alt="" width={24} height={24} />,
      },
      {
        key: PATH_ANNOUNCEMENT_MESSAGE,
        label: "訊息列表",
        icon: <Image src="/sider-bullet.svg" alt="" width={24} height={24} />,
      },
    ],
  },
  {
    key: "product",
    label: "商品",
    icon: <Image src="/product.svg" alt="" width={30} height={30} />,
    children: [
      {
        key: PATH_PRODUCT_PRODUCT_LIST,
        label: "商品列表",
        icon: <Image src="/sider-bullet.svg" alt="" width={24} height={24} />,
      },
      {
        key: PATH_PRODUCT_PRODUCT_APPLICATION,
        label: "提品申請",
        icon: <Image src="/sider-bullet.svg" alt="" width={24} height={24} />,
      },
    ],
  },
  {
    key: "order",
    label: "訂單",
    icon: <Image src="/order.svg" alt="" width={30} height={30} />,
    children: [
      {
        key: PATH_ORDER_MANAGEMENT,
        label: "訂單管理",
        icon: <Image src="/sider-bullet.svg" alt="" width={24} height={24} />,
      },
    ],
  },
  {
    key: PATH_SHIPPING_COMPANY,
    label: "貨運公司維護",
    icon: <Image src="/logistics.svg" alt="" width={30} height={30} />,
  },
  {
    key: PATH_SUPPLIER,
    label: "供應商",
    icon: <Image src="/supplier.svg" alt="" width={30} height={30} />,
  },
  {
    key: "billing",
    label: "帳務",
    icon: <Image src="/accounting.svg" alt="" width={30} height={30} />,
    children: [
      {
        key: PATH_BILLING_COLLECTION_REPORT,
        label: "收款報表",
        icon: <Image src="/sider-bullet.svg" alt="" width={24} height={24} />,
      },
      {
        key: PATH_BILLING_RECONCILIATION_REPORT,
        label: "對帳報表",
        icon: <Image src="/sider-bullet.svg" alt="" width={24} height={24} />,
      },
    ],
  },
  {
    key: "account",
    label: "帳戶",
    icon: <Image src="/account.svg" alt="" width={30} height={30} />,
    children: [
      {
        key: PATH_ACCOUNT_CHANGE_PASSWORD,
        label: "修改密碼",
        icon: <Image src="/sider-bullet.svg" alt="" width={24} height={24} />,
      },
    ],
  },
  {
    key: "logout",
    label: "登出",
    icon: <Image src="/logout.svg" alt="" width={30} height={30} />,
  },
];

const Sider = () => {
  const router = useRouter();
  const { message } = App.useApp();
  const pathname = usePathname();

  const getOpenKeys = (url) => {
    const parts = url.split("/");
    parts.pop();
    return parts;
  };

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

  console.log("pathname", getOpenKeys(pathname));

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
      <Image src="/logo-1.svg" width={40} height={27} alt="" />

      <Menu
        theme="dark"
        mode="inline"
        inlineIndent={10}
        defaultOpenKeys={getOpenKeys(pathname)}
        defaultSelectedKeys={[pathname]}
        items={items}
        onClick={handleClickItem}
      />
    </StyledSider>
  );
};

export default Sider;
