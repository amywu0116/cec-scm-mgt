"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { App, Form } from "antd";
import dayjs from "dayjs";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select, { SelectOption } from "@/components/Select";
import Table from "@/components/Table";
import Input from "@/components/Input";
import FunctionBtn from "@/components/Button/FunctionBtn";

import ModalAddProduct from "./ModalAddProduct";

import api from "@/api";
import { useBoundStore } from "@/store";

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

const BtnGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Card = styled.div`
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

const Page = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const dateFormat = "YYYY/MM/DD";

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
    setSelectedRows([]);
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/product/apply", {
        params: {
          applyDateStart: values.applyDateStart
            ? dayjs(values.applyDateStart.$d).format(dateFormat)
            : undefined,
          applyDateEnd: values.applyDateEnd
            ? dayjs(values.applyDateEnd.$d).format(dateFormat)
            : undefined,
          applyStatus: values.applyStatus,
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
        }));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading((state) => ({ ...state, table: false })));
  };

  const refreshTable = () => {
    const formValues = form.getFieldsValue(true);
    fetchList(formValues);
    setSelectedRows([]);
  };

  const handleFinish = (values) => {
    fetchList(values);
  };

  // 切換分頁、分頁大小
  const handleChangeTable = (page, pageSize) => {
    const formValues = form.getFieldsValue(true);
    fetchList(formValues, { page, pageSize });
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
      .catch((err) => message.error(err))
      .finally(() => setLoading((state) => ({ ...state, table: false })));
  };

  // 刪除
  const handleDeleteApply = () => {
    setLoading((state) => ({ ...state, table: true }));
    api
      .delete(`v1/scm/product/apply`, {
        data: { applyIds: selectedRows.map((row) => row.applyId) },
      })
      .then((res) => {
        if (res.message !== "200") {
          message.error(res.data);
        } else {
          message.success(res.data);
          refreshTable();
        }
      })
      .catch((err) => message.error(err))
      .finally(() => setLoading((state) => ({ ...state, table: false })));
  };

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
        <Form form={form} onFinish={handleFinish}>
          <Card>
            <Row>
              <Item>
                <ItemLabel>日期</ItemLabel>
                <Form.Item name="applyDateStart" style={{ margin: 0 }}>
                  <DatePicker
                    style={{ width: 203 }}
                    placeholder="日期起"
                    format="YYYY/MM/DD"
                  />
                </Form.Item>

                <div style={{ width: 42, textAlign: "center" }}>-</div>

                <Form.Item name="applyDateEnd" style={{ margin: 0 }}>
                  <DatePicker
                    style={{ width: 203 }}
                    placeholder="日期迄"
                    format="YYYY/MM/DD"
                  />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>條碼</ItemLabel>
                <Form.Item name="itemEan" style={{ margin: 0 }}>
                  <Input style={{ width: 203 }} placeholder="請輸入條碼" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>品名</ItemLabel>
                <Form.Item name="itemName" style={{ margin: 0 }}>
                  <Input style={{ width: 203 }} placeholder="請輸入商品名稱" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>狀態</ItemLabel>
                <Form.Item name="applyStatus" style={{ margin: 0 }}>
                  <Select style={{ width: 203 }} placeholder="請選擇狀態">
                    {applyStatusOptions.map((opt, idx) => {
                      return (
                        <SelectOption key={idx} value={opt.value}>
                          {opt.name}
                        </SelectOption>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Item>

              <BtnGroup
                style={{ marginLeft: "auto" }}
                justifyContent="flex-end"
              >
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
          <TableTitle>申請列表</TableTitle>

          {selectedRows.length > 0 && (
            <BtnGroup>
              <Button type="default" onClick={handleApply}>
                送審
              </Button>

              <Button type="default" onClick={handleDeleteApply}>
                刪除
              </Button>
            </BtnGroup>
          )}

          <Table
            rowKey="applyId"
            loading={loading.table}
            rowSelection={{
              selectedRowKeys: selectedRows.map((row) => row.applyId),
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRows(selectedRows);
              },
              getCheckboxProps: (record) => ({
                disabled: record.name === "Disabled User",
                name: record.name,
              }),
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
        </TableWrapper>
      </Container>

      <ModalAddProduct
        open={showModalAddType}
        onCancel={() => setShowModalAddType(false)}
      />
    </>
  );
};

export default Page;
