"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Checkbox, Divider, Radio } from "antd";
import styled, { css } from "styled-components";
import Link from "next/link";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";
import Tabs from "@/components/Tabs";

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

  .ant-table-wrapper .ant-table-tbody {
    .ant-table-row {
      &.closed {
        background-color: #eeeeee;

        a {
          color: #7b8093;
        }

        > .ant-table-cell-row-hover {
          background-color: #eeeeee;
        }
      }
    }
  }
`;

const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 36px;
`;

const Card = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
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

  ${(props) =>
    props.justifyContent &&
    css`
      justify-content: ${props.justifyContent};
    `}
`;

const Row = styled.div`
  display: flex;
  gap: 0 16px;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const TabLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 4px;
`;

const Tag = styled.div`
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 700;
  background-color: #ff563014;
  color: #b71d18;

  ${(props) =>
    props.type === "closed" &&
    css`
      background-color: #919eab14;
      color: #212b36;
    `}

  ${(props) =>
    props.type === "pending" &&
    css`
      background-color: #ff563014;
      color: #b71d18;
    `}
`;

const Page = () => {
  const router = useRouter();
  // const accessToken = localStorage.getItem("cec-scm-mgt-accessToken");

  const columns = [
    {
      title: "訂單日期",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "訂單編號",
      dataIndex: "b",
      align: "center",
      render: (text, record, index) => {
        return <Link href={`/order/${text}`}>{text}</Link>;
      },
    },
    {
      title: "預計配送日",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "訂單金額",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "收件人姓名",
      dataIndex: "e",
      align: "center",
    },
    {
      title: "收件人手機號碼",
      dataIndex: "f",
      align: "center",
    },
    {
      title: "處理狀態",
      dataIndex: "g",
      align: "center",
      render: (text, record, index) => {
        let type = "";
        switch (text) {
          case "已結案":
            type = "closed";
            break;
          case "待處理":
            type = "pending";
            break;
          default:
            type = "";
            break;
        }
        return <Tag type={type}>{text}</Tag>;
      },
    },
    {
      title: "狀態",
      dataIndex: "h",
      align: "center",
    },
    {
      title: "備註",
      dataIndex: "i",
      align: "center",
    },
  ];

  const data = [
    {
      a: "2024/04/23",
      b: "3472860001492",
      c: "2024/04/23",
      d: "22,080",
      e: "王小花",
      f: "0980123123",
      g: "已結案",
      h: "拒收",
      i: "",
    },
    {
      a: "2024/04/23",
      b: "3472860001492",
      c: "2024/04/23",
      d: "22,080",
      e: "王小花",
      f: "0980123123",
      g: "待處理",
      h: "拒收",
      i: "",
    },
    {
      a: "2024/04/23",
      b: "3472860001492",
      c: "2024/04/23",
      d: "22,080",
      e: "王小花",
      f: "0980123123",
      g: "待處理",
      h: "拒收",
      i: "",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>訂單管理</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "訂單",
            },
            {
              title: "訂單管理",
            },
          ]}
        />
      </LayoutHeader>

      <Container>
        <Card>
          <Row>
            <Item>
              <ItemLabel>訂單編號</ItemLabel>
              <Input style={{ width: 250 }} placeholder="輸入訂單編號" />
            </Item>

            <Item>
              <ItemLabel>日期</ItemLabel>
              <DatePicker
                style={{ width: 250 }}
                placeholder="日期起"
                onChange={() => {}}
              />
              <div>-</div>
              <DatePicker
                style={{ width: 250 }}
                placeholder="日期迄"
                onChange={() => {}}
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>貨運公司</ItemLabel>
              <Select
                style={{ width: 250 }}
                placeholder="選擇貨運公司"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <Item>
              <ItemLabel>處理狀態</ItemLabel>
              <Radio.Group
                style={{ display: "flex", flex: 1, alignItems: "center" }}
                defaultValue={1}
                // onChange={() => {}}
                // value={1}
              >
                <Radio value={1}>待處理</Radio>
                <Radio value={2}>已結案</Radio>
              </Radio.Group>
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>訂單物流狀態</ItemLabel>
              <Checkbox.Group
                options={[
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                ]}
                defaultValue={[""]}
                onChange={() => {}}
              />
            </Item>
          </Row>

          <Divider style={{ margin: 0 }} />

          <BtnGroup justifyContent="flex-end">
            <Button>出貨狀態匯入</Button>

            <Button type="secondary">查詢</Button>

            <Button type="link">清除查詢條件</Button>
          </BtnGroup>
        </Card>

        <TableWrapper>
          <TableTitle>訂單列表</TableTitle>

          <BtnGroup>
            <Button type="secondary">導出客戶清單</Button>
            <Button disabled>批次維護物流狀態為已送達</Button>
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
                    />
                  </>
                ),
              },
              {
                label: (
                  <TabLabelWrapper>
                    異常 <Tag>5</Tag>
                  </TabLabelWrapper>
                ),
                key: "2",
                children: "Tab 2",
              },
              {
                label: (
                  <TabLabelWrapper>
                    待處理 <Tag>12</Tag>
                  </TabLabelWrapper>
                ),
                key: "3",
                children: "Tab 3",
              },
            ]}
          />
        </TableWrapper>
      </Container>
    </>
  );
};

export default Page;
