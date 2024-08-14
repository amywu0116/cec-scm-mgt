"use client";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { App, Col, Form, Image, Row, Space } from "antd";
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
import ModalPreviewPDP from "../ModalPreviewPDP";

import api from "@/api";
import { PATH_PRODUCT, PATH_PRODUCT_STOCK_SETTINGS } from "@/constants/paths";

export default function Page() {
  const router = useRouter();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({
    table: false,
  });

  const [openModal, setOpenModal] = useState({
    pdpPreview: false,
  });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const [currentProductId, setCurrentProductId] = useState();

  const columns = [
    {
      title: "圖片",
      dataIndex: "productImgUrl",
      align: "center",
      render: (text, record) => {
        if (!text) return "-";
        return (
          <Image
            width={40}
            height={40}
            src={text}
            alt=""
            preview={{
              toolbarRender: (
                _,
                {
                  image: { url },
                  transform: { scale },
                  actions: { onZoomOut, onZoomIn },
                }
              ) => (
                <Space size={12} className="toolbar-wrapper">
                  <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                  <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                </Space>
              ),
            }}
          />
        );
      },
    },
    {
      title: "品名",
      dataIndex: "itemName",
      align: "center",
      render: (text, record) => {
        return <Link href={`${PATH_PRODUCT}/${record.productId}`}>{text}</Link>;
      },
    },
    {
      title: "規格",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        const list = [
          record.variationType1Value,
          record.variationType2Value,
        ].filter(Boolean);
        if (list.length === 0) return "-";
        return list.join(" / ");
      },
    },
    {
      title: "商品編號/條碼",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <div>{record.productnumber}</div>
            <div>{record.itemEan}</div>
          </>
        );
      },
    },
    {
      title: "價格",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        if (record.price === null && record.specialPrice === null) {
          return "-";
        }
        if (record.price !== null && record.specialPrice === null) {
          return <div>NT${record.price}</div>;
        }
        if (record.price !== null && record.specialPrice !== null) {
          return (
            <>
              <div>NT${record.specialPrice}</div>
              <div style={{ textDecoration: "line-through", color: "#ccc" }}>
                NT${record.price}
              </div>
            </>
          );
        }
      },
    },
    {
      title: "庫存",
      dataIndex: "perpetual",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <div>{text ? "不庫控" : record.stock}</div>
            <div>
              <FunctionBtn
                color="green"
                onClick={() => router.push(PATH_PRODUCT_STOCK_SETTINGS)}
              >
                庫存設定
              </FunctionBtn>
            </div>
          </>
        );
      },
    },
    {
      title: "狀態",
      dataIndex: "isPublushed",
      align: "center",
      render: (text, record) => {
        return text ? "上架" : "下架";
      },
    },
    {
      title: "預覽",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        return (
          <FunctionBtn
            onClick={() => {
              setCurrentProductId(record.productId);
              setOpenModal((state) => ({ ...state, pdpPreview: true }));
            }}
          >
            PDP
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

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Form
            form={form}
            autoComplete="off"
            colon={false}
            onFinish={handleFinish}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="productnumber"
                  label="商品ID"
                >
                  <Input placeholder="請輸入商品ID" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="itemEan"
                  label="條碼"
                >
                  <Input placeholder="請輸入條碼" maxLength={13} />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="itemName"
                  label="品名"
                >
                  <Input placeholder="請輸入商品名稱" />
                </Form.Item>
              </Col>

              <Space style={{ marginLeft: "auto" }} size={16}>
                <Button type="secondary" htmlType="submit">
                  查詢
                </Button>

                <ResetBtn htmlType="reset">清除查詢條件</ResetBtn>
              </Space>
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

      <ModalPreviewPDP
        type="product"
        id={currentProductId}
        open={openModal.pdpPreview}
        onCancel={() => {
          setOpenModal((state) => ({ ...state, pdpPreview: false }));
        }}
      />
    </>
  );
}
