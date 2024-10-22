"use client";
import { App, Breadcrumb, Col, Flex, Form, Modal, Row } from "antd";
import { parseAsInteger, parseAsString, useQueryStates, parseAsArrayOf } from "nuqs";
import { useEffect, useState } from "react";
import styled from "styled-components";
import dayjs from "dayjs";

import Button from "@/components/Button";
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Table from "@/components/Table";

import api from "@/api";
import updateQuery from "@/utils/updateQuery";

const Container = styled.div`
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



export default function Page() {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    queryString: parseAsString,
    query: parseAsArrayOf({
      parse: (query) => dayjs(query),
    }),
  });

  const [openDropdown, setOpenDropdown] = useState({});

  const [openModal, setOpenModal] = useState({
    message: false,
    history: false,
  });

  const [loading, setLoading] = useState({
    table: false,
  });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const [rowInfo, setRowInfo] = useState({});

  const [open, setOpen] = useState(false);
  const [currentNumList, setCurrentNumList] = useState([]);
  const rowNum = 5;

  const columns = [
    {
      title: "發送時間",
      dataIndex: "modifyTime",
      align: "left",
      width: 50,
    },
    {
      title: "發送內容",
      dataIndex: "message",
      align: "left",
      width: 200,
    },
    {
      title: "發送訂單",
      dataIndex: "numList",
      align: "center",
      width: 200,
      render: (numList) => {
        const displayList = numList.slice(0, rowNum);
        const isMore = numList.length > rowNum;

        return (
          <div>
            {displayList.map((num, index) => (
              <div key={index}>{num}</div>
            ))}
            {isMore && (
              <Button
                type="link"
                onClick={() => {
                  setCurrentNumList(numList);
                  setOpen(true);
                }}
              >
                更多
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const renderModalContent = () => {
    const rows = [];
    for (let i = 0; i < currentNumList.length; i += rowNum) {
      const row = currentNumList.slice(i, i + rowNum);
      rows.push(row);
    }

    return (
      <div style={{ display: 'table', width: '100%', borderCollapse: 'collapse' }}>
        {rows.map((row, rowIndex) => {
          const fillEmpty = rowNum - row.length; // 補空白
          const filledRow = [...row, ...Array(fillEmpty).fill("")];
          return (
            <div key={rowIndex} style={{ display: 'table-row' }}>
              {filledRow.map((num, index) => (
                <div
                  key={index}
                  style={{
                    display: 'table-cell',
                    width: '20%',
                    border: '1px solid #ddd', // 格線
                    textAlign: 'center', // 置中
                    whiteSpace: 'nowrap', // 防止換行
                    overflow: 'hidden', // 溢出隱藏
                    textOverflow: 'ellipsis', // 使用省略號
                    padding: '8px', // 內邊距
                  }}
                >
                  {num}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const fetchTableInfo = (values) => {
    updateQuery(values, setQuery);
    const params = {
      queryString: values.queryString ? values.queryString : undefined,
      queryStart: values.queryDate
      ? values.queryDate[0].format("YYYY-MM-DD")
      : undefined,
      queryEnd: values.queryDate
      ? values.queryDate[1].format("YYYY-MM-DD")
      : undefined,
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/vendor/sendMessageRecord`, { params })
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

  const handleFinish = (values) => {
    fetchTableInfo({ ...values, page: 1, pageSize: 10 });
  };

  const handleChangeTable = (page, pageSize) => {
    fetchTableInfo({ ...tableInfo.tableQuery, page, pageSize });
  };


  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchTableInfo(query);
    form.setFieldsValue({
      queryString: query.queryString,
      queryDate: query.queryDate,
    });
  }, []);

  return (
    <Container>
      <LayoutHeader>
        <LayoutHeaderTitle>訊息推送資訊</LayoutHeaderTitle>
        <Breadcrumb
          separator=">"
          items={[{ title: "公告與訂單諮詢" }, { title: "訊息推送資訊" }]}
        />
      </LayoutHeader>

      <Flex vertical gap={16}>
        <Form
          form={form}
          colon={false}
          labelCol={{ flex: "80px" }}
          labelWrap
          requiredMark={false}
          disabled={loading.table}
          autoComplete="off"
          initialValues={{
            status: 0,
          }}
          onFinish={handleFinish}
        >
          <Card>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  style={{ margin: 0 }}
                  name="queryString"
                  label="訂單編號"
                >
                  <Input placeholder="輸入訂單編號" />
                </Form.Item>
              </Col>

              <Col span={8} xxl={{ span: 6 }}>
                <Form.Item name="queryDate" label="發送時間">
                  <RangePicker
                    style={{ width: "100%" }}
                    placeholder={["日期起", "日期迄"]}
                  />
                </Form.Item>
              </Col>

              <Col style={{ marginLeft: "auto" }} span={6}>
                <Flex justify="flex-end" gap={16}>
                  <Button
                    type="secondary"
                    htmlType="submit"
                    disabled={false}
                    loading={loading.table}
                  >
                    查詢
                  </Button>

                  <Button type="link" htmlType="reset">
                    清除查詢條件
                  </Button>
                </Flex>
              </Col>
            </Row>
          </Card>
        </Form>

        <Table
          rowKey="serviceId"
          loading={loading.table}
          columns={columns}
          dataSource={tableInfo.rows}
          pageInfo={{
            total: tableInfo.total,
            page: tableInfo.page,
            pageSize: tableInfo.pageSize,
          }}
          onChange={handleChangeTable}
          tableLayout="fixed"
        />
      </Flex>

      <Modal
        title="訊息發送訂單編號"
        open={open}
        footer={null}
        width={800}
        onCancel={() => setOpen(false)}
      >
        {renderModalContent()}
      </Modal>
    </Container>
  );
}
