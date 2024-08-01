"use client";
import { Col, Divider, Form, Row } from "antd";
import Link from "next/link";
import styled from "styled-components";

import Button from "@/components/Button";
import ResetBtn from "@/components/Button/ResetBtn";
import RangePicker from "@/components/DatePicker/RangePicker";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

import { PATH_PRODUCT_PROMOTION } from "@/constants/paths";

const Card = styled.div`
  background-color: rgba(241, 243, 246, 1);
  padding: 16px;
`;

export default function Page() {
  const [form] = Form.useForm();

  const columns = [
    {
      title: "促銷ID",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "促銷名稱",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "促銷英文名稱",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "起日",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "迄日",
      dataIndex: "e",
      align: "center",
    },
    {
      title: "狀態",
      dataIndex: "f",
      align: "center",
    },
  ];

  const handleFinish = () => {};

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
            onFinish={handleFinish}
          >
            <Card>
              <Row gutter={32}>
                <Col span={8} xxl={{ span: 6 }}>
                  <Form.Item name="" label="促銷ID">
                    <Select placeholder="選擇商品代碼或名稱" />
                  </Form.Item>
                </Col>

                <Col span={8} xxl={{ span: 6 }}>
                  <Form.Item name="" label="日期">
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
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Link href={`${PATH_PRODUCT_PROMOTION}/add`}>
                <Button type="primary">新增促銷方案商品</Button>
              </Link>
            </Col>

            <Col span={24}>
              <Table columns={columns} dataSource={[]} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
}
