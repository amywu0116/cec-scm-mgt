"use client";
import { App, Col, Form, Row } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import ResetBtn from "@/components/Button/ResetBtn";
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

import ModalAddProduct from "./ModalAddProduct";

import api from "@/api";
import { PATH_PRODUCT_PRODUCT_APPLICATION } from "@/constants/paths";
import { useBoundStore } from "@/store";

const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 36px;
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const options = useBoundStore((state) => state.options);
  const applyStatusOptions = options?.apply_status ?? [];

  const [loading, setLoading] = useState({ table: false });
  const [showModalAddType, setShowModalAddType] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const columns = [
    {
      title: "申請日期",
      dataIndex: "createdTime",
      align: "center",
    },
    {
      title: "申請類型",
      dataIndex: "applyTypeName",
      align: "center",
    },
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
        if (!text) return "-";
        return (
          <Link
            href={`${PATH_PRODUCT_PRODUCT_APPLICATION}/edit/${record.applyId}`}
          >
            {text}
          </Link>
        );
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
      title: "審核狀態",
      dataIndex: "applyStatusName",
      align: "center",
    },
    {
      title: "功能",
      dataIndex: "",
      align: "center",
      render: (text, record, index) => {
        return <FunctionBtn color="green">商品相關圖檔維護</FunctionBtn>;
      },
    },
  ];

  const fetchList = (values, pagination = { page: 1, pageSize: 10 }) => {
    const data = {
      applyDateStart: values.applyDate
        ? values.applyDate[0].format("YYYY-MM-DD")
        : undefined,
      applyDateEnd: values.applyDate
        ? values.applyDate[1].format("YYYY-MM-DD")
        : undefined,
      applyStatus: values.applyStatus,
      itemEan: values.itemEan ? values.itemEan : undefined,
      itemName: values.itemName ? values.itemName : undefined,
      offset: (pagination.page - 1) * pagination.pageSize,
      max: pagination.pageSize,
    };

    setSelectedRows([]);
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/product/apply", { params: { ...data } })
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

  const refreshTable = () => {
    fetchList(tableInfo.tableQuery);
    setSelectedRows([]);
  };

  const handleFinish = (values) => {
    fetchList(values);
  };

  const handleChangeTable = (page, pageSize) => {
    fetchList(tableInfo.tableQuery, { page, pageSize });
  };

  // 送審
  const handleApply = () => {
    setLoading((state) => ({ ...state, table: true }));
    api
      .post(`v1/scm/product/apply`, {
        applyIds: selectedRows.map((row) => row.applyId),
      })
      .then(() => {
        message.success("送審成功");
        refreshTable();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  // 刪除
  const handleDeleteApply = () => {
    setLoading((state) => ({ ...state, table: true }));
    api
      .delete(`v1/scm/product/apply`, {
        data: { applyIds: selectedRows.map((row) => row.applyId) },
      })
      .then((res) => {
        message.success(res.message);
        refreshTable();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.href = "/提品匯入範例.xlsx";
    link.download = "提品匯入範例.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>提品申請</LayoutHeaderTitle>

        <Row style={{ marginLeft: "auto" }} gutter={16} justify="end">
          <Col>
            <Button onClick={handleDownloadFile}>提品匯入範例下載</Button>
          </Col>

          <Col>
            <Button type="secondary">提品匯入</Button>
          </Col>

          <Col>
            <Button type="primary" onClick={() => setShowModalAddType(true)}>
              新增提品
            </Button>
          </Col>
        </Row>
      </LayoutHeader>

      <Row>
        <Col span={24}>
          <Form
            form={form}
            autoComplete="off"
            colon={false}
            onFinish={handleFinish}
          >
            <Row>
              <Col span={12}>
                <Form.Item name="applyDate" label="日期">
                  <RangePicker placeholder={["日期起", "日期迄"]} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="itemEan" label="條碼">
                  <Input placeholder="請輸入條碼" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="itemName" label="品名">
                  <Input placeholder="請輸入品名" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item name="applyStatus" label="狀態">
                  <Select
                    placeholder="請選擇狀態"
                    showSearch
                    allowClear
                    options={applyStatusOptions.map((opt) => ({
                      ...opt,
                      label: opt.name,
                    }))}
                  />
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
                    <ResetBtn htmlType="reset">清除查詢條件</ResetBtn>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span={24}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <TableTitle>申請列表</TableTitle>
            </Col>

            {selectedRows.length > 0 && (
              <Col span={24}>
                <Row gutter={16}>
                  <Col>
                    <Button type="default" onClick={handleApply}>
                      送審
                    </Button>
                  </Col>

                  <Col>
                    <Button type="default" onClick={handleDeleteApply}>
                      刪除
                    </Button>
                  </Col>
                </Row>
              </Col>
            )}

            <Col span={24}>
              <Table
                rowKey="applyId"
                loading={loading.table}
                rowSelection={{
                  selectedRowKeys: selectedRows.map((row) => row.applyId),
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedRows(selectedRows);
                  },
                }}
                pageInfo={{
                  total: tableInfo.total,
                  page: tableInfo.page,
                  pageSize: tableInfo.pageSize,
                }}
                columns={columns}
                dataSource={tableInfo.rows}
                onChange={handleChangeTable}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <ModalAddProduct
        open={showModalAddType}
        onCancel={() => setShowModalAddType(false)}
      />
    </>
  );
}
