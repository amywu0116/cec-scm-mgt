"use client";
import {
  App,
  Badge,
  Breadcrumb,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Radio,
  Row,
  Space,
  Upload,
} from "antd";
import dayjs from "dayjs";
import fileDownload from "js-file-download";
import Link from "next/link";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Button from "@/components/Button";
import ResetBtn from "@/components/Button/ResetBtn";
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

import ModalImportShip from "./ModalImportShip";
import ModalMessage from "./ModalMessage";

import api from "@/api";
import { useBoundStore } from "@/store";
import updateQuery from "@/utils/updateQuery";

const Container = styled.div`
  .ant-checkbox-group {
    gap: 20px 18px;
  }

  .ant-table-wrapper .ant-table-tbody {
    .ant-table-row {
      &.closed {
        background-color: #eeeeee;

        a {
          color: rgba(89, 89, 89, 1);
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

const ResultTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 20px;
  margin-bottom: 5px;
`;

const ResultTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: rgba(123, 128, 147, 1);
`;

const StatusLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: rgba(123, 128, 147, 1);

  > span {
    color: rgba(183, 29, 24, 1);
    padding: 0 3px;
  }
`;

// key 為處理狀態，value 為訂單物流狀態
const statusMapping = {
  0: ["1", "8", "11", "401", "402", "403", "405", "407"], // 待處理
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

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    queryString: parseAsString,
    ecorderDate: parseAsArrayOf({
      parse: (query) => dayjs(query),
    }),
    processedStatus: parseAsString,
    logisticsId: parseAsInteger,
    logisticsStatus: parseAsArrayOf(parseAsString),
  });

  const [isPageInit, setIsPageInit] = useState(true);

  const [loading, setLoading] = useState({
    table: false,
    batchDelivered: false,
    importShip: false,
    export: false,
    sendMsg: false,
  });

  const [openModal, setOpenModal] = useState({
    msg: false,
  });

  const [showModalImportShip, setShowModalImportShip] = useState(false);

  const processedStatus = Form.useWatch("processedStatus", form);
  const logisticsStatus = statusMapping[processedStatus] ?? [];
  const lsOptions = [...psOptions, ...osOptions, ...bsOptions].map((item) => ({
    ...item,
    label: item.name,
    disabled: !logisticsStatus.includes(item.value),
  }));

  const [importShipData, setImportShipData] = useState([]);

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

  const transformParams = (values) => {
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

    const params = {
      queryString: values.queryString ? values.queryString : undefined,
      ecorderDateStart: values.ecorderDate
        ? values.ecorderDate[0].format("YYYY-MM-DD")
        : undefined,
      ecorderDateEnd: values.ecorderDate
        ? values.ecorderDate[1].format("YYYY-MM-DD")
        : undefined,
      processedStatus: values.processedStatus,
      ecorderStatus:
        orderStatusList.length > 0 ? orderStatusList.join(",") : undefined,
      pickingStatus:
        pickingStatusList.length > 0 ? pickingStatusList.join(",") : undefined,
      backStatus:
        backStatusList.length > 0 ? backStatusList.join(",") : undefined,
      logisticsId: values.logisticsId,
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
    };

    return params;
  };

  const fetchList = (values) => {
    updateQuery(values, setQuery);
    const newParams = transformParams(values);
    setSelectedRows([]);
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/order", { params: newParams })
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
    fetchList({ ...values, page: 1, pageSize: 10 });
  };

  // 切換 Table 分頁、分頁大小
  const handleChangeTable = (page, pageSize) => {
    fetchList({ ...tableInfo.tableQuery, page, pageSize });
  };

  // 查詢
  const handleSearch = (status) => {
    if (status === "異常") {
      form.setFieldsValue({
        processedStatus: "0",
        logisticsStatus: logisticsStatus.filter((l) => l === "11"),
      });
    }

    if (status === "待處理") {
      form.setFieldsValue({
        processedStatus: "0",
        logisticsStatus: statusMapping["0"],
      });
    }

    form.validateFields().then(() => {
      form.submit();
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
        fetchList({ ...tableInfo.tableQuery });
      })
      .catch((err) => message.error(err.message))
      .finally(() => {
        setLoading((state) => ({
          ...state,
          batchDelivered: false,
          table: false,
        }));
      });
  };

  // 出貨狀態匯入
  const handleImportShip = (info) => {
    if (info.file.status === "done") {
      const file = info.file.originFileObj;
      const formData = new FormData();
      formData.append("file", file);
      setLoading((state) => ({ ...state, importShip: true }));
      api
        .post(`v1/scm/order/import/ship`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          setImportShipData(res.data);
          setShowModalImportShip(true);
        })
        .catch((err) => {
          message.error(err.message);
          setImportShipData([]);
          setShowModalImportShip(true);
        })
        .finally(() => {
          setLoading((state) => ({ ...state, importShip: false }));
        });
    }
  };

  // 導出客戶清單
  const handleExport = () => {
    const newParams = transformParams(form.getFieldsValue());
    delete newParams.max;
    delete newParams.offset;
    setLoading((state) => ({ ...state, export: true }));
    api
      .get(`v1/scm/order/export`, {
        params: newParams,
        responseType: "arraybuffer",
      })
      .then((res) => fileDownload(res, "客戶清單.xlsx"))
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, export: false })));
  };

  // 進頁後先自動查詢一次
  useEffect(() => {
    const list = form.getFieldValue("logisticsStatus");

    if (isPageInit && list?.length > 0) {
      form.submit();
      setIsPageInit(false);
    }
  });

  // 選擇 "處理狀態" 後更新 "訂單物流狀態" 列表
  useEffect(() => {
    if (query.logisticsStatus === null) {
      const lsList = statusMapping[processedStatus];
      form.setFieldValue("logisticsStatus", lsList);
    }
  }, [processedStatus]);

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchList(query);
    form.setFieldsValue({
      queryString: query.queryString,
      ecorderDate: query.ecorderDate,
      processedStatus: query.processedStatus,
      logisticsId: query.logisticsId,
      logisticsStatus: query.logisticsStatus,
    });
  }, []);

  return (
    <Container>
      <LayoutHeader>
        <LayoutHeaderTitle>訂單管理</LayoutHeaderTitle>
        <Breadcrumb
          separator=">"
          items={[{ title: "訂單" }, { title: "訂單管理" }]}
        />
      </LayoutHeader>

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
                      onChange={(e) => {
                        const lsList = statusMapping[e.target.value];
                        form.setFieldValue("logisticsStatus", lsList);
                      }}
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

              <Row justify="end" style={{ marginTop: 16 }}>
                <Space size={16}>
                  <Button
                    onClick={() => {
                      handleDownloadFile(
                        "/files/出貨狀態匯入範本.xlsx",
                        "出貨狀態匯入範本.xlsx"
                      );
                    }}
                  >
                    出貨狀態匯入範本
                  </Button>

                  <Upload showUploadList={false} onChange={handleImportShip}>
                    <Button htmlType="label" loading={loading.importShip}>
                      出貨狀態匯入
                    </Button>
                  </Upload>

                  <Button type="secondary" onClick={() => handleSearch("異常")}>
                    異常查詢
                  </Button>

                  <Button
                    type="secondary"
                    onClick={() => handleSearch("待處理")}
                  >
                    待處理查詢
                  </Button>

                  <Button type="secondary" onClick={() => handleSearch("全部")}>
                    查詢
                  </Button>

                  <ResetBtn onClick={handleReset}>清除查詢條件</ResetBtn>
                </Space>
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
              <Flex gap={16}>
                <Button
                  type="secondary"
                  loading={loading.export}
                  onClick={handleExport}
                >
                  導出客戶清單
                </Button>

                <Badge count={shippingList.length}>
                  <Button
                    disabled={shippingList.length === 0}
                    loading={loading.batchDelivered}
                    onClick={handleBatchDelivered}
                  >
                    批次維護物流狀態為已送達
                  </Button>
                </Badge>

                {/* <Button
                  type="secondary"
                  disabled={selectedRows.length === 0}
                  onClick={() => {
                    setOpenModal((state) => ({ ...state, msg: true }));
                  }}
                >
                  發送訊息
                </Button> */}
              </Flex>
            </Col>

            <Col span={24}>
              <ResultTitleWrapper>
                <ResultTitle>查詢結果</ResultTitle>

                <StatusLabel>
                  待處理<span>{tableInfo.countByPending}</span>筆 ( 其中異常
                  <span>{tableInfo.countByUnusual}</span>筆)
                </StatusLabel>
              </ResultTitleWrapper>

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
            </Col>
          </Row>
        </Col>
      </Row>

      <ModalImportShip
        data={importShipData}
        open={showModalImportShip}
        onCancel={() => setShowModalImportShip(false)}
      />

      <ModalMessage
        selectedRows={selectedRows}
        open={openModal.msg}
        onCancel={() => setOpenModal((state) => ({ ...state, msg: false }))}
      />
    </Container>
  );
}
