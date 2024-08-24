"use client";
import { App, Breadcrumb, Col, Form, Radio, Row, Space } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";

import api from "@/api";

const SettingsCard = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
  margin-bottom: 16px;
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const router = useRouter();

  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const itemName = searchParams.get("itemName");
  const itemEan = searchParams.get("itemEan");

  const perpetual = Form.useWatch("perpetual", form);

  const [loading, setLoading] = useState({
    table: false,
    tableDelete: false,
    form: false,
  });

  const [showSettings, setShowSettings] = useState(false);

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const [tableDeleteInfo, setTableDeleteInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "日期",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        if (record.stockStartdate && record.stockEnddate) {
          return `${record.stockStartdate} ~ ${record.stockEnddate}`;
        }
        return "-";
      },
    },
    {
      title: "庫存",
      dataIndex: "perpetual",
      align: "center",
      render: (text, record) => {
        return text ? "不庫控" : record.stock;
      },
    },
    {
      title: "已販售量",
      dataIndex: "",
      align: "center",
      render: () => {
        return "-";
      },
    },
    {
      title: "功能",
      dataIndex: "e",
      align: "center",
      render: (text, record, index) => {
        return (
          <FunctionBtn
            loading={loading[`delete_${record.id}`]}
            onClick={() => handleDelete(record.id)}
          >
            刪除
          </FunctionBtn>
        );
      },
    },
  ];

  const columnsDelete = [
    {
      title: "No.",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "刪除日期",
      dataIndex: "deletedAt",
      align: "center",
    },
    {
      title: "修改人",
      dataIndex: "modifyUserName",
      align: "center",
    },
    {
      title: "日期",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        if (record.stockStartdate && record.stockEnddate) {
          return `${record.stockStartdate} ~ ${record.stockEnddate}`;
        }
        return "-";
      },
    },
    {
      title: "庫存",
      dataIndex: "perpetual",
      align: "center",
      render: (text, record) => {
        return text ? "不庫控" : record.stock;
      },
    },
  ];

  const fetchTableInfo = (pagination = { page: 1, pageSize: 10 }) => {
    const params = {
      productId,
      offset: (pagination.page - 1) * pagination.pageSize,
      max: pagination.pageSize,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/product/stock`, { params })
      .then((res) => {
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: pagination.page,
          pageSize: pagination.pageSize,
        }));
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, table: false })));
  };

  const handleChangeTable = (page, pageSize) => {
    fetchTableInfo({ page, pageSize });
  };

  const handleDelete = (stockId) => {
    setLoading((state) => ({ ...state, [`delete_${stockId}`]: true }));
    api
      .delete(`v1/scm/product/stock`, {
        params: { productId, stockId },
      })
      .then((res) => {
        message.success(res.message);
        fetchTableInfo();
        fetchTableDeleteInfo();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, [`delete_${stockId}`]: false }));
      });
  };

  const handleFinish = (values) => {
    const data = {
      perpetual: values.perpetual,
      stock: values.perpetual ? undefined : values.stock,
      stockStartdate: values.perpetual
        ? undefined
        : values.stockDate[0].format("YYYY-MM-DD"),
      stockEnddate: values.perpetual
        ? undefined
        : values.stockDate[1].format("YYYY-MM-DD"),
    };

    setLoading((state) => ({ ...state, form: true }));
    api
      .post(`v1/scm/product/stock?productId=${productId}`, data)
      .then((res) => {
        message.success(res.message);
        fetchTableInfo();
        setShowSettings(false);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, form: false }));
      });
  };

  const fetchTableDeleteInfo = (pagination = { page: 1, pageSize: 10 }) => {
    const params = {
      offset: (pagination.page - 1) * pagination.pageSize,
      max: pagination.pageSize,
      productId,
      isDeleted: true,
    };

    setLoading((state) => ({ ...state, tableDelete: true }));
    api
      .get(`v1/scm/product/stock`, { params })
      .then((res) => {
        setTableDeleteInfo((state) => ({
          ...state,
          ...res.data,
          page: pagination.page,
          pageSize: pagination.pageSize,
        }));
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, tableDelete: false })));
  };

  const handleChangeTableDelete = (page, pageSize) => {
    fetchTableDeleteInfo({ page, pageSize });
  };

  useEffect(() => {
    fetchTableInfo();
    fetchTableDeleteInfo();
  }, []);

  useEffect(() => {
    if (!showSettings) {
      form.resetFields();
    }
  }, [showSettings]);

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>商品列表</LayoutHeaderTitle>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: (
                <Link href="javascript:;" onClick={() => router.back()}>
                  商品列表
                </Link>
              ),
            },
            { title: "庫存設定" },
          ]}
        />
      </LayoutHeader>

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Form colon={false} layout="inline">
            <Form.Item style={{ flex: 1 }} label="條碼">
              <Input placeholder="請輸入條碼" disabled value={itemEan} />
            </Form.Item>

            <Form.Item style={{ flex: 1 }} label="品名">
              <Input placeholder="請輸入商品名稱" disabled value={itemName} />
            </Form.Item>

            <Form.Item style={{ margin: 0 }}>
              <Button
                style={{ width: "100%" }}
                type="primary"
                disabled={showSettings}
                onClick={() => setShowSettings(true)}
              >
                新增庫存設定
              </Button>
            </Form.Item>
          </Form>
        </Col>

        {showSettings && (
          <Col span={24}>
            <SettingsCard>
              <Form
                form={form}
                colon={false}
                layout="inline"
                requiredMark={false}
                autoComplete="off"
                disabled={loading.form}
                onFinish={handleFinish}
              >
                <Form.Item
                  style={{ flex: "0 0 250px" }}
                  name="perpetual"
                  label="庫存"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Radio.Group>
                    <Radio value={true}>不庫控</Radio>
                    <Radio value={false}>活動庫存</Radio>
                  </Radio.Group>
                </Form.Item>

                {perpetual === false && (
                  <>
                    <Form.Item
                      style={{ flex: 1 }}
                      name="stock"
                      label="數量"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Input placeholder="請輸入數量" />
                    </Form.Item>

                    <Form.Item
                      style={{ flex: 1 }}
                      name="stockDate"
                      label="日期"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <RangePicker
                        style={{ width: "100%" }}
                        placeholder={["日期起", "日期迄"]}
                      />
                    </Form.Item>
                  </>
                )}

                <Form.Item style={{ margin: "0 0 0 auto" }}>
                  <Space size={16}>
                    <Button
                      type="secondary"
                      htmlType="submit"
                      disabled={false}
                      loading={loading.form}
                    >
                      確認
                    </Button>

                    <Button onClick={() => setShowSettings(false)}>取消</Button>
                  </Space>
                </Form.Item>
              </Form>
            </SettingsCard>
          </Col>
        )}

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

      <Row style={{ marginTop: 50 }}>
        <Col span={24}>
          <Title>庫存刪除人員記錄</Title>
          <Table
            loading={loading.tableDelete}
            columns={columnsDelete}
            dataSource={tableDeleteInfo.rows}
            pageInfo={{
              total: tableDeleteInfo.total,
              page: tableDeleteInfo.page,
              pageSize: tableDeleteInfo.pageSize,
            }}
            onChange={handleChangeTableDelete}
          />
        </Col>
      </Row>
    </>
  );
}
