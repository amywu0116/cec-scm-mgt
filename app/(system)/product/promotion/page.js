"use client";
import { App, Col, Divider, Flex, Form, Row } from "antd";
import Link from "next/link";
import styled from "styled-components";
import { useState, useEffect } from "react";

import Button from "@/components/Button";
import ResetBtn from "@/components/Button/ResetBtn";
import RangePicker from "@/components/DatePicker/RangePicker";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

import { PATH_PRODUCT_PROMOTION } from "@/constants/paths";
import api from "@/api";

const Card = styled.div`
  background-color: rgba(241, 243, 246, 1);
  padding: 16px;
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({
    table: false,
  });

  const [discountOptions, setDiscountOptions] = useState([]);

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const columns = [
    {
      title: "促銷ID",
      dataIndex: "promotionId",
      align: "center",
    },
    {
      title: "促銷名稱",
      dataIndex: "promotionName",
      align: "center",
    },
    {
      title: "促銷英文名稱",
      dataIndex: "promotionNameEn",
      align: "center",
    },
    {
      title: "起日",
      dataIndex: "startTime",
      align: "center",
    },
    {
      title: "迄日",
      dataIndex: "endTime",
      align: "center",
    },
    {
      title: "狀態",
      dataIndex: "activeStatus",
      align: "center",
      render: (text) => {
        return text ? "啟用" : "禁用";
      },
    },
  ];

  const fetchDiscount = () => {
    api
      .get(`v1/system/option/scmDiscount`)
      .then((res) => setDiscountOptions(res.data))
      .catch((err) => message.error(err.message))
      .finally(() => {});
  };

  const fetchTableInfo = (values) => {
    console.log(values);
    const params = {};

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/vendor_promotion`, { params })
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

  useEffect(() => {
    fetchDiscount();
  }, []);

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>商品促銷</LayoutHeaderTitle>
      </LayoutHeader>

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Form
            form={form}
            colon={false}
            labelCol={{ flex: "80px" }}
            labelWrap
            labelAlign="left"
            requiredMark={false}
            disabled={loading.table}
            onFinish={handleFinish}
          >
            <Card>
              <Row gutter={32}>
                <Col span={8} xxl={{ span: 6 }}>
                  <Form.Item name="promotionId" label="促銷ID">
                    <Select
                      placeholder="選擇商品代碼或名稱"
                      options={discountOptions.map((opt) => {
                        return {
                          ...opt,
                          label: opt.name,
                        };
                      })}
                    />
                  </Form.Item>
                </Col>

                <Col span={8} xxl={{ span: 6 }}>
                  <Form.Item name="time" label="日期">
                    <RangePicker
                      style={{ width: "100%" }}
                      placeholder={["日期起", "日期迄"]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: 0 }} />

              <Row
                style={{ marginTop: 16 }}
                gutter={16}
                justify="end"
                align="middle"
              >
                <Col>
                  <Button type="secondary" htmlType="submit">
                    查詢
                  </Button>
                </Col>

                <Col>
                  <ResetBtn htmlType="reset">清除查詢條件</ResetBtn>
                </Col>
              </Row>
            </Card>
          </Form>
        </Col>

        <Col span={24}>
          <Flex style={{ width: "100%" }} vertical gap={16}>
            <Link href={`${PATH_PRODUCT_PROMOTION}/add`}>
              <Button type="primary">新增促銷方案商品</Button>
            </Link>

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
          </Flex>
        </Col>
      </Row>
    </>
  );
}
