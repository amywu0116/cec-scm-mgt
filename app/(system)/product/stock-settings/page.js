"use client";
import { Breadcrumb, Col, Form, Row } from "antd";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";
import Tabs from "@/components/Tabs";

import { PATH_PRODUCT_PRODUCT_LIST } from "@/constants/paths";

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7b8093;
  flex-shrink: 0;
`;

const SettingsCard = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
`;

export default function Page() {
  const [form] = Form.useForm();

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
        return (
          // <Image
          //   width={40}
          //   height={40}
          //   src="https://fakeimg.pl/40x40/"
          //   alt=""
          // />
          <div>image</div>
        );
      },
    },
    {
      title: "功能",
      dataIndex: "e",
      align: "center",
      render: (text, record, index) => {
        return <FunctionBtn>刪除</FunctionBtn>;
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
            { title: <Link href={PATH_PRODUCT_PRODUCT_LIST}>商品列表</Link> },
            { title: "庫存設定" },
          ]}
        />
      </LayoutHeader>

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={8}>
              <Item>
                <ItemLabel>條碼</ItemLabel>
                <Input placeholder="請輸入條碼" disabled />
              </Item>
            </Col>

            <Col span={8}>
              <Item>
                <ItemLabel>品名</ItemLabel>
                <Input placeholder="請輸入商品名稱" disabled />
              </Item>
            </Col>

            <Col span={8}>
              <Button
                type="primary"
                disabled={showSettings}
                onClick={() => setShowSettings(true)}
              >
                新增庫存設定
              </Button>
            </Col>
          </Row>
        </Col>

        {showSettings && (
          <Col span={24}>
            <SettingsCard>
              <Row gutter={16}>
                <Col span={8}>
                  <Item>
                    <ItemLabel>數量</ItemLabel>
                    <Input placeholder="請輸入數量" />
                  </Item>
                </Col>

                <Col span={8}>
                  <Item>
                    <ItemLabel>起始日期</ItemLabel>
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="請選擇起始日期"
                    />
                  </Item>
                </Col>

                <Col span={8}>
                  <Row gutter={16} justify="end">
                    <Col>
                      <Button type="secondary">確認</Button>
                    </Col>

                    <Col>
                      <Button onClick={() => setShowSettings(false)}>
                        取消
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </SettingsCard>
          </Col>
        )}

        <Col span={24}>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: "全部",
                key: "1",
                children: (
                  <>
                    <Table
                      columns={columns}
                      dataSource={data}
                      pagination={false}
                    />
                  </>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}
