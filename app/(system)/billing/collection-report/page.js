"use client";
import styled from "styled-components";
import { Breadcrumb, Radio, Divider } from "antd";

import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import Table from "@/components/Table";
import Button from "@/components/Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

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

const Card = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Row = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Item = styled.div`
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

const BtnGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Page = () => {
  const columns = [
    {
      title: "帳款年月",
      dataIndex: "a",
      align: "center",
      width: 100,
    },
    {
      title: "供應商名稱",
      dataIndex: "b",
      align: "center",
      width: 160,
    },
    {
      title: "SAP廠商編號",
      dataIndex: "c",
      align: "center",
      width: 120,
    },
    {
      title: "廠商統一編號",
      dataIndex: "d",
      align: "center",
      width: 160,
    },
    {
      title: "訂單金額",
      dataIndex: "e",
      align: "center",
      width: 100,
    },
    {
      title: "入帳日期",
      dataIndex: "f",
      align: "center",
      width: 160,
    },
    {
      title: "應收日期",
      dataIndex: "g",
      align: "center",
      width: 100,
    },
    {
      title: "發票號碼",
      dataIndex: "h",
      align: "center",
      width: 100,
    },
    {
      title: "訂單編號",
      dataIndex: "i",
      align: "center",
      width: 120,
    },
    {
      title: "發票金額",
      dataIndex: "j",
      align: "center",
      width: 100,
    },
    {
      title: "發票日",
      dataIndex: "k",
      align: "center",
      width: 100,
    },
  ];

  const data = [
    {
      key: "1",
      a: "費列羅",
      b: "123456",
      c: "86926108",
      d: "27",
      e: "2024/5/17",
      f: "2024/6/1",
      g: "ZZ987654321",
      h: "2024052800000001",
      i: "27",
      j: "2024/6/1",
    },
    {
      key: "2",
      a: "費列羅",
      b: "123456",
      c: "86926108",
      d: "27",
      e: "2024/5/17",
      f: "2024/6/1",
      g: "ZZ987654321",
      h: "2024052800000001",
      i: "27",
      j: "2024/6/1",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>帳務</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "帳務",
            },
            {
              title: "收款報表",
            },
          ]}
        />
      </LayoutHeader>

      <Container>
        <Card>
          <Row>
            <Item>
              <ItemLabel>帳期</ItemLabel>
              <Select
                style={{ width: 250 }}
                placeholder="請選擇狀態"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <Item>
              <ItemLabel>配達期間</ItemLabel>
              <DatePicker style={{ width: 250 }} onChange={() => {}} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>供應商</ItemLabel>
              <Input style={{ width: 250 }} />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>對帳報表狀態</ItemLabel>
              <Radio.Group
                style={{ display: "flex", flex: 1, alignItems: "center" }}
              >
                <Radio value={1}>全部</Radio>
                <Radio value={2}>待確認</Radio>
                <Radio value={3}>已確認</Radio>
                <Radio value={4}>已開立發票</Radio>
                <Radio value={5}>已撥款</Radio>
              </Radio.Group>
            </Item>
          </Row>

          <Divider style={{ margin: 0 }} />

          <BtnGroup style={{ marginLeft: "auto" }} justifyContent="flex-end">
            <Button type="secondary">查詢</Button>

            <Button type="link">清除查詢條件</Button>
          </BtnGroup>
        </Card>

        <TableWrapper>
          <BtnGroup>
            <Button type="secondary">下載查詢結果</Button>
            <Button type="secondary">發票下載</Button>
            <Button>爭議申請</Button>
            <Button>取消爭議</Button>
            <Button>爭議結案</Button>
          </BtnGroup>

          <Table
            rowSelection={{
              onChange: (selectedRowKeys, selectedRows) => {},
              getCheckboxProps: (record) => ({
                name: record.key,
              }),
            }}
            scroll={{ x: "100vw" }}
            columns={columns}
            dataSource={data}
          />
        </TableWrapper>
      </Container>
    </>
  );
};

export default Page;
