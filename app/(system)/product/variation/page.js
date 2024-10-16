"use client";
import { App, Col, Flex, Form, Row } from "antd";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import ResetBtn from "@/components/Button/ResetBtn";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import ModalConfirm from "@/components/Modal/ModalConfirm";
import Table from "@/components/Table";

import api from "@/api";
import { routes } from "@/routes";
import updateQuery from "@/utils/updateQuery";

const Container = styled.div``;

const Card = styled.div`
  background-color: rgba(241, 243, 246, 1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    mainProductId: parseAsString,
    itemName: parseAsString,
  });

  const [loading, setLoading] = useState({
    table: false,
    delete: false,
  });

  const [openModal, setOpenModal] = useState({
    delete: false,
  });

  const [deleteId, setDeleteId] = useState();

  const [tableInfo, setTableInfo] = useState({
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
      title: "主商品編號",
      dataIndex: "mainProductId",
      align: "center",
    },
    {
      title: "主商品名稱",
      dataIndex: "itemName",
      align: "center",
      render: (text, record) => {
        return (
          <Link href={routes.product.variationEdit(record.id)}>{text}</Link>
        );
      },
    },
    {
      title: "多規類型(一)",
      dataIndex: "variationAttributeId1",
      align: "center",
    },
    {
      title: "多規類型(二)",
      dataIndex: "variationAttributeId2",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "功能",
      align: "center",
      render: (text, record, index) => {
        return (
          <FunctionBtn
            loading={loading[`delete_${record.id}`]}
            onClick={() => {
              setDeleteId(record.id);
              setOpenModal((state) => ({ ...state, delete: true }));
            }}
          >
            刪除
          </FunctionBtn>
        );
      },
    },
  ];

  const fetchTableInfo = (values) => {
    updateQuery(values, setQuery);
    const params = {
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
      mainProductId: values.mainProductId,
      itemName: values.itemName,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/variation`, { params })
      .then((res) => {
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: values.page,
          pageSize: values.pageSize,
          tableQuery: { ...values },
        }));
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, table: false })));
  };

  const handleFinish = (values) => {
    fetchTableInfo({ ...values, page: 1, pageSize: 10 });
  };

  const handleChangeTable = (page, pageSize) => {
    fetchTableInfo({ ...tableInfo.tableQuery, page, pageSize });
  };

  const handleDelete = () => {
    const params = {
      variationIds: deleteId,
    };

    setLoading((state) => ({ ...state, delete: true }));
    api
      .delete(`v1/scm/variation`, { params })
      .then((res) => {
        message.success(res.message);
        setOpenModal((state) => ({ ...state, delete: false }));
        form.submit();
      })
      .catch((err) => message.error(err.message))
      .finally(() => {
        setLoading((state) => ({ ...state, delete: false }));
        setDeleteId(undefined);
      });
  };

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchTableInfo(query);
    form.setFieldsValue({
      mainProductId: query.mainProductId,
      itemName: query.itemName,
    });
  }, []);

  return (
    <Container>
      <LayoutHeader>
        <LayoutHeaderTitle>樣式商品</LayoutHeaderTitle>
      </LayoutHeader>

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Form
            form={form}
            colon={false}
            labelCol={{ flex: "100px" }}
            labelWrap
            requiredMark={false}
            autoComplete="off"
            disabled={loading.table}
            onFinish={handleFinish}
          >
            <Card>
              <Row gutter={32}>
                <Col span={8}>
                  <Form.Item
                    style={{ margin: 0 }}
                    name="mainProductId"
                    label="主商品編號"
                  >
                    <Input placeholder="請輸入主商品編號" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    style={{ margin: 0 }}
                    name="itemName"
                    label="主商品名稱"
                  >
                    <Input placeholder="請輸入主商品名稱" />
                  </Form.Item>
                </Col>

                <Col style={{ marginLeft: "auto" }}>
                  <Flex gap={16} align="center">
                    <Button type="secondary" htmlType="submit">
                      查詢
                    </Button>

                    <ResetBtn htmlType="reset">清除查詢條件</ResetBtn>
                  </Flex>
                </Col>
              </Row>
            </Card>
          </Form>
        </Col>

        <Col span={24}>
          <Flex style={{ width: "100%" }} vertical gap={16}>
            <div>
              <Link href={routes.product.variationAdd}>
                <Button type="primary">新增樣式商品</Button>
              </Link>
            </div>

            <Table
              rowKey="id"
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
          </Flex>
        </Col>
      </Row>

      <ModalConfirm
        open={openModal.delete}
        loading={loading.delete}
        title="刪除樣式商品"
        subtitle="確定要刪除樣式商品？"
        onOk={handleDelete}
        onCancel={() => setOpenModal((state) => ({ ...state, delete: false }))}
      />
    </Container>
  );
}
