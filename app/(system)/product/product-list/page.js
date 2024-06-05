"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Checkbox, Divider, Pagination, Radio, Tabs } from "antd";
import styled, { css } from "styled-components";
import Link from "next/link";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

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

const FormItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const FormItemLabel = styled.div`
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

const PaginationWrapper = styled.div`
  margin-top: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .total {
    font-size: 14px;
    font-weight: 400;
    color: #7b8093;
  }
`;

const SettingBtn = styled.div`
  border: 1px solid rgba(34, 197, 94, 0.48);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(34, 197, 94, 1);
  padding: 4px 8px;
  margin: auto;
  width: fit-content;
  cursor: pointer;

  &:hover {
    border: 1.5px solid rgba(34, 197, 94, 1);
    background-color: rgba(34, 197, 94, 0.08);
  }
`;

const Page = () => {
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
        return <img width={40} height={40} src="https://fakeimg.pl/40x40/" />;
      },
    },
    {
      title: "功能",
      dataIndex: "e",
      align: "center",
      render: (text, record, index) => {
        if (index === 0) {
          return <SettingBtn>庫存設定</SettingBtn>;
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
            <FormItem style={{ flex: 1 }}>
              <FormItemLabel>條碼</FormItemLabel>
              <Input placeholder="請輸入條碼" />
            </FormItem>

            <FormItem style={{ flex: 1 }}>
              <FormItemLabel>品名</FormItemLabel>
              <Input placeholder="請輸入商品名稱" />
            </FormItem>

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
                children: (
                  <>
                    <Table
                      rowClassName={(record, index) => {
                        if (index === 0) return "closed";
                      }}
                      rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {},
                        getCheckboxProps: (record) => ({
                          disabled: record.name === "Disabled User",
                          name: record.name,
                        }),
                      }}
                      columns={columns}
                      dataSource={data}
                      pagination={false}
                    />
                    <PaginationWrapper>
                      <div className="total">共500筆</div>
                      <Pagination defaultCurrent={6} total={500} />
                    </PaginationWrapper>
                  </>
                ),
              },
            ]}
          />
        </TableWrapper>
      </Container>
    </>
  );
};

export default Page;
