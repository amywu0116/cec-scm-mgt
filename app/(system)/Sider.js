import { App, Layout, Menu } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styled from "styled-components";

import api from "@/api";
import {
  PATH_ACCOUNT_CHANGE_PASSWORD,
  PATH_HOME,
  PATH_LOGIN,
  PATH_LOGISTICS,
  PATH_ORDER_LIST,
  PATH_PRODUCT_APPLICATION,
  PATH_PRODUCT_BATCH_IMG_UPLOAD,
  PATH_PRODUCT_PRODUCT_LIST,
  PATH_SUPPLIER,
} from "@/constants/paths";
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

const IconMenu = (imgPath) => {
  return <Image src={imgPath} alt="" width={30} height={30} />;
};

const IconSubMenu = () => {
  return <Image src="/sider-bullet.svg" alt="" width={24} height={24} />;
};

export default function Sider() {
  const router = useRouter();
  const { message } = App.useApp();
  const pathname = usePathname();

  const user = useBoundStore((state) => state.user);
  const clearUser = useBoundStore((state) => state.clearUser);

  const items = [
    // {
    //   key: "announcement",
    //   label: "公告與訂單諮詢",
    //   icon: IconMenu("/announcement.png"),
    //   children: [
    //     {
    //       key: PATH_ANNOUNCEMENT_SETTINGS,
    //       label: <Link href={PATH_ANNOUNCEMENT_SETTINGS}>公告訊息</Link>,
    //       icon: IconSubMenu(),
    //     },
    //     {
    //       key: PATH_ANNOUNCEMENT_MESSAGE,
    //       label: <Link href={PATH_ANNOUNCEMENT_MESSAGE}>顧客訂單諮詢</Link>,
    //       icon: IconSubMenu(),
    //     },
    //   ],
    // },
    {
      key: "product",
      label: "商品",
      icon: IconMenu("/product.svg"),
      children: [
        {
          key: PATH_PRODUCT_PRODUCT_LIST,
          label: <Link href={PATH_PRODUCT_PRODUCT_LIST}>商品列表</Link>,
          icon: IconSubMenu(),
        },
        {
          key: PATH_PRODUCT_APPLICATION,
          label: <Link href={PATH_PRODUCT_APPLICATION}>提品申請</Link>,
          icon: IconSubMenu(),
        },
        {
          key: PATH_PRODUCT_BATCH_IMG_UPLOAD,
          label: (
            <Link href={PATH_PRODUCT_BATCH_IMG_UPLOAD}>批次提品圖片上傳</Link>
          ),
          icon: IconSubMenu(),
        },
        // {
        //   key: PATH_PRODUCT_PROMOTION,
        //   label: <Link href={PATH_PRODUCT_PROMOTION}>商品促銷</Link>,
        //   icon: IconSubMenu(),
        // },
        // {
        //   key: "",
        //   label: "樣式商品",
        //   icon: IconSubMenu(),
        // },
      ],
    },
    {
      key: "order",
      label: "訂單",
      icon: IconMenu("/order.svg"),
      children: [
        {
          key: PATH_ORDER_LIST,
          label: <Link href={PATH_ORDER_LIST}>訂單管理</Link>,
          icon: IconSubMenu(),
        },
      ],
    },
    {
      key: PATH_LOGISTICS,
      label: <Link href={PATH_LOGISTICS}>貨運公司維護</Link>,
      icon: IconMenu("/logistics.svg"),
    },
    {
      key: PATH_SUPPLIER,
      label: <Link href={PATH_SUPPLIER}>供應商</Link>,
      icon: IconMenu("/supplier.svg"),
    },
    // {
    //   key: "billing",
    //   label: "帳務",
    //   icon: IconMenu("/accounting.svg"),
    //   children: [
    //     {
    //       key: PATH_BILLING_RECONCILIATION_REPORT,
    //       label: (
    //         <Link href={PATH_BILLING_RECONCILIATION_REPORT}>對帳報表</Link>
    //       ),
    //       icon: IconSubMenu(),
    //     },
    //   ],
    // },
    {
      key: "account",
      label: "帳戶",
      icon: IconMenu("/account.svg"),
      children: [
        {
          key: PATH_ACCOUNT_CHANGE_PASSWORD,
          label: <Link href={PATH_ACCOUNT_CHANGE_PASSWORD}>修改密碼</Link>,
          icon: IconSubMenu(),
        },
      ],
    },
    {
      key: "logout",
      label: "登出",
      icon: IconMenu("/logout.svg"),
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
        router.push(PATH_LOGIN);
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
      <div style={{ marginBottom: 20 }}>
        <Link href={PATH_HOME}>
          <Image src="/logo-1.svg" width={40} height={27} alt="" />
        </Link>
      </div>

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
}
