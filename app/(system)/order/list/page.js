"use client";
import { Badge, Breadcrumb, Checkbox, Divider, Flex, Form, Radio } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Button from "@/components/Button";
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";
import Tabs from "@/components/Tabs";

import api from "@/api";
import { useBoundStore } from "@/store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-form-item {
    .ant-form-item-label > label {
      height: 100%;
      font-size: 14px;
      font-weight: 700;
      color: #7b8093;
    }
  }

  .ant-checkbox-group {
    gap: 20px 18px;
    padding: 0 16px;
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

  .ant-table-wrapper .ant-table-tbody {
    .ant-table-row {
      &.closed {
        background-color: #eeeeee;

        a {
          color: #7b8093;
        }

        > .ant-table-cell-row-hover {
          background-color: #eeeeee;
        }
      }
    }
  }
`;

const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 36px;
`;

const Card = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 0 16px;

  ${(props) =>
    props.justifyContent &&
    css`
      justify-content: ${props.justifyContent};
    `}
`;

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const TabLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 4px;
`;

const Tag = styled.div`
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  background-color: #ff563014;
  color: #b71d18;
  width: fit-content;
  margin: auto;

  ${(props) =>
    props.type === "closed" &&
    css`
      background-color: #919eab14;
      color: #212b36;
    `}

  ${(props) =>
    props.type === "pending" &&
    css`
      background-color: #ff563014;
      color: #b71d18;
    `};
`;

// key 為處理狀態，value 為訂單物流狀態
const statusMapping = {
  0: ["1", "8", "11", "401", "402", "403", "405"],
  1: ["404", "406"],
};

const Page = () => {
  const [form] = Form.useForm();

  const logisticsOptions = useBoundStore((state) => state.logistics) ?? [];

  const options = useBoundStore((state) => state.options);
  const psOptions = options?.picking_status ?? [];
  const osOptions = options?.order_status ?? [];
  const bsOptions = options?.back_status ?? [];

  const [loading, setLoading] = useState({ table: false });

  const tabActiveKeyDefault = "1";
  const [tabActiveKey, setTabActiveKey] = useState(tabActiveKeyDefault);

  const processedStatus = Form.useWatch("processedStatus", form);
  const logisticsStatus = statusMapping[processedStatus];
  const lsOptions = [...psOptions, ...osOptions, ...bsOptions].map((item) => ({
    ...item,
    label: item.name,
    disabled: !logisticsStatus.includes(item.value),
  }));

  const [selectedRows, setSelectedRows] = useState([]);
  const shippingList = selectedRows.filter((r) => r.status === "配送中");

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const columns = [
    {
      title: "訂單日期",
      dataIndex: "ecorderDate",
      align: "center",
    },
    {
      title: "訂單編號",
      dataIndex: "ecorderNo",
      align: "center",
      render: (text, record, index) => {
        return <Link href={`/order/${text}`}>{text}</Link>;
      },
    },
    {
      title: "預計配送日",
      dataIndex: "",
      align: "center",
      render: (text, record, index) => {
        return `${record.shipDateStart} - ${record.shipDateEnd}`;
      },
    },
    {
      title: "訂單金額",
      dataIndex: "amount",
      align: "center",
    },
    {
      title: "收件人姓名",
      dataIndex: "receiverName",
      align: "center",
    },
    {
      title: "收件人手機號碼",
      dataIndex: "receiverPhone",
      align: "center",
    },
    {
      title: "處理狀態",
      dataIndex: "processedStatus",
      align: "center",
      render: (text, record, index) => {
        let type = "";
        if (text === "已結案") type = "closed";
        if (text === "待處理") type = "pending";
        return <Tag type={type}>{text}</Tag>;
      },
    },
    {
      title: "狀態",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "備註",
      dataIndex: "remark",
      align: "center",
      render: (text, record, index) => {
        if (!text) return "-";
        return text;
      },
    },
  ];

  const fetchList = (values, pagination = { page: 1, pageSize: 10 }) => {
    const orderStatusList = [];
    const pickingStatusList = [];
    const backStatusList = [];

    if (values.logisticsStatus) {
      values.logisticsStatus.forEach((a) => {
        const isOrderStatus = osOptions.some((b) => b.value === a);
        if (isOrderStatus) orderStatusList.push(a);

        const isPickingStatus = psOptions.some((b) => b.value === a);
        if (isPickingStatus) pickingStatusList.push(a);

        const isBackStatus = bsOptions.some((b) => b.value === a);
        if (isBackStatus) backStatusList.push(a);
      });
    }

    const data = {
      queryString: values.queryString,
      ecorderDateStart: values.ecorderDate
        ? values.ecorderDate[0].format("YYYY-MM-DD")
        : undefined,
      ecorderDateEnd: values.ecorderDate
        ? values.ecorderDate[1].format("YYYY-MM-DD")
        : undefined,
      processedStatus,
      ecorderStatus:
        orderStatusList.length > 0 ? orderStatusList.join(",") : undefined,
      pickingStatus:
        pickingStatusList.length > 0 ? pickingStatusList.join(",") : undefined,
      backStatus:
        backStatusList.length > 0 ? backStatusList.join(",") : undefined,
      logisticsId: values.logisticsId,
      offset: (pagination.page - 1) * pagination.pageSize,
      max: pagination.pageSize,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/order", { params: { ...data } })
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
        console.log(err);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  const handleFinish = (values) => {
    fetchList(values);
  };

  const handleChangeTable = (page, pageSize) => {
    fetchList(tableInfo.tableQuery, { page, pageSize });
  };

  const handleChangeTab = (activeKey) => {
    if (activeKey === "2") {
      form.setFieldsValue({
        processedStatus: "0",
        logisticsStatus: logisticsStatus.filter((l) => l === "11"),
      });
    }

    if (activeKey === "3") {
      form.setFieldValue("processedStatus", "0");
    }

    form.submit();
    setTabActiveKey(activeKey);
  };

  const handleSearch = () => {
    setTabActiveKey(tabActiveKeyDefault);
    form.submit();
  };

  // 設定初始 "訂單物流狀態" 後才能進行第一次查詢
  useEffect(() => {
    if (lsOptions.length > 0) {
      fetchList(form.getFieldsValue(true));
    }
  }, [options]);

  // 選擇 "處理狀態" 後會更新 "訂單物流狀態" 列表
  useEffect(() => {
    const lsList = statusMapping[processedStatus];
    form.setFieldValue("logisticsStatus", lsList);
  }, [processedStatus]);

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>訂單管理</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[{ title: "訂單" }, { title: "訂單管理" }]}
        />
      </LayoutHeader>

      <Container>
        <Form
          form={form}
          autoComplete="off"
          colon={false}
          initialValues={{
            processedStatus: "0",
            logisticsStatus,
          }}
          onFinish={handleFinish}
        >
          <Card>
            <Flex gap={16}>
              <Form.Item name="queryString" label="訂單編號">
                <Input style={{ width: 250 }} placeholder="輸入訂單編號" />
              </Form.Item>

              <Form.Item name="ecorderDate" label="訂單日期">
                <RangePicker
                  style={{ width: 250 }}
                  placeholder={["日期起", "日期迄"]}
                />
              </Form.Item>
            </Flex>

            <Flex gap={16}>
              <Form.Item name="logisticsId" label="貨運公司">
                <Select
                  style={{ width: 250 }}
                  placeholder="選擇貨運公司"
                  options={logisticsOptions.map((opt) => ({
                    ...opt,
                    label: opt.logisticsName,
                    value: opt.logisticsId,
                  }))}
                />
              </Form.Item>

              <Form.Item name="processedStatus" label="處理狀態">
                <Radio.Group
                  options={[
                    { label: "待處理", value: "0" },
                    { label: "已結案", value: "1" },
                  ]}
                />
              </Form.Item>
            </Flex>

            <Flex gap={16}>
              <Form.Item name="logisticsStatus" label="訂單物流狀態">
                <Checkbox.Group options={lsOptions} />
              </Form.Item>
            </Flex>

            <Divider style={{ margin: 0 }} />

            <BtnGroup style={{ margin: "16px 0 0 auto" }}>
              <Button>出貨狀態匯入</Button>

              <Button type="secondary" onClick={handleSearch}>
                查詢
              </Button>

              <Button type="link" htmlType="reset">
                清除查詢條件
              </Button>
            </BtnGroup>
          </Card>
        </Form>

        <TableWrapper>
          <TableTitle>訂單列表</TableTitle>

          <BtnGroup>
            <Button type="secondary" onClick={() => {}}>
              導出客戶清單
            </Button>

            <Badge count={shippingList.length}>
              <Button disabled={shippingList.length === 0} onClick={() => {}}>
                批次維護物流狀態為已送達
              </Button>
            </Badge>
          </BtnGroup>

          <Tabs
            items={[
              {
                label: "全部",
                key: "1",
                children: (
                  <>
                    <Table
                      rowKey="ecorderId"
                      loading={loading.table}
                      rowClassName={(record, index) => {
                        if (record.processedStatus === "已結案") {
                          return "closed";
                        }
                      }}
                      rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {
                          setSelectedRows(selectedRows);
                        },
                      }}
                      pageInfo={{
                        total: tableInfo.total,
                        page: tableInfo.page,
                        pageSize: tableInfo.pageSize,
                      }}
                      columns={columns}
                      dataSource={tableInfo.rows}
                      onChange={handleChangeTable}
                    />
                  </>
                ),
              },
              {
                label: (
                  <TabLabelWrapper>
                    異常 <Tag>5</Tag>
                  </TabLabelWrapper>
                ),
                key: "2",
                children: (
                  <>
                    <Table
                      rowKey="ecorderId"
                      loading={loading.table}
                      rowClassName={(record, index) => {
                        if (record.processedStatus === "已結案") {
                          return "closed";
                        }
                      }}
                      rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {
                          setSelectedRows(selectedRows);
                        },
                      }}
                      pageInfo={{
                        total: tableInfo.total,
                        page: tableInfo.page,
                        pageSize: tableInfo.pageSize,
                      }}
                      columns={columns}
                      dataSource={tableInfo.rows}
                      onChange={handleChangeTable}
                    />
                  </>
                ),
              },
              {
                label: (
                  <TabLabelWrapper>
                    待處理 <Tag>12</Tag>
                  </TabLabelWrapper>
                ),
                key: "3",
                children: (
                  <>
                    <Table
                      rowKey="ecorderId"
                      loading={loading.table}
                      rowClassName={(record, index) => {
                        if (record.processedStatus === "已結案") {
                          return "closed";
                        }
                      }}
                      rowSelection={{
                        onChange: (selectedRowKeys, selectedRows) => {
                          setSelectedRows(selectedRows);
                        },
                      }}
                      pageInfo={{
                        total: tableInfo.total,
                        page: tableInfo.page,
                        pageSize: tableInfo.pageSize,
                      }}
                      columns={columns}
                      dataSource={tableInfo.rows}
                      onChange={handleChangeTable}
                    />
                  </>
                ),
              },
            ]}
            activeKey={tabActiveKey}
            onChange={handleChangeTab}
          />
        </TableWrapper>
      </Container>
    </>
  );
};

export default Page;
