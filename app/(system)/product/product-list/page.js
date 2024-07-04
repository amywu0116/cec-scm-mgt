"use client";
import { Form } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";
import Tabs from "@/components/Tabs";

import api from "@/api";
import { PATH_PRODUCT, PATH_PRODUCT_STOCK_SETTINGS } from "@/constants/paths";

const Container = styled.div`
  display: flex;
  flex-direction: column;

  .ant-form-item {
    .ant-form-item-label > label {
      width: 100%;
      height: 100%;
      font-size: 14px;
      font-weight: 700;
      color: #7b8093;
    }
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
  gap: 0 16px;
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
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
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
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/product", {
        params: {
          itemEan: values.itemEan ? values.itemEan : undefined,
          itemName: values.itemName ? values.itemName : undefined,
          offset: (pagination.page - 1) * pagination.pageSize,
          max: pagination.pageSize,
        },
      })
      .then((res) =>
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: pagination.page,
          pageSize: pagination.pageSize,
        }))
      )
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
        <Form
          form={form}
          autoComplete="off"
          colon={false}
          onFinish={handleFinish}
        >
          <Card>
            <Form.Item style={{ flex: 1 }} name="itemEan" label="條碼">
              <Input placeholder="請輸入條碼" />
            </Form.Item>

            <Form.Item style={{ flex: 1 }} name="itemName" label="品名">
              <Input placeholder="請輸入商品名稱" />
            </Form.Item>

            <BtnGroup style={{ marginLeft: "auto" }}>
              <Button type="secondary" htmlType="submit">
                查詢
              </Button>

              <Button type="link" htmlType="reset">
                清除查詢條件
              </Button>
            </BtnGroup>
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
                    onRow={(record, index) => {
                      return {
                        onClick: (e) => {
                          if (e.target.className.includes("ant-table-cell")) {
                            router.push(`${PATH_PRODUCT}/${record.productId}`);
                          }
                        },
                      };
                    }}
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
        </TableWrapper>
      </Container>
    </>
  );
};

export default Page;
