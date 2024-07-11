"use client";
import { App, Col, Form, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import ResetBtn from "@/components/Button/ResetBtn";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";
import Tabs from "@/components/Tabs";

import api from "@/api";
import { PATH_PRODUCT, PATH_PRODUCT_STOCK_SETTINGS } from "@/constants/paths";

export default function Page() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({ table: false });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const columns = [
    {
      title: "部門別",
      dataIndex: "scmCategoryCode",
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
      render: (text, record) => {
        return <Link href={`${PATH_PRODUCT}/${record.productId}`}>{text}</Link>;
      },
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
        if (record.perpetual) return "-";
        return (
          <FunctionBtn
            color="green"
            onClick={() => router.push(PATH_PRODUCT_STOCK_SETTINGS)}
          >
            庫存設定
          </FunctionBtn>
        );
      },
    },
  ];

  const fetchList = (values, pagination = { page: 1, pageSize: 10 }) => {
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/product", {
        params: {
          productnumber: values.productnumber
            ? values.productnumber
            : undefined,
          itemEan: values.itemEan ? values.itemEan : undefined,
          itemName: values.itemName ? values.itemName : undefined,
          offset: (pagination.page - 1) * pagination.pageSize,
          max: pagination.pageSize,
        },
      })
      .then((res) => {
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: pagination.page,
          pageSize: pagination.pageSize,
          tableQuery: { ...values },
        }));
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  const handleFinish = (values) => {
    fetchList(values);
  };

  const handleChangeTable = (page, pageSize) => {
    fetchList(tableInfo.tableQuery, { page, pageSize });
  };

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>商品列表</LayoutHeaderTitle>
      </LayoutHeader>

      <Row>
        <Col span={24}>
          <Form
            form={form}
            autoComplete="off"
            colon={false}
            onFinish={handleFinish}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="productnumber" label="商品ID">
                  <Input placeholder="請輸入商品ID" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="itemEan" label="條碼">
                  <Input placeholder="請輸入條碼" maxLength={13} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="itemName" label="品名">
                  <Input placeholder="請輸入商品名稱" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Row gutter={16} justify="end" align="middle">
                  <Col>
                    <Button type="secondary" htmlType="submit">
                      查詢
                    </Button>
                  </Col>

                  <Col>
                    <ResetBtn type="link" htmlType="reset">
                      清除查詢條件
                    </ResetBtn>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span={24}>
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
                    pageInfo={{
                      total: tableInfo.total,
                      page: tableInfo.page,
                      pageSize: tableInfo.pageSize,
                    }}
                    onChange={handleChangeTable}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </>
  );
}
