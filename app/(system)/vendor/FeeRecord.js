"use client";
import { Divider, Form } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import RangePicker from "@/components/DatePicker/RangePicker";
import Select from "@/components/Select";
import Table from "@/components/Table";

import api from "@/api";
import { useBoundStore } from "@/store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  padding: 16px 0;

  .ant-form-item {
    .ant-form-item-label > label {
      height: 42px;
      font-size: 14px;
      font-weight: 700;
      color: #7b8093;
    }
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
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Card = styled.div`
  background-color: rgba(241, 243, 246, 1);
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const FeeRecord = () => {
  const [form] = Form.useForm();

  const options = useBoundStore((state) => state.options);
  const scmFeeTypeOptions = options?.scmFeeType ?? [];

  const [loading, setLoading] = useState({ table: false });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "費用名稱",
      dataIndex: "feeTypeName",
      align: "center",
    },
    {
      title: "異動類型",
      dataIndex: "action",
      align: "center",
    },
    {
      title: "異動前 %",
      dataIndex: "beforeFee",
      align: "center",
      render: (text) => {
        if (!text) return "-";
        return `${text}%`;
      },
    },
    {
      title: "異動後 %",
      dataIndex: "afterFee",
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

  const fetchTableInfo = (values, pagination = { page: 1, pageSize: 10 }) => {
    const data = {
      feeType: values.feeType,
      queryStart: values.queryDate[0].format("YYYY-MM-DD"),
      queryEnd: values.queryDate[1].format("YYYY-MM-DD"),
      offset: (pagination.page - 1) * pagination.pageSize,
      max: pagination.pageSize,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/vendor/feeRecord", { params: { ...data } })
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

  const handleFinish = (values) => {
    fetchTableInfo(values);
  };

  const handleChangeTable = (page, pageSize) => {
    form
      .validateFields()
      .then(() => {
        fetchTableInfo(form.getFieldsValue(true), { page, pageSize });
      })
      .catch(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
  };

  return (
    <Container>
      <Form
        form={form}
        colon={false}
        labelCol={{ flex: "110px" }}
        scrollToFirstError={{ behavior: "smooth", block: "center" }}
        onFinish={handleFinish}
      >
        <Card>
          <Form.Item name="feeType" label="費用名稱">
            <Select
              style={{ width: 400 }}
              placeholder="請選擇費用名稱"
              showSearch
              options={scmFeeTypeOptions.map((opt) => ({
                ...opt,
                label: opt.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="queryDate"
            label="異動日期"
            rules={[
              {
                required: true,
                message: "必填",
              },
              { validator: validateDateRange },
            ]}
          >
            <RangePicker
              style={{ width: 400 }}
              placeholder={["異動日期起", "異動日期迄"]}
            />
          </Form.Item>

          <Divider style={{ margin: 0 }} />

          <BtnGroup style={{ margin: "16px 0 0 auto" }}>
            <Button type="secondary" htmlType="submit">
              查詢
            </Button>

            <Button type="link" htmlType="reset">
              清除查詢條件
            </Button>
          </BtnGroup>
        </Card>
      </Form>

      <TableWrapper>
        <Title>費用異動歷程</Title>
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
      </TableWrapper>
    </Container>
  );
};

export default FeeRecord;
