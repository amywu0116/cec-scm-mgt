"use client";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Tabs from "@/components/Tabs";

import BasicInfo from "./BasicInfo";
import CommissionInfo from "./CommissionInfo";
import FeeInfo from "./FeeInfo";
import CommissionRecord from "./CommissionRecord";
import FeeRecord from "./FeeRecord";
import LoginRecord from "./LoginRecord";
import Shipping from "./Shipping";

const Page = () => {
  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>供應商</LayoutHeaderTitle>
      </LayoutHeader>

      <Tabs
        defaultActiveKey="1"
        destroyInactiveTabPane
        items={[
          {
            label: "基本資料",
            key: "1",
            children: <BasicInfo />,
          },
          {
            label: "佣金資訊",
            key: "2",
            children: <CommissionInfo />,
          },
          {
            label: "費用資訊",
            key: "3",
            children: <FeeInfo />,
          },
          {
            label: "佣金異動歷程",
            key: "4",
            children: <CommissionRecord />,
          },
          {
            label: "費用異動歷程",
            key: "5",
            children: <FeeRecord />,
          },
          {
            label: "使用者登入歷程",
            key: "6",
            children: <LoginRecord />,
          },
          {
            label: "運費設定",
            key: "7",
            children: <Shipping />,
          },
        ]}
      />
    </>
  );
};

export default Page;
