"use client";
import { useState } from "react";
import { Breadcrumb } from "antd";
import styled, { css } from "styled-components";
import { MoreOutlined } from "@ant-design/icons";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

import ModalHistory from "./ModalHistory";
import ModalMessageContent from "./ModalMessageContent";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-btn-link {
    padding: 0;
    min-width: 0;

    span {
      font-size: 14px;
      font-weight: 400;
      color: #212b36;
      text-decoration: underline;
    }
  }
`;

const Card = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Row = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7b8093;
  width: 64px;
  flex-shrink: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0 16px;

  ${(props) =>
    props.justifyContent &&
    css`
      justify-content: ${props.justifyContent};
    `}
`;

const Page = (props) => {
  const columns = [
    {
      title: "訂單編號",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "提問時間",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "問題類別",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "提問內容",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "狀態",
      dataIndex: "e",
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "f",
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
      a: "10124881",
      b: "2024/03/28 17:40:00",
      c: "問題反應/服務品品質",
      d: "購買時有效期限就過期，拿回換貨...",
      e: "未回覆",
      f: "",
    },
    {
      a: "10124881",
      b: "2024/03/28 17:40:00",
      c: "問題反應/服務品品質",
      d: "購買時有效期限就過期，拿回換貨...",
      e: "未回覆",
      f: "",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>訊息列表</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "訊息與公告",
            },
            {
              title: "訊息列表",
            },
          ]}
        />
      </LayoutHeader>

      <Container>
        <Card>
          <Row>
            <Item>
              <ItemLabel>問題類別</ItemLabel>
              <Select
                style={{ width: 285 }}
                placeholder="請選擇問題類別"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <Item>
              <ItemLabel>訂單編號</ItemLabel>
              <Input style={{ width: 285 }} placeholder="輸入ID" />
            </Item>

            <ButtonGroup style={{ marginLeft: "auto" }}>
              <Button type="secondary">查詢</Button>
              <Button type="link">清除查詢條件</Button>
            </ButtonGroup>
          </Row>
        </Card>

        <Table columns={columns} dataSource={data} />
      </Container>

      <ModalHistory open={false} />

      <ModalMessageContent open={false} />
    </>
  );
};

export default Page;
