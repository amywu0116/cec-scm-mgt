"use client";
import { MoreOutlined } from "@ant-design/icons";
import { App, Breadcrumb, Col, Dropdown, Flex, Form, Radio, Row } from "antd";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";

import ModalHistory from "./ModalHistory";
import ModalMessage from "./ModalMessage";

import api from "@/api";
import updateQuery from "@/utils/updateQuery";

const Container = styled.div`
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
  background-color: #f1f3f6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const DropdownWrapper = styled.div`
  width: 160px;
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
`;

const DropdownItem = styled.div`
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: 0.2s all;

  &:hover {
    background-color: rgba(233, 246, 254, 1);
    color: rgba(23, 119, 255, 1);
  }
`;

export default function Page() {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    ecorderNo: parseAsString,
    status: parseAsInteger,
  });

  const [openDropdown, setOpenDropdown] = useState({});

  const [openModal, setOpenModal] = useState({
    message: false,
    history: false,
  });

  const [loading, setLoading] = useState({
    table: false,
  });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const [rowInfo, setRowInfo] = useState({});

  const columns = [
    {
      title: "訂單編號",
      dataIndex: "ecorderNo",
      align: "center",
    },
    {
      title: "提問時間",
      dataIndex: "questionTime",
      align: "center",
    },
    {
      title: "問題類別",
      dataIndex: "questionCategory",
      align: "center",
    },
    {
      title: "提問內容",
      dataIndex: "questionContent",
      align: "center",
    },
    {
      title: "狀態",
      dataIndex: "statusStr",
      align: "center",
    },
    {
      title: "操作",
      dataIndex: "showOperate",
      align: "center",
      render: (text, record) => {
        if (!text) return "-";
        return (
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                { key: "1", label: "回覆訊息內容" },
                { key: "2", label: "歷程查詢" },
              ],
            }}
            open={openDropdown[record.serviceId]}
            dropdownRender={(menus) => {
              return (
                <DropdownWrapper>
                  {menus.props.items.map((item) => {
                    return (
                      <DropdownItem
                        key={item.key}
                        onClick={() => {
                          setRowInfo(record);
                          setOpenDropdown((state) => ({
                            ...state,
                            [record.id]: false,
                          }));

                          if (item.key === "1") {
                            setOpenModal((state) => ({
                              ...state,
                              message: true,
                            }));
                          }

                          if (item.key === "2") {
                            setOpenModal((state) => ({
                              ...state,
                              history: true,
                            }));
                          }
                        }}
                      >
                        {item.label}
                      </DropdownItem>
                    );
                  })}
                </DropdownWrapper>
              );
            }}
            onOpenChange={(nextOpen, info) => {
              if (info.source === "trigger" || nextOpen) {
                setOpenDropdown((state) => ({
                  ...state,
                  [record.id]: nextOpen,
                }));
              }
            }}
          >
            <Button
              type="link"
              size="large"
              icon={<MoreOutlined style={{ fontSize: 30 }} />}
            />
          </Dropdown>
        );
      },
    },
  ];

  const fetchTableInfo = (values) => {
    updateQuery(values, setQuery);
    const params = {
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
      ecorderNo: values.ecorderNo,
      status: values.status,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/consultation`, { params })
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

  const handleSendSuccess = () => {
    form.submit();
  };

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchTableInfo(query);
    form.setFieldsValue({
      ecorderNo: query.ecorderNo,
      status: query.status ?? null,
    });
  }, []);

  return (
    <Container>
      <LayoutHeader>
        <LayoutHeaderTitle>顧客訂單諮詢</LayoutHeaderTitle>
        <Breadcrumb
          separator=">"
          items={[{ title: "公告與訂單諮詢" }, { title: "顧客訂單諮詢" }]}
        />
      </LayoutHeader>

      <Flex vertical gap={16}>
        <Form
          form={form}
          colon={false}
          labelCol={{ flex: "80px" }}
          labelWrap
          requiredMark={false}
          disabled={loading.table}
          autoComplete="off"
          initialValues={{
            status: 0,
          }}
          onFinish={handleFinish}
        >
          <Card>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  style={{ margin: 0 }}
                  name="ecorderNo"
                  label="訂單編號"
                >
                  <Input placeholder="輸入訂單編號" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item style={{ margin: 0 }} name="status" label="狀態">
                  <Radio.Group>
                    <Radio value={null}>全部</Radio>
                    <Radio value={0}>未結案</Radio>
                    <Radio value={1}>已結案</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>

              <Col style={{ marginLeft: "auto" }} span={6}>
                <Flex justify="flex-end" gap={16}>
                  <Button
                    type="secondary"
                    htmlType="submit"
                    disabled={false}
                    loading={loading.table}
                  >
                    查詢
                  </Button>

                  <Button type="link" htmlType="reset">
                    清除查詢條件
                  </Button>
                </Flex>
              </Col>
            </Row>
          </Card>
        </Form>

        <Table
          rowKey="serviceId"
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

      <ModalMessage
        open={openModal.message}
        rowInfo={rowInfo}
        onOk={handleSendSuccess}
        onCancel={() => setOpenModal((state) => ({ ...state, message: false }))}
      />

      <ModalHistory
        open={openModal.history}
        rowInfo={rowInfo}
        onCancel={() => setOpenModal((state) => ({ ...state, history: false }))}
      />
    </Container>
  );
}
