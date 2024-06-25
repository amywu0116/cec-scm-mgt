"use client";
import React, { useState, useEffect } from "react";
import { Checkbox, Radio } from "antd";
import styled from "styled-components";

import Input from "@/components/Input";
import Table from "@/components/Table";

import api from "@/api";
import { useBoundStore } from "@/store";

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
  const user = useBoundStore((state) => state.user);

  const [info, setInfo] = useState({
    id: 1,
    omsId: 1,
    vendorCode: "K0001",
    vendorName: "測試供應商A",
    vendorAddress: "台北市信義區市府路1號",
    taxId: "45033202",
    businessContact: "business",
    businessPhone: "0911222333",
    businessEmail: "business@example.com",
    financeContact: "finance",
    financePhone: "0911222333",
    financeEmail: "finance@example.com",
    shipContact: "ship",
    shipPhone: "0911222333",
    shipEmail: "shipping@example.com",
    status: 1,
    sapVendorCode: "SAP1",
    companyContact: "0911222333",
    companyAlias: "簡稱A",
    remark: null,
    settingList: [
      {
        cart: "RR",
        shippingMethod: "運費100，399免運",
        shippingDays: 1,
      },
      {
        cart: "RC",
        shippingMethod: "運費100，599免運",
        shippingDays: 1,
      },
      {
        cart: "PR",
        shippingMethod: "運費200，1000免運(建議低溫商品)",
        shippingDays: 6,
      },
      {
        cart: "PC",
        shippingMethod: "運費200，1299免運(建議低溫商品)",
        shippingDays: 8,
      },
    ],
  });

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

  const fetchInfo = () => {
    api
      .get("/scm/vendor", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log(res);
        setInfo(res.data);
      })
      .catch(() => {})
      .finally(() => {});
  };

  useEffect(() => {
    fetchInfo();
  }, []);

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
            <Input disabled value={info.vendorCode} />
          </Item>

          <Item>
            <ItemLabel>
              SPA
              <br />
              供應商
              <br />
              代碼
            </ItemLabel>
            <Input disabled value={info.sapVendorCode} />
          </Item>

          <Item></Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>
              供應商
              <br />
              名稱
            </ItemLabel>
            <Input disabled value={info.vendorName} />
          </Item>

          <Item>
            <ItemLabel>
              供應商
              <br />
              簡稱
            </ItemLabel>
            <Input disabled value={info.companyAlias} />
          </Item>

          <Item>
            <ItemLabel>統一編號</ItemLabel>
            <Input disabled value={info.taxId} />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>
              供應商
              <br />
              代表號
            </ItemLabel>
            <Input disabled value={info.companyContact} />
          </Item>

          <Item style={{ flex: "2 1 32px" }}>
            <ItemLabel>
              供應商
              <br />
              地址
            </ItemLabel>
            <Input disabled value={info.vendorAddress} />
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
            <Input disabled value={info.businessContact} />
          </Item>

          <Item>
            <ItemLabel>
              業務
              <br />
              聯絡電話
            </ItemLabel>
            <Input disabled value={info.businessPhone} />
          </Item>

          <Item>
            <ItemLabel>
              業務
              <br />
              E-mai
            </ItemLabel>
            <Input disabled value={info.businessEmail} />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>
              財務
              <br />
              承辦人
            </ItemLabel>
            <Input disabled value={info.financeContact} />
          </Item>

          <Item>
            <ItemLabel>
              財務
              <br />
              聯絡電話
            </ItemLabel>
            <Input disabled value={info.financePhone} />
          </Item>

          <Item>
            <ItemLabel>
              財務
              <br />
              E-mai
            </ItemLabel>
            <Input disabled value={info.financeEmail} />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>
              出貨
              <br />
              承辦人
            </ItemLabel>
            <Input disabled value={info.shipContact} />
          </Item>

          <Item>
            <ItemLabel>
              出貨
              <br />
              聯絡電話
            </ItemLabel>
            <Input disabled value={info.shipPhone} />
          </Item>

          <Item>
            <ItemLabel>
              出貨
              <br />
              E-mai
            </ItemLabel>
            <Input disabled value={info.shipEmail} />
          </Item>
        </Row>
      </Wrapper>

      <Wrapper>
        <Title>出貨天數設定</Title>

        <Row>
          <Item>
            <ItemLabel>
              一般常温
              <br />
              /天
            </ItemLabel>
            <Input disabled />
          </Item>

          <Item>
            <ItemLabel>運費備註</ItemLabel>
            <Input />
          </Item>

          <Item></Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>
              一般低温
              <br />
              /天
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>運費備註</ItemLabel>
            <Input />
          </Item>

          <Item></Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>
              預購常温
              <br />
              /天
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>運費備註</ItemLabel>
            <Input />
          </Item>

          <Item></Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>
              預購低温
              <br />
              /天
            </ItemLabel>
            <Input />
          </Item>

          <Item>
            <ItemLabel>運費備註</ItemLabel>
            <Input />
          </Item>

          <Item></Item>
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
