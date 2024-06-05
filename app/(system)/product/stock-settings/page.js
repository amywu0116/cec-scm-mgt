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

const DeleteBtn = styled.div``;

const SettingsCard = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  display: flex;
  gap: 0 16px;
`;

const Page = () => {
  const [showSettings, setShowSettings] = useState(false);

  const columns = [
    {
      title: "No",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "起始日期",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "庫存",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "已販售量",
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
          return <DeleteBtn>刪除</DeleteBtn>;
        }
        return;
      },
    },
  ];

  const data = [
    {
      a: "1",
      b: "2024/05/01",
      c: "3472860001492",
      d: "30",
      e: "",
    },
    {
      a: "2",
      b: "2024/04/23",
      c: "3472860001492",
      d: "35",
      e: "",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>商品列表</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "商品列表",
            },
            {
              title: "庫存設定",
            },
          ]}
        />
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
              <Button
                type="primary"
                disabled={showSettings}
                onClick={() => setShowSettings(true)}
              >
                新增庫存設定
              </Button>
            </ButtonGroup>
          </Row>
        </Card>

        {showSettings && (
          <SettingsCard>
            <FormItem style={{ flex: 1 }}>
              <FormItemLabel>數量</FormItemLabel>
              <Input placeholder="請輸入數量" />
            </FormItem>

            <FormItem style={{ flex: 1 }}>
              <FormItemLabel>起始日期</FormItemLabel>
              <DatePicker
                style={{ width: "100%" }}
                placeholder="請選擇起始日期"
              />
            </FormItem>

            <ButtonGroup>
              <Button style={{ width: 86 }} type="secondary">
                確認
              </Button>

              <Button
                style={{ width: 86 }}
                onClick={() => setShowSettings(false)}
              >
                取消
              </Button>
            </ButtonGroup>
          </SettingsCard>
        )}

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
