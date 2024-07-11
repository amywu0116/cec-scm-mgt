"use client";
import { App, Checkbox, Col, Form, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Input from "@/components/Input";
import Table from "@/components/Table";

import api from "@/api";

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
  padding: 16px 0;
`;

export default function BasicInfo() {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [loading, setLoading] = useState({ page: false, table: false });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "使用者姓名",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "帳號",
      dataIndex: "account",
      align: "center",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      align: "center",
    },
    {
      title: "聯絡方式",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "啟用",
      dataIndex: "status",
      align: "center",
      render: (text, record, index) => {
        return <Checkbox disabled checked={text === 1} />;
      },
    },
    {
      title: "備註",
      dataIndex: "remark",
      align: "center",
    },
  ];

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/vendor")
      .then((res) => {
        form.setFieldsValue({ ...res.data });
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const fetchUsers = (pagination = { page: 1, pageSize: 10 }) => {
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/vendor/user", {
        params: {
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
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  const handleChangeTable = (page, pageSize) => {
    fetchUsers({ page, pageSize });
  };

  useEffect(() => {
    fetchInfo();
    fetchUsers({ page: 1, pageSize: 10 });
  }, []);

  return (
    <Spin spinning={loading.page}>
      <Form
        form={form}
        colon={false}
        labelCol={{ flex: "60px" }}
        labelWrap
        disabled
      >
        <Row>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <Title>基礎資料</Title>
              </Col>

              <Col span={24}>
                <Row gutter={32}>
                  <Col span={8}>
                    <Form.Item name="p4VendorCode" label="P4供應商代碼">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="sapVendorCode" label="SAP供應商代碼">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row gutter={32}>
                  <Col span={8}>
                    <Form.Item name="vendorName" label="供應商名稱">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="companyAlias" label="供應商簡稱">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="taxId" label="統一編號">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row gutter={32}>
                  <Col span={8}>
                    <Form.Item name="companyContact" label="供應商代表號">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={16}>
                    <Form.Item name="vendorAddress" label="供應商地址">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row>
              <Col span={24}>
                <Title>人員聯絡方式</Title>
              </Col>

              <Col span={24}>
                <Row gutter={32}>
                  <Col span={8}>
                    <Form.Item name="businessContact" label="業務承辦人">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="businessPhone" label="業務聯絡電話">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="businessEmail" label="業務E-mai">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row gutter={32}>
                  <Col span={8}>
                    <Form.Item name="financeContact" label="財務承辦人">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="financePhone" label="財務聯絡電話">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="financeEmail" label="財務E-mai">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row gutter={32}>
                  <Col span={8}>
                    <Form.Item name="shipContact" label="出貨承辦人">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="shipPhone" label="出貨聯絡電話">
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="shipEmail" label="出貨E-mail">
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Title>使用者帳號</Title>
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
      </Form>
    </Spin>
  );
}
