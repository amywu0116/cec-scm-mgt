"use client";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { Spin } from "antd";

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

const LoginRecord = () => {
  const [loading, setLoading] = useState({ page: false });

  const [recordList, setRecordList] = useState([]);

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      align: "center",
    },
    {
      title: "登入日期",
      dataIndex: "loginTime",
      align: "center",
    },
    {
      title: "登入IP",
      dataIndex: "ip",
      align: "center",
    },
    {
      title: "登入人員帳號",
      dataIndex: "account",
      align: "center",
    },
    {
      title: "登入人員姓名",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "登入結果",
      dataIndex: "result",
      align: "center",
    },
  ];

  const splitArrayIntoParts = (array, pageSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += pageSize) {
      result.push(array.slice(i, i + pageSize));
    }
    return result;
  };

  const fetchRecord = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/vendor/user/loginRecord")
      .then((res) => {
        const records = res.data.map((d, i) => ({ ...d, id: i + 1 }));
        setRecordList(records);

        const list = splitArrayIntoParts(records, tableInfo.pageSize);
        setTableInfo((state) => ({
          ...state,
          rows: list[tableInfo.page - 1],
          total: records.length,
        }));
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  const handleChangeTable = (page, pageSize) => {
    const list = splitArrayIntoParts(recordList, pageSize);
    setTableInfo((state) => ({
      ...state,
      rows: list[page - 1],
      page,
      pageSize,
    }));
  };

  useEffect(() => {
    fetchRecord();
  }, []);

  return (
    <Spin spinning={loading.page}>
      <Container>
        <Wrapper>
          <Title>供應商登入歷程</Title>
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
        </Wrapper>
      </Container>
    </Spin>
  );
};

export default LoginRecord;
