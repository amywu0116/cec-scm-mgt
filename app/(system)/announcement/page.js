"use client";
import { useState } from "react";
import { Breadcrumb } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";
import ModalHistory from "./ModalHistory";

const Page = () => {
  const [showModalHistory, setShowModalHistory] = useState(false);

  const columns = [
    {
      title: "建立時間",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "主題",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "公告內容",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "發送分類",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "備註",
      dataIndex: "e",
      align: "center",
      render: (text, record, index) => {
        return (
          <Button type="text" onClick={() => setShowModalHistory(true)}>
            {text}
          </Button>
        );
      },
    },
    {
      title: "操作",
      dataIndex: "h",
      align: "center",
      render: () => {
        return (
          <Button
            type="link"
            size="large"
            icon={<MoreOutlined style={{ fontSize: 30 }} />}
          />
        );
      },
    },
  ];

  const data = [
    {
      a: "2024/05/01 17:40:00",
      b: "廠商A公告",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "菸酒飲料",
      e: "",
      f: "",
    },
    {
      a: "2024/04/29 17:40:00",
      b: "廠商B公告",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "可樂",
      e: "新款可樂上架，請踴躍試喝！",
      f: "",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>公告設定</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "訊息與公告",
            },
            {
              title: "公告設定",
            },
          ]}
        />
      </LayoutHeader>

      <Table columns={columns} dataSource={data} pagination={false} />

      <ModalHistory
        open={showModalHistory}
        onCancel={() => setShowModalHistory(false)}
      />
    </>
  );
};

export default Page;
