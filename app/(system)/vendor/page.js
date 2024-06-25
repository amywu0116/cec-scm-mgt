"use client";
import React from "react";

import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Tabs from "@/components/Tabs";

import BasicInfo from "./BasicInfo";
import CommissionInfo from "./CommissionInfo";
import FeeInfo from "./FeeInfo";
import CommissionHistory from "./CommissionHistory";
import FeeHistory from "./FeeHistory";
import LoginRecord from "./LoginRecord";

import api from "@/api";
import { useBoundStore } from "@/store";

const Page = () => {
  const updateOptions = useBoundStore((state) => state.updateOptions);

  const fetchOptions = () => {
    api
      .get("v1/system/option")
      .then((res) => updateOptions(res.data))
      .catch((err) => console.log(err))
      .finally(() => {});
  };

  fetchOptions();

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>供應商</LayoutHeaderTitle>
      </LayoutHeader>

      <Tabs
        defaultActiveKey="1"
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
            children: <CommissionHistory />,
          },
          {
            label: "費用異動歷程",
            key: "5",
            children: <FeeHistory />,
          },
          {
            label: "使用者登入歷程",
            key: "6",
            children: <LoginRecord />,
          },
        ]}
      />
    </>
  );
};

export default Page;
