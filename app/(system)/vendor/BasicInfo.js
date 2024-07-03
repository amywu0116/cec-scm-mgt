"use client";
import { Checkbox, Spin } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Input from "@/components/Input";
import Table from "@/components/Table";

import api from "@/api";

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
  const [loading, setLoading] = useState({ page: false, table: false });

  const [info, setInfo] = useState({});

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
      .then((res) => setInfo(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
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
        console.log(err);
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
                SAP
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
        </Wrapper>
      </Container>
    </Spin>
  );
};

export default BasicInfo;
