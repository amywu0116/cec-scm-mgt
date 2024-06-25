"use client";
import React, { useState, useEffect } from "react";
import { Checkbox, Spin } from "antd";
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
  const options = useBoundStore((state) => state.options);
  const scmCart = options?.SCM_cart ?? [];

  const [loading, setLoading] = useState({ page: false, userTable: false });

  const [info, setInfo] = useState({});

  const [userTableInfo, setUserTableInfo] = useState({
    offset: 0,
    max: 10,
    total: 0,
    rows: [],
  });

  const columns = [
    {
      title: "使用者",
      dataIndex: "name",
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
        return <Checkbox checked={text === 1} />;
      },
    },
  ];

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/vendor")
      .then((res) => setInfo(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  const fetchUsers = (pagination = { page: 1, pageSize: 10 }) => {
    const offset = (pagination.page - 1) * pagination.pageSize;
    setLoading((state) => ({ ...state, userTable: true }));
    api
      .get("v1/scm/vendor/user", { params: { offset, max: userTableInfo.max } })
      .then((res) => setUserTableInfo((state) => ({ ...state, ...res.data })))
      .catch((err) => console.log(err))
      .finally(() => setLoading((state) => ({ ...state, userTable: false })));
  };

  const handleChangeTable = (page, pageSize) => {
    fetchUsers({ page, pageSize });
  };

  useEffect(() => {
    fetchInfo();
    fetchUsers({ page: 1, pageSize: 10 });
  }, []);

  console.log("options", options, user);

  return (
    <Spin spinning={loading.page}>
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

          {scmCart.map((a) => {
            const item =
              info?.settingList?.find((b) => b.cart === a.value) ?? {};

            return (
              <Row>
                <Item>
                  <ItemLabel>
                    {a.name}
                    <br />
                    /天
                  </ItemLabel>
                  <Input disabled value={item.shippingDays} />
                </Item>

                <Item>
                  <ItemLabel>運費備註</ItemLabel>
                  <Input disabled value={item.shippingMethod} />
                </Item>

                <Item></Item>
              </Row>
            );
          })}
        </Wrapper>

        <Wrapper>
          <Title>使用者帳號</Title>

          <Table
            loading={loading.userTable}
            columns={columns}
            dataSource={userTableInfo.rows}
            total={userTableInfo.total}
            pageSize={userTableInfo.max}
            onChange={handleChangeTable}
          />
        </Wrapper>
      </Container>
    </Spin>
  );
};

export default BasicInfo;
