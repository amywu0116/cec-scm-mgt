"use client";
import React, { useState } from "react";
import { Breadcrumb } from "antd";
import styled, { css } from "styled-components";
import Link from "next/link";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TextArea from "@/components/TextArea";

import ModalAddress from "./ModalAddress";
import ModalReturnResult from "./ModalReturnResult";
import ModalReturnApproval from "./ModalReturnApproval";

import { PATH_ORDER } from "@/constants/paths";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
`;

const Item = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7b8093;
  width: 64px;
  flex-shrink: 0;
`;

const Row = styled.div`
  display: flex;
  gap: 0 32px;
`;

const ButtonGroup = styled.div`
  margin-left: auto;
  display: flex;
  gap: 0 16px;
`;

const Tag = styled.div`
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  min-width: 75px;
  padding: 2px 6px;

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

const Page = (props) => {
  const [showModalAddress, setShowModalAddress] = useState(false);
  const [showModalReturn, setShowModalReturn] = useState(false);
  const [showModalReturnApproval, setShowModalReturnApproval] = useState(false);

  // 收到訂單, 配送中, 異常, 訂單完成, 訂單取消, 退貨申請, 退貨收貨, 退貨收貨完成
  const status = "退貨收貨完成";

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
            {
              title: "訂單",
            },
            {
              title: <Link href={PATH_ORDER}>訂單管理</Link>,
            },
            {
              title: "訂單明細",
            },
          ]}
        />

        <ButtonGroup>
          {["配送中", "異常"].includes(status) && (
            <Button type="secondary">拒收</Button>
          )}

          {["配送中"].includes(status) && (
            <Button type="secondary">異常</Button>
          )}

          {["配送中", "異常"].includes(status) && (
            <Button type="primary">已送達</Button>
          )}

          {["退貨收貨"].includes(status) && (
            <Button type="primary" onClick={() => setShowModalReturn(true)}>
              設定退貨結果
            </Button>
          )}

          {["退貨收貨完成"].includes(status) && (
            <Button
              type="primary"
              onClick={() => setShowModalReturnApproval(true)}
            >
              設定退貨核可
            </Button>
          )}
        </ButtonGroup>
      </LayoutHeader>

      <Container>
        <Wrapper>
          <Title>基礎資料</Title>

          <Row>
            <Item>
              <ItemLabel>派工日期</ItemLabel>
              <Input disabled />
            </Item>

            <Item>
              <ItemLabel>派工單號</ItemLabel>
              <Input disabled />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>訂單狀態</ItemLabel>
              <Tag color="blue">{status}</Tag>
            </Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <TitleWrapper>
            <Title>顧客配送信息</Title>
            <ButtonGroup>
              {["收到訂單"].includes(status) && (
                <Button
                  type="secondary"
                  onClick={() => setShowModalAddress(true)}
                >
                  修改配送地址
                </Button>
              )}
            </ButtonGroup>
          </TitleWrapper>

          <Row>
            <Item>
              <ItemLabel>姓名</ItemLabel>
              <Input disabled />
            </Item>

            <Item>
              <ItemLabel>手機號碼</ItemLabel>
              <Input disabled />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>市話</ItemLabel>
              <Input disabled />
            </Item>

            <Item>
              <ItemLabel>地址</ItemLabel>
              <Input disabled />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>訂單備註</ItemLabel>
              <TextArea
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled
              />
            </Item>

            <Item>
              <ItemLabel>地址備註</ItemLabel>
              <TextArea
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
                disabled
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>電梯</ItemLabel>
              <Input disabled />
            </Item>

            <Item>
              <ItemLabel>簽收</ItemLabel>
              <Input disabled />
            </Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <TitleWrapper>
            <Title>出貨設定</Title>

            {["訂單取消"].includes(status) && (
              <Tag style={{ marginLeft: 16 }} color="grey">
                拒收
              </Tag>
            )}

            <ButtonGroup>
              {["收到訂單"].includes(status) && (
                <Button type="secondary">銷貨明細列印</Button>
              )}

              {["收到訂單"].includes(status) && (
                <Button type="secondary">出貨</Button>
              )}

              {["退貨申請"].includes(status) && (
                <Button type="secondary">退貨收回</Button>
              )}
            </ButtonGroup>
          </TitleWrapper>
        </Wrapper>

        <Wrapper>
          <Row>
            <Item>
              <ItemLabel>貨運公司</ItemLabel>
              <Select
                style={{ width: "100%" }}
                placeholder="請選擇貨運公司"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
                disabled={[
                  "配送中",
                  "異常",
                  "訂單完成",
                  "退貨收貨",
                  "退貨收貨完成",
                ].includes(status)}
              />
            </Item>

            <Item>
              <ItemLabel>配送單號</ItemLabel>
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
            </Item>
          </Row>

          {["收到訂單", "配送中", "異常", "訂單完成", "訂單取消"].includes(
            status
          ) && (
            <Row>
              <Item>
                <ItemLabel>發票號碼</ItemLabel>
                <Input
                  placeholder="填寫發票號碼"
                  disabled={["配送中", "異常", "訂單完成"].includes(status)}
                />
              </Item>

              <Item>
                <ItemLabel>發票開立日期</ItemLabel>
                <Input
                  placeholder="填寫發票開立日期"
                  disabled={["配送中", "異常", "訂單完成"].includes(status)}
                />
              </Item>
            </Row>
          )}

          {["收到訂單", "配送中", "異常", "訂單完成", "訂單取消"].includes(
            status
          ) && (
            <Row>
              <Item>
                <ItemLabel>包材重量</ItemLabel>
                <Input
                  placeholder="填寫包材重量"
                  disabled={["配送中", "異常", "訂單完成"].includes(status)}
                />
              </Item>

              <Item></Item>
            </Row>
          )}
        </Wrapper>

        <Table dataSource={data} columns={columns} pagination={false} />
      </Container>

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
};

export default Page;
