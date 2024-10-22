import { App, Flex, Layout, Menu, Space, Tag } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import api from "@/api";
import { isUAT } from "@/constants";
import { routes } from "@/routes";
import { useBoundStore } from "@/store";

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

const ANNOUNCEMENT = "announcement"; // 公告與訂單諮詢
const PRODUCT = "product"; // 商品
const ORDER = "order"; // 訂單
const LOGISTICS = "logistics"; // 貨運公司維護
const VENDOR = "vendor"; // 供應商
const ACCOUNTING = "accounting"; // 帳務
const ACCOUNT = "account"; // 帳戶
const LOGOUT = "logout"; // 登出
const OPTION = "option";

const menuIcon = {
  [ANNOUNCEMENT]: {
    inactive: "/sider/announcement.svg",
    active: "/sider/announcement-active.svg",
  },
  [PRODUCT]: {
    inactive: "/sider/product.svg",
    active: "/sider/product-active.svg",
  },
  [ORDER]: {
    inactive: "/sider/order.svg",
    active: "/sider/order-active.svg",
  },
  [LOGISTICS]: {
    inactive: "/sider/logistics.svg",
    active: "/sider/logistics-active.svg",
  },
  [VENDOR]: {
    inactive: "/sider/vendor.svg",
    active: "/sider/vendor-active.svg",
  },
  [ACCOUNTING]: {
    inactive: "/sider/accounting.svg",
    active: "/sider/accounting-active.svg",
  },
  [ACCOUNT]: {
    inactive: "/sider/account.svg",
    active: "/sider/account-active.svg",
  },
  [LOGOUT]: {
    inactive: "/sider/logout.svg",
    active: "/sider/logout-active.svg",
  },
  [OPTION]: {
    inactive: "/sider/option.svg",
    active: "/sider/option-active.svg",
  },
};

export default function Sider() {
  const router = useRouter();
  const { message } = App.useApp();
  const pathname = usePathname();

  const user = useBoundStore((state) => state.user);
  const clearUser = useBoundStore((state) => state.clearUser);

  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const getMenuIcon = (key) => {
    const isActive = openKeys.includes(key);
    const iconPath = menuIcon[key][isActive ? "active" : "inactive"];
    return <Image src={iconPath} alt="" width={30} height={30} />;
  };

  const getOptionIcon = (key) => {
    const isActive = selectedKeys.includes(key);
    const iconPath = menuIcon[OPTION][isActive ? "active" : "inactive"];
    return <Image src={iconPath} alt="" width={24} height={24} />;
  };

  const items = [
    {
      key: ANNOUNCEMENT,
      label: "公告與訂單諮詢",
      icon: getMenuIcon(ANNOUNCEMENT),
      children: [
        {
          key: routes.announcement.message,
          label: <Link href={routes.announcement.message}>公告訊息</Link>,
          icon: getOptionIcon(routes.announcement.message),
        },
        {
          key: routes.announcement.inquiry,
          label: <Link href={routes.announcement.inquiry}>顧客訂單諮詢</Link>,
          icon: getOptionIcon(routes.announcement.inquiry),
        },
        {
          key: routes.announcement.msgRecord,
          label: <Link href={routes.announcement.msgRecord}>訊息推送資訊</Link>,
          icon: getOptionIcon(routes.announcement.msgRecord),
        },
      ],
    },
    {
      key: PRODUCT,
      label: "商品",
      icon: getMenuIcon(PRODUCT),
      children: [
        {
          key: routes.product.list,
          label: <Link href={routes.product.list}>商品列表</Link>,
          icon: getOptionIcon(routes.product.list),
        },
        {
          key: routes.product.application,
          label: <Link href={routes.product.application}>提品申請</Link>,
          icon: getOptionIcon(routes.product.application),
        },
        {
          key: routes.product.batchImgUpload,
          label: (
            <Link href={routes.product.batchImgUpload}>批次提品圖片上傳</Link>
          ),
          icon: getOptionIcon(routes.product.batchImgUpload),
        },
        {
          key: routes.product.promotion,
          label: <Link href={routes.product.promotion}>商品促銷</Link>,
          icon: getOptionIcon(routes.product.promotion),
        },
        {
          key: routes.product.variation,
          label: <Link href={routes.product.variation}>樣式商品</Link>,
          icon: getOptionIcon(routes.product.variation),
        },
      ],
    },
    {
      key: ORDER,
      label: "訂單",
      icon: getMenuIcon(ORDER),
      children: [
        {
          key: routes.order.list,
          label: <Link href={routes.order.list}>訂單管理</Link>,
          icon: getOptionIcon(routes.order.list),
        },
      ],
    },
    {
      key: routes.logistics.list,
      label: <Link href={routes.logistics.list}>貨運公司維護</Link>,
      icon: getMenuIcon(LOGISTICS),
    },
    {
      key: routes.vendor,
      label: <Link href={routes.vendor}>供應商</Link>,
      icon: getMenuIcon(VENDOR),
    },
    {
      key: ACCOUNTING,
      label: "帳務",
      icon: getMenuIcon(ACCOUNTING),
      children: [
        {
          key: routes.billing.report,
          label: <Link href={routes.billing.report}>對帳報表</Link>,
          icon: getOptionIcon(routes.billing.report),
        },
      ],
    },
    {
      key: ACCOUNT,
      label: "帳戶",
      icon: getMenuIcon(ACCOUNT),
      children: [
        {
          key: routes.account.passwordChange,
          label: <Link href={routes.account.passwordChange}>修改密碼</Link>,
          icon: getOptionIcon(routes.account.passwordChange),
        },
      ],
    },
    {
      key: LOGOUT,
      label: "登出",
      icon: getMenuIcon(LOGOUT),
    },
  ];

  const getOpenKeys = (url) => {
    const parts = url.split("/");
    parts.pop();
    return parts;
  };

  const logout = () => {
    api
      .post(
        "/auth/signout",
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        clearUser();
        message.success("登出成功");
        router.push(routes.login);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const handleClickItem = ({ item, key, keyPath, domEvent }) => {
    if (key === LOGOUT) {
      logout();
    } else {
      router.push(key);
      setSelectedKeys([key]);
    }
  };

  const handleClickLogo = () => {
    setOpenKeys([]);
    setSelectedKeys([]);
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
      <Flex vertical gap={20}>
        <Space size={20} align="center">
          <Link
            style={{ display: "flex" }}
            href={routes.index}
            onClick={handleClickLogo}
          >
            <Image src="/sider/logo.svg" width={40} height={27} alt="" />
          </Link>

          {isUAT && <Tag color="red">UAT</Tag>}
        </Space>

        <Menu
          theme="dark"
          mode="inline"
          inlineIndent={10}
          items={items}
          defaultOpenKeys={getOpenKeys(pathname)}
          defaultSelectedKeys={[pathname]}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onClick={handleClickItem}
          onOpenChange={(openKeys) => setOpenKeys(openKeys)}
        />
      </Flex>
    </StyledSider>
  );
}
