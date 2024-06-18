"use client";
import { useState } from "react";
import { Breadcrumb, Divider, Radio } from "antd";
import styled from "styled-components";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";
import Select from "@/components/Select";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import Tabs from "@/components/Tabs";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-checkbox-group {
    gap: 20px 18px;
    padding: 0 16px;
  }

  .ant-radio + span,
  .ant-checkbox + span {
    font-size: 14px;
    font-weight: 400;
    color: #7b8093;
  }

  .ant-checkbox + span {
    width: 84px;
  }

  .ant-radio + span {
    word-break: keep-all;
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

const BtnGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Page = () => {
  const columns = [
    {
      title: "申訴狀態",
      dataIndex: "a",
      align: "center",
      width: 100,
    },
    {
      title: "帳務訂單號碼",
      dataIndex: "b",
      align: "center",
      width: 160,
    },
    {
      title: "帳務訂單發票",
      dataIndex: "c",
      align: "center",
      width: 120,
    },
    {
      title: "訂單編號",
      dataIndex: "d",
      align: "center",
      width: 160,
    },
    {
      title: "供應商名稱",
      dataIndex: "e",
      align: "center",
      width: 100,
    },
    {
      title: "商品品名",
      dataIndex: "f",
      align: "center",
      width: 160,
    },
    {
      title: "溫層",
      dataIndex: "g",
      align: "center",
      width: 100,
    },
    {
      title: "佣金比例(%)",
      dataIndex: "h",
      align: "center",
      width: 100,
    },
    {
      title: "訂單付款完成日期",
      dataIndex: "i",
      align: "center",
      width: 120,
    },
    {
      title: "商品金額 (A)",
      dataIndex: "j",
      align: "center",
      width: 100,
    },
    {
      title: "服務手續費 (B)",
      dataIndex: "k",
      align: "center",
      width: 100,
    },
    {
      title: "成交手續費 (C)",
      dataIndex: "l",
      align: "center",
      width: 100,
    },
    {
      title: "第三方支付手續費 (D)",
      dataIndex: "m",
      align: "center",
      width: 120,
    },
    {
      title: "家福收款金額(B+C)",
      dataIndex: "n",
      align: "center",
      width: 120,
    },
    {
      title: "供應商收款金額 (A-B-C-D)",
      dataIndex: "o",
      align: "center",
      width: 160,
    },
    {
      title: "銀行入帳日期",
      dataIndex: "p",
      align: "center",
      width: 120,
    },
    {
      title: "銀行入帳金額",
      dataIndex: "q",
      align: "center",
      width: 100,
    },
    {
      title: "申訴申請時間",
      dataIndex: "r",
      align: "center",
      width: 120,
    },
    {
      title: "申訴結案時間",
      dataIndex: "s",
      align: "center",
      width: 120,
    },
  ];

  const data = [
    {
      key: "1",
      a: "無",
      b: "2024052800000001",
      c: "ZZ987654321",
      d: "2024051009001101",
      e: "費列羅",
      f: "費列羅臻品甜點24粒盒裝259.2g",
      g: "溫層",
      h: "5",
      i: "2024/5/17",
      j: "309",
      k: "12",
      l: "15",
      m: "6",
      n: "27",
      o: "276",
      p: "2024/6/1",
      q: "27",
      r: "申訴申請時間",
      s: "申訴結案時間",
    },
    {
      key: "2",
      a: "已申請",
      b: "2024052800000001",
      c: "ZZ987654321",
      d: "2024051009001101",
      e: "費列羅",
      f: "費列羅臻品甜點24粒盒裝259.2g",
      g: "溫層",
      h: "5",
      i: "2024/5/17",
      j: "309",
      k: "12",
      l: "15",
      m: "6",
      n: "27",
      o: "276",
      p: "2024/6/1",
      q: "27",
      r: "申訴申請時間",
      s: "申訴結案時間",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>帳務</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "帳務",
            },
            {
              title: "對帳報表",
            },
          ]}
        />
      </LayoutHeader>

      <Container>
        <Card>
          <Row>
            <Item>
              <ItemLabel>帳期</ItemLabel>
              <Select
                style={{ width: 250 }}
                placeholder="請選擇狀態"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <Item>
              <ItemLabel>配達期間</ItemLabel>
              <DatePicker style={{ width: 250 }} onChange={() => {}} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>供應商</ItemLabel>
              <Input style={{ width: 250 }} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>對帳報表狀態</ItemLabel>
              <Radio.Group
                style={{ display: "flex", flex: 1, alignItems: "center" }}
              >
                <Radio value={1}>全部</Radio>
                <Radio value={2}>待確認</Radio>
                <Radio value={3}>已確認</Radio>
                <Radio value={4}>已開立發票</Radio>
                <Radio value={5}>已撥款</Radio>
              </Radio.Group>
            </Item>
          </Row>

          <Divider style={{ margin: 0 }} />

          <BtnGroup style={{ marginLeft: "auto" }} justifyContent="flex-end">
            <Button type="secondary">查詢</Button>

            <Button type="link">清除查詢條件</Button>
          </BtnGroup>
        </Card>

        <TableWrapper>
          <BtnGroup>
            <Button type="secondary">下載查詢結果</Button>
            <Button type="secondary">發票下載</Button>
            <Button>爭議申請</Button>
            <Button>取消爭議</Button>
            <Button>爭議結案</Button>
          </BtnGroup>

          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: "全部",
                key: "1",
                children: (
                  <>
                    <Table
                      rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {},
                        getCheckboxProps: (record) => ({
                          name: record.key,
                        }),
                      }}
                      scroll={{ x: "100vw" }}
                      columns={columns}
                      dataSource={data}
                    />
                  </>
                ),
              },
              {
                label: "待確認",
                key: "2",
                children: "Tab 2",
              },
              {
                label: "已確認",
                key: "3",
                children: "Tab 3",
              },
              {
                label: "已開立發票",
                key: "4",
                children: "Tab 4",
              },
              {
                label: "已撥款",
                key: "5",
                children: "Tab 5",
              },
            ]}
          />
        </TableWrapper>
      </Container>
    </>
  );
};

export default Page;
