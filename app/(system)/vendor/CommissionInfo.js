"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";

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

const CommissionInfo = () => {
  const [loading, setLoading] = useState({ table: false });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "分類ID",
      dataIndex: "categoryCode",
      align: "center",
    },
    {
      title: "分類名稱",
      dataIndex: "categoryName",
      align: "center",
    },
    {
      title: "佣金比例 %",
      dataIndex: "commissionRate",
      align: "center",
      render: (text, record, index) => {
        return `${text}%`;
      },
    },
  ];

  const fetchList = (pagination = { page: 1, pageSize: 10 }) => {
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/vendor/commission", {
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
    fetchList({ page, pageSize });
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Container>
      <Wrapper>
        <Title>商城分類佣金</Title>

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
  );
};

export default CommissionInfo;
