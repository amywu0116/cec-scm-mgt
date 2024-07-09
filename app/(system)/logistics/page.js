"use client";
import { Breadcrumb, Checkbox, Spin } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";

import api from "@/api";
import { PATH_LOGISTICS, PATH_PATH_LOGISTICS_ADD } from "@/constants/paths";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Row = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Page = (props) => {
  const [loading, setLoading] = useState({ page: false });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const columns = [
    {
      title: "代碼",
      dataIndex: "code",
      align: "center",
      render: (text, record, index) => {
        return <Link href={`${PATH_LOGISTICS}/${record.id}`}>{text}</Link>;
      },
    },
    {
      title: "貨運公司名稱",
      dataIndex: "logisticsName",
      align: "center",
    },
    {
      title: "地址",
      dataIndex: "address",
      align: "center",
    },
    {
      title: "聯絡人",
      dataIndex: "contact",
      align: "center",
    },
    {
      title: "聯絡方式",
      dataIndex: "phone",
      align: "center",
    },
    {
      title: "是否啟用",
      dataIndex: "status",
      align: "center",
      render: (text, record, index) => {
        return <Checkbox disabled checked={text === 1} />;
      },
    },
    {
      title: "備註",
      dataIndex: "comment",
      align: "center",
      render: (text, record, index) => {
        if (!text) return "-";
        return text;
      },
    },
  ];

  const fetchList = (pagination = { page: 1, pageSize: 10 }) => {
    const data = {
      offset: (pagination.page - 1) * pagination.pageSize,
      max: pagination.pageSize,
    };

    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/logistics", { params: { ...data } })
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
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const handleChangeTable = (page, pageSize) => {
    fetchList({ page, pageSize });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <Spin spinning={loading.page}>
        <LayoutHeader>
          <LayoutHeaderTitle>貨運公司維護</LayoutHeaderTitle>

          <Breadcrumb separator=">" items={[{ title: "貨運公司維護" }]} />
        </LayoutHeader>

        <Container>
          <Row style={{ justifyContent: "flex-end" }}>
            <Link href={PATH_PATH_LOGISTICS_ADD}>
              <Button type="primary">新增</Button>
            </Link>
          </Row>

          <Table
            columns={columns}
            dataSource={tableInfo.rows}
            pageInfo={{
              total: tableInfo.total,
              page: tableInfo.page,
              pageSize: tableInfo.pageSize,
            }}
            onChange={handleChangeTable}
          />
        </Container>
      </Spin>
    </>
  );
};

export default Page;
