"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Checkbox,
  Divider,
  Layout,
  Pagination,
  Radio,
  Tabs,
} from "antd";
import styled, { css } from "styled-components";
import Link from "next/link";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";
import ModalAddType from "./ModalAddProduct";

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

const BtnGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Card = styled.div`
  /* background-color: #f1f3f6; */
  /* padding: 16px; */
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
  width: 42px;
  flex-shrink: 0;
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

const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 36px;
`;

const MaintainBtn = styled.div`
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

const ReturnRequest = (props) => {
  const [showModalAddType, setShowModalAddType] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      title: "申請日期",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "申請類型",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "部門別",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "中文品名",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "條碼",
      dataIndex: "e",
      align: "center",
    },
    {
      title: "圖片",
      dataIndex: "f",
      align: "center",
      render: () => {
        return (
          <img width={40} height={40} src="https://fakeimg.pl/40x40/" alt="" />
        );
      },
    },
    {
      title: "審核狀態",
      dataIndex: "g",
      align: "center",
    },
    {
      title: "功能",
      dataIndex: "h",
      align: "center",
      render: (text, record, index) => {
        if (index === 0) {
          return <MaintainBtn>商品相關圖檔維護</MaintainBtn>;
        }
        return;
      },
    },
  ];

  const data = [
    {
      a: "2024/04/23",
      b: "新品提品",
      c: "12",
      d: "法式傳統奶油酥餅（厚）",
      e: "3472860001492",
      f: "",
      g: "暫存",
      h: "",
    },
    {
      a: "2024/04/23",
      b: "新品提品",
      c: "12",
      d: "法式傳統奶油酥餅（厚）",
      e: "3472860001492",
      f: "",
      g: "暫存",
      h: "",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>提品申請</LayoutHeaderTitle>

        <BtnGroup style={{ marginLeft: "auto" }}>
          <Button>提品匯入範例下載</Button>
          <Button type="secondary">提品匯入</Button>
          <Button type="primary" onClick={() => setShowModalAddType(true)}>
            新增提品
          </Button>
        </BtnGroup>
      </LayoutHeader>

      <Container>
        <Card>
          <Row>
            <Item>
              <ItemLabel>日期</ItemLabel>

              <DatePicker
                style={{ width: 203 }}
                placeholder="日期起"
                onChange={() => {}}
              />
              <div style={{ width: 42, textAlign: "center" }}>-</div>
              <DatePicker
                style={{ width: 203 }}
                placeholder="日期迄"
                onChange={() => {}}
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>條碼</ItemLabel>
              <Input style={{ width: 203 }} placeholder="請輸入條碼" />
            </Item>

            <Item>
              <ItemLabel>品名</ItemLabel>
              <Input style={{ width: 203 }} placeholder="請輸入商品名稱" />
            </Item>

            <Item>
              <ItemLabel>狀態</ItemLabel>
              <Select
                style={{ width: 203 }}
                placeholder="請選擇狀態"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <BtnGroup style={{ marginLeft: "auto" }} justifyContent="flex-end">
              <Button type="secondary">查詢</Button>

              <Button type="link">清除查詢條件</Button>
            </BtnGroup>
          </Row>
        </Card>

        <TableWrapper>
          <TableTitle>申請列表</TableTitle>

          {selectedRows.length > 0 && (
            <BtnGroup>
              <Button type="default">送審</Button>
              <Button type="default">刪除</Button>
            </BtnGroup>
          )}

          <Table
            rowSelection={{
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRows(selectedRows);
              },
              getCheckboxProps: (record) => ({
                disabled: record.name === "Disabled User",
                name: record.name,
              }),
            }}
            columns={columns}
            dataSource={data}
            pagination={false}
          />
        </TableWrapper>
      </Container>

      <ModalAddType
        open={showModalAddType}
        onCancel={() => setShowModalAddType(false)}
      />
    </>
  );
};

export default ReturnRequest;
