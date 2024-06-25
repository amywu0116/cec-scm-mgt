"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import { Form } from "antd";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";
import Tabs from "@/components/Tabs";

import { PATH_PRODUCT_STOCK_SETTINGS, PATH_PRODUCT } from "@/constants/paths";
import api from "@/api";

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
  const router = useRouter();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({ table: false });

  const [tableInfo, setTableInfo] = useState({
    total: 0,
    rows: [],
  });

  const columns = [
    {
      title: "部門別",
      dataIndex: "",
      align: "center",
    },
    {
      title: "中文品名",
      dataIndex: "itemName",
      align: "center",
    },
    {
      title: "條碼",
      dataIndex: "itemEan",
      align: "center",
    },
    {
      title: "圖片",
      dataIndex: "productImgUrl",
      align: "center",
      render: (text, record) => {
        if (!text) return "-";
        return <Image width={40} height={40} src={text} alt="" />;
      },
    },
    {
      title: "功能",
      dataIndex: "",
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

  const fetchList = (values, pagination = { page: 1, pageSize: 10 }) => {
    const offset = (pagination.page - 1) * pagination.pageSize;
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/product", {
        params: {
          itemEan: values.itemEan ? values.itemEan : undefined,
          itemName: values.itemName ? values.itemName : undefined,
          offset,
          max: pagination.pageSize,
        },
      })
      .then((res) => setTableInfo((state) => ({ ...state, ...res.data })))
      .catch((err) => console.log(err))
      .finally(() => setLoading((state) => ({ ...state, table: false })));
  };

  const handleFinish = (values) => {
    fetchList(values);
  };

  const handleChangeTable = (page, pageSize) => {
    const formValues = form.getFieldsValue(true);
    fetchList(formValues, { page, pageSize });
  };

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>商品列表</LayoutHeaderTitle>
      </LayoutHeader>

      <Container>
        <Form form={form} onFinish={handleFinish}>
          <Card>
            <Row>
              <Form.Item name="itemEan" style={{ flex: 1, margin: 0 }}>
                <Item>
                  <ItemLabel>條碼</ItemLabel>
                  <Input placeholder="請輸入條碼" />
                </Item>
              </Form.Item>

              <Form.Item name="itemName" style={{ flex: 1, margin: 0 }}>
                <Item>
                  <ItemLabel>品名</ItemLabel>
                  <Input placeholder="請輸入商品名稱" />
                </Item>
              </Form.Item>

              <BtnGroup style={{ marginLeft: "auto" }}>
                <Button type="secondary" htmlType="submit">
                  查詢
                </Button>
                <Button type="link" htmlType="reset">
                  清除查詢條件
                </Button>
              </BtnGroup>
            </Row>
          </Card>
        </Form>

        <TableWrapper>
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: "全部",
                key: "1",
                children: (
                  <Table
                    loading={loading.table}
                    columns={columns}
                    dataSource={tableInfo.rows}
                    total={tableInfo.total}
                    onChange={handleChangeTable}
                    onRow={(record, index) => {
                      return {
                        onClick: (e) => {
                          if (e.target.className.includes("ant-table-cell")) {
                            router.push(`${PATH_PRODUCT}/${record.productId}`);
                          }
                        },
                      };
                    }}
                  />
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
