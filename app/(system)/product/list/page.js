"use client";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { App, Col, Flex, Form, Image, Row, Space } from "antd";
import fileDownload from "js-file-download";
import Link from "next/link";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import ResetBtn from "@/components/Button/ResetBtn";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";
import ModalPreviewPDP from "../ModalPreviewPDP";

import api from "@/api";
import { PATH_PRODUCT, PATH_PRODUCT_STOCK_SETTINGS } from "@/constants/paths";
import updateQuery from "@/utils/updateQuery";

const Container = styled.div``;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    productnumber: parseAsString,
    itemEan: parseAsString,
    itemName: parseAsString,
    isPublushed: parseAsBoolean,
  });

  const [loading, setLoading] = useState({
    table: false,
    export: false,
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
        if ([null, undefined].includes(text)) return "-";
        return <Link href={`${PATH_PRODUCT}/${record.productId}`}>{text}</Link>;
      },
    },
    {
      title: "規格",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        let variationText = "";
        const list = [
          record.variationType1Value,
          record.variationType2Value,
        ].filter(Boolean);

        if (list.length === 0) {
          variationText = "-";
        } else {
          variationText = list.join(" / ");
        }

        return (
          <div>
            <div>{record.itemSpec ?? "-"}</div>
            <div>{variationText}</div>
          </div>
        );
      },
    },
    {
      title: "商品編號/條碼",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <div>{record.productnumber ?? "-"}</div>
            <div>{record.itemEan ?? "-"}</div>
          </>
        );
      },
    },
    {
      title: "價格",
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
            <Link
              href={{
                pathname: `${PATH_PRODUCT_STOCK_SETTINGS}`,
                query: {
                  productId: record.productId,
                  itemName: record.itemName,
                  productNumber: record.productnumber,
                },
              }}
            >
              <FunctionBtn color="green" disabled={record.isMainVariation}>
                庫存設定
              </FunctionBtn>
            </Link>
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

  const transformParams = (values) => {
    const params = {
      productnumber: values.productnumber ? values.productnumber : undefined,
      itemEan: values.itemEan ? values.itemEan : undefined,
      itemName: values.itemName ? values.itemName : undefined,
      isPublushed: values.isPublushed,
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
    };

    return params;
  };

  const fetchList = (values) => {
    updateQuery(values, setQuery);
    const newParams = transformParams(values);
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/product", { params: newParams })
      .then((res) => {
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: values.page,
          pageSize: values.pageSize,
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
    fetchList({ ...values, page: 1, pageSize: 10 });
  };

  const handleChangeTable = (page, pageSize) => {
    fetchList({ ...tableInfo.tableQuery, page, pageSize });
  };

  // 商品清單匯出
  const handleExport = () => {
    const newParams = transformParams(form.getFieldsValue());
    delete newParams.max;
    delete newParams.offset;
    setLoading((state) => ({ ...state, export: true }));
    api
      .get(`v1/scm/product/search/export`, {
        params: newParams,
        responseType: "arraybuffer",
      })
      .then((res) => fileDownload(res, "商品清單.xlsx"))
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, export: false })));
  };

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchList(query);
    form.setFieldsValue({
      productnumber: query.productnumber,
      itemEan: query.itemEan,
      itemName: query.itemName,
      isPublushed: query.isPublushed,
    });
  }, []);

  return (
    <Container>
      <LayoutHeader>
        <LayoutHeaderTitle>商品列表</LayoutHeaderTitle>
      </LayoutHeader>

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Form
            form={form}
            autoComplete="off"
            labelWrap
            labelCol={{ flex: "80px" }}
            colon={false}
            disabled={loading.table}
            onFinish={handleFinish}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="productnumber" label="商城商品編號">
                  <Input placeholder="請輸入商城商品編號" />
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
                <Form.Item>
                  <Flex gap={16} align="center">
                    <Button
                      style={{ marginLeft: "auto" }}
                      type="secondary"
                      loading={loading.table}
                      disabled={false}
                      htmlType="submit"
                    >
                      查詢
                    </Button>

                    <ResetBtn htmlType="reset">清除查詢條件</ResetBtn>
                  </Flex>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="isPublushed" label="上下架狀態">
                  <Select
                    placeholder="請選擇上下架狀態"
                    showSearch
                    allowClear
                    options={[
                      { label: "上架", value: true },
                      { label: "下架", value: false },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span={24}>
          <Flex gap={16}>
            <Button
              type="secondary"
              loading={loading.export}
              onClick={handleExport}
            >
              商品清單匯出
            </Button>
          </Flex>
        </Col>

        <Col span={24}>
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
    </Container>
  );
}
