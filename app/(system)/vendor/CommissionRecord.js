"use client";
import { App, Col, Divider, Form, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import ResetBtn from "@/components/Button/ResetBtn";
import RangePicker from "@/components/DatePicker/RangePicker";
import Select from "@/components/Select";
import Table from "@/components/Table";

import api from "@/api";

const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
`;

const Card = styled.div`
  background-color: rgba(241, 243, 246, 1);
  padding: 16px;
  margin-top: 16px;
`;

export default function CommissionRecord() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({ table: false });

  const [categoryOptions, setCategoryOptions] = useState([]);

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const columns = [
    {
      title: "分類條碼",
      dataIndex: "categoryCode",
      align: "center",
    },
    {
      title: "分類名稱",
      dataIndex: "categoryName",
      align: "center",
    },
    {
      title: "異動類型",
      dataIndex: "action",
      align: "center",
    },
    {
      title: "異動前 %",
      dataIndex: "beforeRate",
      align: "center",
      render: (text) => {
        if (!text) return "-";
        return `${text}%`;
      },
    },
    {
      title: "異動後 %",
      dataIndex: "afterRate",
      align: "center",
      render: (text) => {
        if (!text) return "-";
        return `${text}%`;
      },
    },
    {
      title: "異動時間",
      dataIndex: "modifyTime",
      align: "center",
    },
  ];

  const validateDateRange = (_, value) => {
    if (!value || value.length !== 2) {
      return Promise.resolve();
    }

    const [startDate, endDate] = value;
    const sixMonthsFromStartDate = dayjs(startDate).add(6, "months");

    if (endDate.isAfter(sixMonthsFromStartDate)) {
      return Promise.reject(new Error("日期區間應小於 6 個月"));
    }

    return Promise.resolve();
  };

  const fetchCategory = () => {
    api
      .get("v1/system/option/category")
      .then((res) => {
        setCategoryOptions(res.data);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {});
  };

  const fetchTableInfo = (values, pagination = { page: 1, pageSize: 10 }) => {
    const data = {
      categoryCode: values.categoryCode,
      queryStart: values.queryDate[0].format("YYYY-MM-DD"),
      queryEnd: values.queryDate[1].format("YYYY-MM-DD"),
      offset: (pagination.page - 1) * pagination.pageSize,
      max: pagination.pageSize,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/vendor/commissionRecord", { params: { ...data } })
      .then((res) => {
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: pagination.page,
          pageSize: pagination.pageSize,
          tableQuery: { ...values },
        }));
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  const handleFinish = (values) => {
    fetchTableInfo(values);
  };

  const handleChangeTable = (page, pageSize) => {
    fetchTableInfo(tableInfo.tableQuery, { page, pageSize });
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <Row gutter={[0, 16]}>
      <Col span={24}>
        <Form
          form={form}
          colon={false}
          labelCol={{ flex: "80px" }}
          labelWrap
          labelAlign="left"
          requiredMark={false}
          onFinish={handleFinish}
        >
          <Card>
            <Row>
              <Col span={8} xxl={{ span: 6 }}>
                <Form.Item name="categoryCode" label="分類編碼 / 名稱">
                  <Select
                    placeholder="請選擇分類編碼 / 名稱"
                    showSearch
                    allowClear
                    options={categoryOptions.map((opt) => ({
                      ...opt,
                      label: `${opt.categoryCode} / ${opt.categoryName}`,
                      value: opt.categoryCode,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={8} xxl={{ span: 6 }}>
                <Form.Item
                  name="queryDate"
                  label="異動日期"
                  rules={[
                    { required: true, message: "必填" },
                    { validator: validateDateRange },
                  ]}
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    placeholder={["異動日期起", "異動日期迄"]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: 0 }} />

            <Row
              style={{ marginTop: 16 }}
              gutter={16}
              justify="end"
              align="middle"
            >
              <Col>
                <Button type="secondary" htmlType="submit">
                  查詢
                </Button>
              </Col>

              <Col>
                <ResetBtn htmlType="reset">清除查詢條件</ResetBtn>
              </Col>
            </Row>
          </Card>
        </Form>
      </Col>

      <Col span={24}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <TableTitle>佣金異動歷程</TableTitle>
          </Col>

          <Col span={24}>
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
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
