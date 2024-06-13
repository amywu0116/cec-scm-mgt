"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "antd";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";

import { PATH_PRODUCT_STOCK_SETTINGS } from "@/constants/paths";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-tabs-top > .ant-tabs-nav {
    margin-bottom: 0;
  }

  .ant-tabs .ant-tabs-tab {
    padding: 12px 48px;
  }

  .ant-tabs .ant-tabs-tab + .ant-tabs-tab {
    margin: 0;
  }

  .ant-tabs .ant-tabs-tab {
    font-size: 14px;
    font-weight: 700;
    color: #7b8093;
  }

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
  width: 42px;
  flex-shrink: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Page = () => {
  const router = useRouter();

  const columns = [
    {
      title: "部門別",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "中文品名",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "條碼",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "圖片",
      dataIndex: "d",
      align: "center",
      render: () => {
        return (
          <img width={40} height={40} src="https://fakeimg.pl/40x40/" alt="" />
        );
      },
    },
    {
      title: "功能",
      dataIndex: "e",
      align: "center",
      render: (text, record, index) => {
        if (index === 0) {
          return (
            <FunctionBtn
              color="green"
              onClick={() => router.push(PATH_PRODUCT_STOCK_SETTINGS)}
            >
              庫存設定
            </FunctionBtn>
          );
        }
        return;
      },
    },
  ];

  const data = [
    {
      a: "14",
      b: "法式傳統奶油酥餅（厚）",
      c: "3472860001492",
      d: "",
      e: "",
    },
    {
      a: "14",
      b: "法式傳統奶油酥餅（厚）",
      c: "3472860001492",
      d: "",
      e: "",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>商品列表</LayoutHeaderTitle>
      </LayoutHeader>

      <Container>
        <Card>
          <Row>
            <Item style={{ flex: 1 }}>
              <ItemLabel>條碼</ItemLabel>
              <Input placeholder="請輸入條碼" />
            </Item>

            <Item style={{ flex: 1 }}>
              <ItemLabel>品名</ItemLabel>
              <Input placeholder="請輸入商品名稱" />
            </Item>

            <ButtonGroup
              style={{ marginLeft: "auto" }}
              justifyContent="flex-end"
            >
              <Button type="secondary">查詢</Button>
              <Button type="link">清除查詢條件</Button>
            </ButtonGroup>
          </Row>
        </Card>

        <TableWrapper>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: "全部",
                key: "1",
                children: <Table columns={columns} dataSource={data} />,
              },
            ]}
          />
        </TableWrapper>
      </Container>
    </>
  );
};

export default Page;
