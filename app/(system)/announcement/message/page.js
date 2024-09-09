"use client";
import { App, Breadcrumb, Tooltip } from "antd";
import { parseAsInteger, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";

import api from "@/api";
import { truncateString } from "@/utils/formatted";
import updateQuery from "@/utils/updateQuery";

const Container = styled.div``;

const DropdownWrapper = styled.div`
  width: 160px;
  padding: 4px;
  border-radius: 4px;
  box-shadow: 0px 0px 7px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
`;

const DropdownItem = styled.div`
  font-size: 14px;
  font-weight: 500;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: 0.2s all;

  &:hover {
    background-color: rgba(233, 246, 254, 1);
    color: rgba(23, 119, 255, 1);
  }
`;

export default function Page() {
  const { message } = App.useApp();

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
  });

  const [loading, setLoading] = useState({
    table: false,
  });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {
      page: 1,
      pageSize: 10,
    },
  });

  const columns = [
    {
      title: "建立時間",
      dataIndex: "createdAt",
      align: "center",
    },
    {
      title: "主題",
      dataIndex: "announceName",
      align: "center",
    },
    {
      title: "公告內容",
      dataIndex: "announceContent",
      align: "center",
      render: (text) => {
        return (
          <Tooltip overlayStyle={{ maxWidth: 400 }} title={text}>
            {truncateString(text, 20)}
          </Tooltip>
        );
      },
    },
  ];

  const fetchTableInfo = (values) => {
    updateQuery(values, setQuery);

    const params = {
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/announce`, { params })
      .then((res) => {
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: values.page,
          pageSize: values.pageSize,
          tableQuery: { ...values },
        }));
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, table: false })));
  };

  const handleChangeTable = (page, pageSize) => {
    fetchTableInfo({ ...tableInfo.tableQuery, page, pageSize });
  };

  useEffect(() => {
    fetchTableInfo({ ...tableInfo.tableQuery });
  }, []);

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchTableInfo(query);
  }, []);

  return (
    <Container>
      <LayoutHeader>
        <LayoutHeaderTitle>公告訊息</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[{ title: "公告與訂單諮詢" }, { title: "公告訊息" }]}
        />
      </LayoutHeader>

      <Table
        columns={columns}
        dataSource={tableInfo.rows}
        loading={loading.table}
        pageInfo={{
          total: tableInfo.total,
          page: tableInfo.page,
          pageSize: tableInfo.pageSize,
        }}
        onChange={handleChangeTable}
      />
    </Container>
  );
}
