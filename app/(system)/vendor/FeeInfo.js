"use client";
import { App, Col, Form, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Input from "@/components/Input";

import api from "@/api";

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
  padding: 16px 0;
`;

export default function FeeInfo() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({ page: false });

  const fetchFee = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/vendor/fee")
      .then((res) => {
        const { maintainFee, referFee, bonusFee } = res.data;

        form.setFieldsValue({
          ...res.data,
          maintainFee: maintainFee ? `${maintainFee}%` : "",
          referFee: referFee ? `${referFee}%` : "",
          bonusFee: bonusFee ? `${bonusFee}%` : "",
        });
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  useEffect(() => {
    fetchFee();
  }, []);

  return (
    <Spin spinning={loading.page}>
      <Form
        form={form}
        colon={false}
        disabled
        labelCol={{ flex: "100px" }}
        labelWrap
        labelAlign="left"
        requiredMark={false}
      >
        <Row>
          <Col span={24}>
            <Title>供應商商城費用</Title>
          </Col>

          <Col span={24}>
            <Row gutter={32}>
              <Col span={8} xxl={{ span: 6 }}>
                <Form.Item name="maintainFee" label="系統維護費">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8} xxl={{ span: 6 }}>
                <Form.Item name="referFee" label="行銷導流費">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row gutter={32}>
              <Col span={8} xxl={{ span: 6 }}>
                <Form.Item name="bonusFee" label="會員紅利費">
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}
