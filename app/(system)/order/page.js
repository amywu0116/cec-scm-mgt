"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  Checkbox,
  Divider,
  Layout,
  Pagination,
  Radio,
  Table,
  Tabs,
  theme,
} from "antd";
import styled, { css } from "styled-components";

import Button from "@/components/Button";
import Input from "@/components/Input";
import DatePicker from "@/components/DatePicker";
import Select from "@/components/Select";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  margin: 64px 36px 0;

  .ant-tabs-top > .ant-tabs-nav {
    margin-bottom: 0;
  }

  .ant-tabs .ant-tabs-tab {
    padding: 12px 48px;
  }

  .ant-tabs .ant-tabs-tab + .ant-tabs-tab {
    margin: 0;
  }

  .ant-checkbox-group {
    gap: 20px 18px;
    padding: 0 16px;
  }

  .ant-checkbox + span {
    width: 84px;
  }

  .ant-radio + span {
    word-break: keep-all;
  }

  .ant-radio + span,
  .ant-checkbox + span {
    font-size: 14px;
    font-weight: 400;
    color: #7b8093;
  }

  .ant-btn-link {
    padding: 0;
    min-width: 0;

    span {
      font-size: 14px;
      font-weight: 400;
      color: #212b36;
      text-decoration: underline;
    }
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #212b36;
  margin-right: 32px;
`;

const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
`;

const Card = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const FormItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const FormItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7b8093;
  width: 64px;
  flex-shrink: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0 16px;

  ${(props) =>
    props.justifyContent &&
    css`
      justify-content: ${props.justifyContent};
    `}
`;

const Row = styled.div`
  display: flex;
  gap: 0 16px;
`;

const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const PaginationWrapper = styled.div`
  margin-top: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .total {
    font-size: 14px;
    font-weight: 400;
    color: #7b8093;
  }
`;

const Page = () => {
  const router = useRouter();
  // const accessToken = localStorage.getItem("cec-scm-mgt-accessToken");

  const columns = [
    {
      title: "訂單日期",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "訂單編號",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "預計配送日",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "訂單金額",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "收件人姓名",
      dataIndex: "e",
      align: "center",
    },
    {
      title: "收件人手機號碼",
      dataIndex: "f",
      align: "center",
    },
    {
      title: "處理狀態",
      dataIndex: "g",
      align: "center",
    },
    {
      title: "狀態",
      dataIndex: "h",
      align: "center",
    },
    {
      title: "備註",
      dataIndex: "i",
      align: "center",
    },
  ];

  const data = [
    {
      a: "2024/04/23",
      b: "3472860001492",
      c: "2024/04/23",
      d: "22,080",
      e: "王小花",
      f: "0980123123",
      g: "已結案",
      h: "拒收",
      i: "",
    },
    {
      a: "2024/04/23",
      b: "3472860001492",
      c: "2024/04/23",
      d: "22,080",
      e: "王小花",
      f: "0980123123",
      g: "已結案",
      h: "拒收",
      i: "",
    },
    {
      a: "2024/04/23",
      b: "3472860001492",
      c: "2024/04/23",
      d: "22,080",
      e: "王小花",
      f: "0980123123",
      g: "已結案",
      h: "拒收",
      i: "",
    },
  ];

  return (
    <>
      <Layout.Header
        style={{
          padding: "0 36px",
          position: "fixed",
          top: 0,
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          backgroundColor: "#fff",
          width: "calc(100vw - 280px)",
        }}
      >
        <Title>訂單管理</Title>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: "訂單",
            },
            {
              title: "訂單管理",
            },
          ]}
        />
      </Layout.Header>

      <Container>
        <Card>
          <Row>
            <FormItem>
              <FormItemLabel>訂單編號</FormItemLabel>
              <Input style={{ width: 250 }} placeholder="輸入訂單編號" />
            </FormItem>

            <FormItem>
              <FormItemLabel>日期</FormItemLabel>
              <DatePicker
                style={{ width: 250 }}
                placeholder="日期起"
                onChange={() => {}}
              />
              <div>-</div>
              <DatePicker
                style={{ width: 250 }}
                placeholder="日期迄"
                onChange={() => {}}
              />
            </FormItem>
          </Row>

          <Row>
            <FormItem>
              <FormItemLabel>貨運公司</FormItemLabel>
              <Select
                style={{ width: 250 }}
                placeholder="選擇貨運公司"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </FormItem>

            <FormItem>
              <FormItemLabel>處理狀態</FormItemLabel>
              <Radio.Group
                style={{ display: "flex", flex: 1, alignItems: "center" }}
                defaultValue={1}
                // onChange={() => {}}
                // value={1}
              >
                <Radio value={1}>待處理</Radio>
                <Radio value={2}>已結案</Radio>
              </Radio.Group>
            </FormItem>
          </Row>

          <Row>
            <FormItem>
              <FormItemLabel>訂單物流狀態</FormItemLabel>
              <Checkbox.Group
                options={[
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                  "收到訂單",
                  "配送中",
                  "已送達",
                ]}
                defaultValue={[""]}
                onChange={() => {}}
              />
            </FormItem>
          </Row>

          <Divider style={{ margin: 0 }} />

          <ButtonGroup justifyContent="flex-end">
            <Button>出貨狀態匯入</Button>

            <Button type="secondary">查詢</Button>

            <Button type="link">清除查詢條件</Button>
          </ButtonGroup>
        </Card>

        <ListSection>
          <TableTitle>訂單列表</TableTitle>

          <ButtonGroup>
            <Button type="secondary">導出客戶清單</Button>
            <Button disabled>批次維護物流狀態為已送達</Button>
          </ButtonGroup>

          <Tabs
            defaultActiveKey="1"
            items={[
              {
                label: "全部",
                key: "1",
                children: (
                  <>
                    <Table
                      rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {},
                        getCheckboxProps: (record) => ({
                          disabled: record.name === "Disabled User",
                          name: record.name,
                        }),
                      }}
                      columns={columns}
                      dataSource={data}
                      pagination={false}
                    />
                    <PaginationWrapper>
                      <div className="total">共500筆</div>
                      <Pagination defaultCurrent={6} total={500} />
                    </PaginationWrapper>
                  </>
                ),
              },
              {
                label: "異常",
                key: "2",
                children: "Tab 2",
              },
              {
                label: "待處理",
                key: "3",
                children: "Tab 3",
              },
            ]}
          />
        </ListSection>
      </Container>
    </>
  );
};

export default Page;
