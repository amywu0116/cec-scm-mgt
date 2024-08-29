"use client";
import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Tabs from "@/components/Tabs";

import BasicInfo from "./BasicInfo";
import CommissionInfo from "./CommissionInfo";
import CommissionRecord from "./CommissionRecord";
import FeeInfo from "./FeeInfo";
import FeeRecord from "./FeeRecord";
import LoginRecord from "./LoginRecord";
import Shipping from "./Shipping";

import updateQuery from "@/utils/updateQuery";

const Container = styled.div``;

export default function Page() {
  const [query, setQuery] = useQueryStates({
    tabKey: parseAsString,
  });

  const [tabKey, setTabKey] = useState("基本資料");

  const handleChangeTab = (activeKey) => {
    updateQuery({ tabKey: activeKey }, setQuery);
    setTabKey(activeKey);
  };

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    setTabKey(query.tabKey);
  }, []);

  return (
    <Container>
      <LayoutHeader>
        <LayoutHeaderTitle>供應商</LayoutHeaderTitle>
      </LayoutHeader>

      <Tabs
        destroyInactiveTabPane
        items={[
          {
            label: "基本資料",
            key: "基本資料",
            children: <BasicInfo />,
          },
          {
            label: "佣金資訊",
            key: "佣金資訊",
            children: <CommissionInfo />,
          },
          {
            label: "費用資訊",
            key: "費用資訊",
            children: <FeeInfo />,
          },
          {
            label: "佣金異動歷程",
            key: "佣金異動歷程",
            children: <CommissionRecord />,
          },
          {
            label: "費用異動歷程",
            key: "費用異動歷程",
            children: <FeeRecord />,
          },
          {
            label: "使用者登入歷程",
            key: "使用者登入歷程",
            children: <LoginRecord />,
          },
          {
            label: "運費設定",
            key: "運費設定",
            children: <Shipping />,
          },
        ]}
        activeKey={tabKey}
        onChange={handleChangeTab}
      />
    </Container>
  );
}
