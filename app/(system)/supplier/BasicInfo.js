"use client";
import React from "react";
import { Checkbox, Radio } from "antd";
import styled from "styled-components";

import Input from "@/components/Input";
import Table from "@/components/Table";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  padding: 16px 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
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

const BasicInfo = () => {
  const columns = [
    {
      title: "使用者",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "E-mail",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "聯絡方式",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "啟用",
      dataIndex: "d",
      align: "center",
      render: () => {
        return <Checkbox />;
      },
    },
  ];

  const data = [
    {
      a: "王心凌",
      b: "abc@gmail.com",
      c: "0912123123",
      d: "",
    },
    {
      a: "王心凌",
      b: "abc@gmail.com",
      c: "0912123123",
      d: "",
    },
    {
      a: "王心凌",
      b: "abc@gmail.com",
      c: "0912123123",
      d: "",
    },
  ];

  return (
    <Container>
      <Wrapper>
        <Title>基礎資料</Title>

        <Row>
          <Item>
            <ItemLabel>
              供應商
              <br />
              代碼
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              供應商
              <br />
              名稱
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              供應商
              <br />
              簡稱
            </ItemLabel>
            <Input />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>統一編號</ItemLabel>
            <Input />
          </Item>

          <Item style={{ flex: "2 1 32px" }}>
            <ItemLabel>
              供應商
              <br />
              地址
            </ItemLabel>
            <Input />
          </Item>
        </Row>
      </Wrapper>

      <Wrapper>
        <Title>人員聯絡方式</Title>

        <Row>
          <Item>
            <ItemLabel>
              業務
              <br />
              承辦人
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              業務
              <br />
              聯絡電話
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              業務
              <br />
              E-mai
            </ItemLabel>
            <Input />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>
              財務
              <br />
              承辦人
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              財務
              <br />
              聯絡電話
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              財務
              <br />
              E-mai
            </ItemLabel>
            <Input />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>
              出貨
              <br />
              承辦人
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              出貨
              <br />
              聯絡電話
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              出貨
              <br />
              E-mai
            </ItemLabel>
            <Input />
          </Item>
        </Row>
      </Wrapper>

      <Wrapper>
        <Title>出貨天數設定</Title>

        <Row>
          <Item>
            <ItemLabel>
              一般
              <br />
              出貨天數
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              一般低温
              <br />
              出貨天數
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              預購常温
              <br />
              出貨天數
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>
              預購低温
              <br />
              出貨天數
            </ItemLabel>
            <Input />
          </Item>
        </Row>

        <Row>
          <Item style={{ height: 56 }}>
            <ItemLabel>是否啟用</ItemLabel>
            <Radio.Group
              defaultValue={1}
              // onChange={() => {}}
              // value={1}
            >
              <Radio value={1}>是</Radio>
              <Radio value={2}>否</Radio>
            </Radio.Group>
          </Item>
        </Row>
      </Wrapper>

      <Wrapper>
        <Title>使用者帳號</Title>

        <Table columns={columns} dataSource={data} />
      </Wrapper>
    </Container>
  );
};

export default BasicInfo;
