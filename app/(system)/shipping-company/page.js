"use client";
import React from "react";
import { Breadcrumb, Checkbox } from "antd";
import styled from "styled-components";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";

import {
  PATH_SHIPPING_COMPANY,
  PATH_SHIPPING_COMPANY_ADD,
} from "@/constants/paths";

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
  const router = useRouter();

  const columns = [
    {
      title: "代碼",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "貨運公司名稱",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "地址",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "聯絡人",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "聯絡方式",
      dataIndex: "e",
      align: "center",
    },
    {
      title: "是否啟用",
      dataIndex: "f",
      align: "center",
      render: () => {
        return <Checkbox />;
      },
    },
    {
      title: "備註",
      dataIndex: "g",
      align: "center",
    },
  ];

  const data = [
    {
      key: "1",
      a: "5840_tcat",
      b: "黑貓宅急便",
      c: "台北市北投區大業路136號5樓之一",
      d: "王心凌",
      e: "0912444222",
      f: "",
      g: "",
    },
    {
      key: "2",
      a: "5840_tcat",
      b: "黑貓宅急便",
      c: "台北市北投區大業路136號5樓之一",
      d: "王心凌",
      e: "0912444222",
      f: "",
      g: "",
    },
    {
      key: "3",
      a: "5840_tcat",
      b: "黑貓宅急便",
      c: "台北市北投區大業路136號5樓之一",
      d: "王心凌",
      e: "0912444222",
      f: "",
      g: "",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>貨運公司維護</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "貨運公司維護",
            },
          ]}
        />
      </LayoutHeader>

      <Container>
        <Row style={{ justifyContent: "flex-end" }}>
          <Button
            type="primary"
            onClick={() => router.push(PATH_SHIPPING_COMPANY_ADD)}
          >
            新增
          </Button>
        </Row>

        <Table
          columns={columns}
          dataSource={data}
          onRow={(record, index) => {
            return {
              onClick: (e) => {
                if (e.target.className.includes("ant-table-cell")) {
                  router.push(`${PATH_SHIPPING_COMPANY}/${record.key}`);
                }
              },
            };
          }}
        />
      </Container>
    </>
  );
};

export default Page;
