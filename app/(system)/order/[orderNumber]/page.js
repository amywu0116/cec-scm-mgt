"use client";
import { App, Breadcrumb, Col, Form, Row } from "antd";
import Link from "next/link";
import { useState } from "react";
import styled, { css } from "styled-components";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TextArea from "@/components/TextArea";

import ModalAddress from "./ModalAddress";
import ModalReturnApproval from "./ModalReturnApproval";
import ModalReturnResult from "./ModalReturnResult";

import { PATH_ORDER_LIST } from "@/constants/paths";

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 16px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
`;

const Tag = styled.div`
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  padding: 2px 6px;
  width: fit-content;

  ${(props) =>
    props.color === "blue" &&
    css`
      color: #006c9c;
      background-color: #00b8d914;
    `}

  ${(props) =>
    props.color === "green" &&
    css`
      color: #118d57;
      background-color: #22c55e14;
    `}

    ${(props) =>
    props.color === "red" &&
    css`
      color: #b71d18;
      background-color: #ff563014;
    `}

    ${(props) =>
    props.color === "grey" &&
    css`
      color: rgba(33, 43, 54, 1);
      background-color: rgba(145, 158, 171, 0.08);
    `}
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [showModalAddress, setShowModalAddress] = useState(false);
  const [showModalReturn, setShowModalReturn] = useState(false);
  const [showModalReturnApproval, setShowModalReturnApproval] = useState(false);

  // 收到訂單, 配送中, 異常, 訂單完成, 訂單取消, 退貨申請, 退貨收貨, 退貨收貨完成
  const status = "收到訂單";

  const columns = [
    {
      title: "商品編號",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "商品名稱",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "規格",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "廠商科號",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "單價",
      dataIndex: "e",
      align: "center",
    },
    {
      title: "訂購量",
      dataIndex: "f",
      align: "center",
    },
    {
      title: "小計",
      dataIndex: "g",
      align: "center",
    },
    {
      title: "出貨量",
      dataIndex: "h",
      align: "center",
      render: () => {
        return <Input style={{ width: 80, textAlign: "center" }} />;
      },
    },
  ];

  const data = [
    {
      a: "44946637",
      b: "輝夜三芯手感美腿機",
      c: "1PC台 x 1",
      d: "331550530101",
      e: "10999",
      f: "1",
      g: "10999",
      h: "1",
    },
    {
      a: "44946637",
      b: "輝夜三芯手感美腿機",
      c: "1PC台 x 1",
      d: "331550530101",
      e: "10999",
      f: "1",
      g: "10999",
      h: "1",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>訂單資料</LayoutHeaderTitle>
        <Breadcrumb
          separator=">"
          items={[
            { title: "訂單" },
            { title: <Link href={PATH_ORDER_LIST}>訂單管理</Link> },
            { title: "訂單明細" },
          ]}
        />

        <Row style={{ marginLeft: "auto" }} gutter={16}>
          {["配送中", "異常"].includes(status) && (
            <Col>
              <Button type="secondary">拒收</Button>
            </Col>
          )}

          {["配送中"].includes(status) && (
            <Col>
              <Button type="secondary">異常</Button>
            </Col>
          )}

          {["配送中", "異常"].includes(status) && (
            <Col>
              <Button type="primary">已送達</Button>
            </Col>
          )}

          {["退貨收貨"].includes(status) && (
            <Col>
              <Button type="primary" onClick={() => setShowModalReturn(true)}>
                設定退貨結果
              </Button>
            </Col>
          )}

          {["退貨收貨完成"].includes(status) && (
            <Col>
              <Button
                type="primary"
                onClick={() => setShowModalReturnApproval(true)}
              >
                設定退貨核可
              </Button>
            </Col>
          )}
        </Row>
      </LayoutHeader>

      <Form form={form} colon={false} labelCol={{ flex: "80px" }} labelWrap>
        <Row>
          <Col span={24}>
            <TitleWrapper>
              <Title>基礎資料</Title>
            </TitleWrapper>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="" label="派工日期">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="" label="派工單號">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="" label="訂單狀態">
                  <Tag color="blue">{status}</Tag>
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <TitleWrapper>
              <Title>顧客配送信息</Title>

              {["收到訂單"].includes(status) && (
                <Button
                  style={{ marginLeft: "auto" }}
                  type="secondary"
                  onClick={() => setShowModalAddress(true)}
                >
                  修改配送地址
                </Button>
              )}
            </TitleWrapper>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="" label="姓名">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="" label="手機號碼">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="" label="市話">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="" label="地址">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="" label="訂單備註">
                  <TextArea autoSize={{ minRows: 3, maxRows: 3 }} disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="" label="地址備註">
                  <TextArea autoSize={{ minRows: 3, maxRows: 3 }} disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="" label="電梯">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="" label="簽收">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <TitleWrapper>
              <Title>出貨設定</Title>

              {["訂單取消"].includes(status) && (
                <Tag style={{ marginLeft: 16 }} color="grey">
                  拒收
                </Tag>
              )}

              <Row style={{ marginLeft: "auto" }} gutter={16}>
                {["收到訂單"].includes(status) && (
                  <Col>
                    <Button type="secondary">銷貨明細列印</Button>
                  </Col>
                )}

                {["收到訂單"].includes(status) && (
                  <Col>
                    <Button type="secondary">出貨</Button>
                  </Col>
                )}

                {["退貨申請"].includes(status) && (
                  <Col>
                    <Button type="secondary">退貨收回</Button>
                  </Col>
                )}
              </Row>
            </TitleWrapper>
          </Col>

          <Col span={24}>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="" label="貨運公司">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="請選擇貨運公司"
                    options={[]}
                    disabled={[
                      "配送中",
                      "異常",
                      "訂單完成",
                      "退貨收貨",
                      "退貨收貨完成",
                    ].includes(status)}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="" label="配送單號">
                  <Input
                    placeholder="填寫配送單號"
                    disabled={[
                      "配送中",
                      "異常",
                      "訂單完成",
                      "退貨收貨",
                      "退貨收貨完成",
                    ].includes(status)}
                  />
                </Form.Item>
              </Col>
            </Row>

            {["收到訂單", "配送中", "異常", "訂單完成", "訂單取消"].includes(
              status
            ) && (
              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item name="" label="發票號碼">
                    <Input
                      placeholder="填寫發票號碼"
                      disabled={["配送中", "異常", "訂單完成"].includes(status)}
                    />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="" label="發票開立日期">
                    <DatePicker
                      style={{ width: "100%" }}
                      placeholder="填寫發票開立日期"
                      disabled={["配送中", "異常", "訂單完成"].includes(status)}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            {["收到訂單", "配送中", "異常", "訂單完成", "訂單取消"].includes(
              status
            ) && (
              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item name="" label="包材重量">
                    <Input
                      placeholder="填寫包材重量"
                      disabled={["配送中", "異常", "訂單完成"].includes(status)}
                      suffix="克"
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Col>

          <Col span={24}>
            <Table dataSource={data} columns={columns} pagination={false} />
          </Col>
        </Row>
      </Form>

      <ModalAddress
        open={showModalAddress}
        onOk={() => {}}
        onCancel={() => setShowModalAddress(false)}
      />

      <ModalReturnResult
        open={showModalReturn}
        onOk={() => {}}
        onCancel={() => setShowModalReturn(false)}
      />

      <ModalReturnApproval
        open={showModalReturnApproval}
        onOk={() => {}}
        onCancel={() => setShowModalReturnApproval(false)}
      />
    </>
  );
}
