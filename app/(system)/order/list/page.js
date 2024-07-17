"use client";
import {
  App,
  Badge,
  Breadcrumb,
  Checkbox,
  Col,
  Divider,
  Form,
  Radio,
  Row,
} from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Button from "@/components/Button";
import ResetBtn from "@/components/Button/ResetBtn";
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";
import Tabs from "@/components/Tabs";

import ModalExportResult from "./ModalExportResult";

import api from "@/api";
import { useBoundStore } from "@/store";

const Container = styled.div`
  .ant-checkbox-group {
    gap: 20px 18px;
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
  0: ["1", "8", "11", "401", "402", "403", "405"], // 待處理
  1: ["10", "12", "40", "404", "406"], // 已結案
};

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const logisticsOptions = useBoundStore((state) => state.logistics) ?? [];

  const options = useBoundStore((state) => state.options);
  const psOptions = options?.picking_status ?? [];
  const osOptions = options?.order_status ?? [];
  const bsOptions = options?.back_status ?? [];

  const [loading, setLoading] = useState({
    table: false,
    batchDelivered: false,
  });
  const [showModalExportResult, setShowModalExportResult] = useState(false);

  const tabActiveKeyDefault = "全部";
  const [tabActiveKey, setTabActiveKey] = useState(tabActiveKeyDefault);

  const processedStatus = Form.useWatch("processedStatus", form);
  const logisticsStatus = statusMapping[processedStatus] ?? [];
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
        return <Link href={`/order/${record.ecorderShipId}`}>{text}</Link>;
      },
    },
    {
      title: "預計配送日",
      dataIndex: "",
      align: "center",
      render: (text, record, index) => {
        return `${record.shipDateStart} ~ ${record.shipDateEnd}`;
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
  ];

  const renderTable = () => {
    return (
      <Table
        rowKey="ecorderId"
        loading={loading.table}
        rowClassName={(record, index) => {
          if (record.processedStatus === "已結案") {
            return "closed";
          }
        }}
        rowSelection={{
          selectedRowKeys: selectedRows.map((r) => r.ecorderId),
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
    );
  };

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

    setSelectedRows([]);
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
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  const handleFinish = (values) => {
    fetchList(values);
  };

  // 切換 Table 分頁、分頁大小
  const handleChangeTable = (page, pageSize) => {
    fetchList(tableInfo.tableQuery, { page, pageSize });
  };

  // 切換 Table Tab
  const handleChangeTab = (activeKey) => {
    if (activeKey === "異常") {
      form.setFieldsValue({
        processedStatus: "0",
        logisticsStatus: logisticsStatus.filter((l) => l === "11"),
      });
    }

    if (activeKey === "待處理") {
      form.setFieldsValue({
        processedStatus: "0",
        logisticsStatus: statusMapping["0"],
      });
    }

    form.submit();
    setTabActiveKey(activeKey);
  };

  // 查詢
  const handleSearch = () => {
    form.validateFields().then(() => {
      form.submit();
      setTabActiveKey(tabActiveKeyDefault);
    });
  };

  // 清除查詢條件
  const handleReset = () => {
    form.setFieldsValue({
      queryString: undefined,
      ecorderDate: undefined,
      logisticsId: undefined,
      logisticsStatus: undefined,
    });
  };

  // 下載檔案
  const handleDownloadFile = (path, name) => {
    const link = document.createElement("a");
    link.href = path;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 批次維護物流狀態為已送達
  const handleBatchDelivered = () => {
    const data = {
      idList: shippingList.map((s) => s.ecorderShipId),
    };

    setLoading((state) => ({ ...state, batchDelivered: true, table: true }));
    api
      .post(`v1/scm/order/batch/delivered`, data)
      .then((res) => {
        message.success(res.message);
        fetchList(tableInfo.tableQuery);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({
          ...state,
          batchDelivered: false,
          table: false,
        }));
      });
  };

  // 進頁後先自動查詢一次
  useEffect(() => {
    // 等訂單物流狀態先設定好再查詢
    setTimeout(() => {
      form.submit();
    }, 0);
  }, [options]);

  // 選擇 "處理狀態" 後更新 "訂單物流狀態" 列表
  useEffect(() => {
    const lsList = statusMapping[processedStatus];
    form.setFieldValue("logisticsStatus", lsList);
  }, [processedStatus]);

  console.log("shippingList", shippingList);
  console.log("selectedRows", selectedRows);

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
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Form
              form={form}
              autoComplete="off"
              colon={false}
              labelCol={{ flex: "80px" }}
              labelWrap
              labelAlign="left"
              requiredMark={false}
              initialValues={{
                processedStatus: "0",
                logisticsStatus,
              }}
              onFinish={handleFinish}
            >
              <Card>
                <Row gutter={16}>
                  <Col span={8} xxl={{ span: 6 }}>
                    <Form.Item name="queryString" label="訂單編號">
                      <Input placeholder="輸入訂單編號/收件人手機號碼" />
                    </Form.Item>
                  </Col>

                  <Col span={8} xxl={{ span: 6 }}>
                    <Form.Item name="ecorderDate" label="訂單日期">
                      <RangePicker
                        style={{ width: "100%" }}
                        placeholder={["日期起", "日期迄"]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={8} xxl={{ span: 6 }}>
                    <Form.Item name="logisticsId" label="貨運公司">
                      <Select
                        placeholder="選擇貨運公司"
                        options={logisticsOptions.map((opt) => ({
                          ...opt,
                          label: opt.logisticsName,
                          value: opt.logisticsId,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8} xxl={{ span: 6 }}>
                    <Form.Item name="processedStatus" label="處理狀態">
                      <Radio.Group
                        options={[
                          { label: "待處理", value: "0" },
                          { label: "已結案", value: "1" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="logisticsStatus"
                      label="訂單物流狀態"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Checkbox.Group options={lsOptions} />
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
                    <Button
                      onClick={() => {
                        handleDownloadFile(
                          "/出貨狀態匯入範本.xlsx",
                          "出貨狀態匯入範本.xlsx"
                        );
                      }}
                    >
                      出貨狀態匯入範本
                    </Button>
                  </Col>

                  <Col>
                    <Button
                      onClick={() => {
                        setShowModalExportResult(true);
                      }}
                    >
                      出貨狀態匯入
                    </Button>
                  </Col>

                  <Col>
                    <Button type="secondary" onClick={handleSearch}>
                      查詢
                    </Button>
                  </Col>

                  <Col>
                    <ResetBtn onClick={handleReset}>清除查詢條件</ResetBtn>
                  </Col>
                </Row>
              </Card>
            </Form>
          </Col>

          <Col span={24}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <TableTitle>訂單列表</TableTitle>
              </Col>

              <Col span={24}>
                <Row gutter={16}>
                  <Col>
                    <Button type="secondary" onClick={() => {}}>
                      導出客戶清單
                    </Button>
                  </Col>

                  <Col>
                    <Badge count={shippingList.length}>
                      <Button
                        disabled={shippingList.length === 0}
                        loading={loading.batchDelivered}
                        onClick={handleBatchDelivered}
                      >
                        批次維護物流狀態為已送達
                      </Button>
                    </Badge>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Tabs
                  items={[
                    {
                      label: "全部",
                      key: "全部",
                      children: renderTable(),
                    },
                    {
                      label: (
                        <TabLabelWrapper>
                          異常 <Tag>{tableInfo.countByUnusual}</Tag>
                        </TabLabelWrapper>
                      ),
                      key: "異常",
                      children: renderTable(),
                    },
                    {
                      label: (
                        <TabLabelWrapper>
                          待處理 <Tag>{tableInfo.countByPending}</Tag>
                        </TabLabelWrapper>
                      ),
                      key: "待處理",
                      children: renderTable(),
                    },
                  ]}
                  activeKey={tabActiveKey}
                  onChange={handleChangeTab}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      <ModalExportResult
        open={showModalExportResult}
        onCancel={() => setShowModalExportResult(false)}
      />
    </>
  );
}
