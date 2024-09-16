"use client";
import { App, Breadcrumb, Col, Divider, Flex, Form, Row } from "antd";
import dayjs from "dayjs";
import fileDownload from "js-file-download";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

import api from "@/api";
import { useBoundStore } from "@/store";
import updateQuery from "@/utils/updateQuery";

const Container = styled.div`
  .ant-checkbox-group {
    gap: 20px 18px;
    padding: 0 16px;
  }

  .ant-radio + span,
  .ant-checkbox + span {
    font-size: 14px;
    font-weight: 400;
    color: rgba(89, 89, 89, 1);
  }

  .ant-checkbox + span {
    width: 84px;
  }

  .ant-radio + span {
    word-break: keep-all;
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

const Card = styled(Flex)`
  background-color: #f1f3f6;
  padding: 16px;
`;

const VendorCard = styled(Card)`
  .vendor-card-item {
    display: flex;

    > div:nth-child(1) {
      flex-basis: 300px;
      font-size: 14px;
      font-weight: 700;
      color: rgba(89, 89, 89, 1);
    }
  }
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const router = useRouter();

  const options = useBoundStore((state) => state.options);
  const disputeOptions = options?.SCM_dispute_flag ?? [];
  const reconciliationOptions = options?.SCM_reconciliation_status ?? [];

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    period: parseAsString,
    disputeStatus: parseAsString,
    reconciliationStatus: parseAsString,
    accountNo: parseAsString,
    orderNo: parseAsString,
  });

  const [loading, setLoading] = useState({
    table: false,
    export: false,
    dispute: false,
    disputeCancel: false,
    disputeClose: false,
  });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const [selectedRows, setSelectedRows] = useState([]);

  const columns = [
    {
      title: "申訴狀態",
      dataIndex: "disputeStatus",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "帳務訂單號碼",
      dataIndex: "accountNo",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "帳務訂單發票",
      dataIndex: "invoiceNo",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "訂單編號",
      dataIndex: "orderNumber",
      align: "center",
    },
    {
      title: "供應商名稱",
      dataIndex: "vendorName",
      align: "center",
    },
    {
      title: "商品品名",
      dataIndex: "itemName",
      align: "center",
    },
    {
      title: "訂單付款完成日期",
      dataIndex: "authDate",
      align: "center",
    },
    {
      title: "商品金額(A)",
      dataIndex: "itemAmount",
      align: "center",
    },
    {
      title: "服務手續費(B)",
      dataIndex: "serviceFee",
      align: "center",
    },
    {
      title: "成交手續費(C)",
      dataIndex: "commissionFee",
      align: "center",
    },
    {
      title: "付款方式",
      dataIndex: "paymentTypeName",
      align: "center",
    },
    {
      title: "Tappay手續費%數",
      dataIndex: "tappayFeeRate",
      align: "center",
    },
    {
      title: "家福收款金額(B+C)",
      dataIndex: "c4Amount",
      align: "center",
    },
    {
      title: "供應商收款金額(A-B-C)(未扣除TapPay手續費)",
      dataIndex: "vendorAmount",
      align: "center",
    },
    {
      title: "銀行入帳日期(未扣除TapPay手續費)",
      dataIndex: "debitDate",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "銀行入帳金額",
      dataIndex: "debitAmount",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "申訴申請時間",
      dataIndex: "applyDate",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "申訴結案時間",
      dataIndex: "closeDate",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
  ];

  const generatePeriodOptions = () => {
    const dateArray = [];
    const currentDate = dayjs(); // 當前日期
    let tempDate = dayjs("2024-08"); // 從 2024 年 8 月開始

    // 循環生成 yyyyMM 格式的日期陣列
    while (tempDate.isBefore(currentDate) || tempDate.isSame(currentDate)) {
      const formattedDate = tempDate.format("YYYYMM");
      dateArray.unshift({
        label: formattedDate,
        value: formattedDate,
      });
      tempDate = tempDate.add(1, "month"); // 增加一個月
    }

    // 確保陣列不超過 12 個
    if (dateArray.length > 12) {
      dateArray.splice(12); // 移除超過的部分
    }

    return dateArray;
  };
  const periodOptions = generatePeriodOptions();

  const getPeriodRange = (value) => {
    if (!value) return;
    const year = value.slice(0, 4); // 'YYYY'
    const month = value.slice(4, 6); // 'MM'

    const startDate = dayjs(`${year}-${month}-26`).subtract(1, "month"); // 前一個月的 26 日
    const endDate = dayjs(`${year}-${month}-25`); // 當前月份的 25 號

    return `${startDate.format("YYYY-MM-DD")} ~ ${endDate.format("YYYY-MM-DD")}`;
  };

  const transformParams = (values) => {
    const params = {
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
      period: values.period,
      disputeStatus: values.disputeStatus,
      reconciliationStatus: values.reconciliationStatus,
      accountNo: values.accountNo,
      orderNo: values.orderNo,
    };
    return params;
  };

  const fetchTableInfo = (values) => {
    updateQuery(values, setQuery);
    const newParams = transformParams(values);
    setSelectedRows([]);
    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/report/reconciliation`, { params: newParams })
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

  // 下載查詢結果
  const handleExport = () => {
    const newParams = transformParams(form.getFieldsValue());
    delete newParams.max;
    delete newParams.offset;
    setLoading((state) => ({ ...state, export: true }));
    api
      .get(`v1/scm/report/reconciliation/export`, {
        params: newParams,
        responseType: "arraybuffer",
      })
      .then((res) => fileDownload(res, "帳務清單.xlsx"))
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, export: false })));
  };

  // 爭議申請
  const handleDispute = () => {
    const ids = selectedRows
      .filter((row) => row.disputeFlag === 0)
      .map((row) => row.indexId);

    setLoading((state) => ({ ...state, dispute: true }));
    api
      .post(`v1/scm/report/dispute`, ids)
      .then((res) => {
        message.success(res.message);
        form.submit();
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, dispute: false })));
  };

  // 爭議取消
  const handleDisputeCancel = () => {
    const ids = selectedRows
      .filter((row) => row.disputeFlag === 1)
      .map((row) => row.indexId);

    setLoading((state) => ({ ...state, disputeCancel: true }));
    api
      .post(`v1/scm/report/dispute/cancel`, ids)
      .then((res) => {
        message.success(res.message);
        form.submit();
      })
      .catch((err) => message.error(err.message))
      .finally(() =>
        setLoading((state) => ({ ...state, disputeCancel: false }))
      );
  };

  // 爭議結案
  const handleDisputeClose = () => {
    const ids = selectedRows
      .filter((row) => row.disputeFlag === 1)
      .map((row) => row.indexId);

    setLoading((state) => ({ ...state, disputeClose: true }));
    api
      .post(`v1/scm/report/dispute/close`, ids)
      .then((res) => {
        message.success(res.message);
        form.submit();
      })
      .catch((err) => message.error(err.message))
      .finally(() =>
        setLoading((state) => ({ ...state, disputeClose: false }))
      );
  };

  // 發票下載
  const handleDownloadInvoice = () => {
    const period = form.getFieldValue("period");
    const accountNo = tableInfo.rows[0]?.accountNo;
    router.push(`/pdf/invoice?period=${period}&accountNo=${accountNo}`);
  };

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchTableInfo(query);
    form.setFieldsValue({
      period: query.period,
      disputeStatus: query.disputeStatus,
      reconciliationStatus: query.reconciliationStatus,
      accountNo: query.accountNo,
      orderNo: query.orderNo,
    });
  }, []);

  return (
    <Container>
      <LayoutHeader>
        <LayoutHeaderTitle>帳務</LayoutHeaderTitle>
        <Breadcrumb
          separator=">"
          items={[{ title: "帳務" }, { title: "對帳報表" }]}
        />
      </LayoutHeader>

      <Form
        form={form}
        autoComplete="off"
        colon={false}
        labelCol={{ flex: "110px" }}
        labelWrap
        requiredMark={false}
        disabled={loading.table}
        initialValues={{
          period: periodOptions[periodOptions.length - 1].value, // 預設選取最後一個
        }}
        onFinish={handleFinish}
      >
        <Flex vertical gap={16}>
          <Card vertical>
            <Row gutter={32}>
              <Col span={8}>
                <Form.Item name="period" label="帳款年月">
                  <Select
                    placeholder="請選擇帳款年月"
                    options={periodOptions}
                    allowClear={false}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label="配達期間"
                  shouldUpdate={(prev, current) =>
                    prev.period !== current.period
                  }
                >
                  {({ getFieldValue }) => {
                    const period = getFieldValue("period");
                    return (
                      <Input
                        placeholder="請輸入配達期間"
                        disabled
                        value={getPeriodRange(period)}
                      />
                    );
                  }}
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={8}>
                <Form.Item name="disputeStatus" label="爭議狀態">
                  <Select
                    placeholder="請選擇爭議狀態"
                    options={disputeOptions.map((opt) => {
                      return {
                        label: opt.name,
                        value: opt.value,
                      };
                    })}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="reconciliationStatus" label="對帳表狀態">
                  <Select
                    placeholder="請選擇對帳表狀態"
                    options={reconciliationOptions.map((opt) => {
                      return {
                        label: opt.name,
                        value: opt.value,
                      };
                    })}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={8}>
                <Form.Item name="accountNo" label="帳務訂單號碼">
                  <Input placeholder="請輸入帳務訂單號碼" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="orderNo" label="訂單編號">
                  <Input placeholder="請輸入訂單編號" />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: 0 }} />

            <Flex style={{ marginTop: 16 }} gap={16} justify="flex-end">
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
          </Card>

          {tableInfo.rows.length > 0 && (
            <VendorCard vertical gap={16}>
              <div className="vendor-card-item">
                <div>供應商名稱</div>
                <div>{tableInfo.rows[0]?.vendorName}</div>
              </div>

              <div className="vendor-card-item">
                <div>供應商訂單收款金額 (未扣除TapPay手續費)</div>
                <div>{tableInfo.rows[0]?.monthlyAmount}</div>
              </div>

              <div className="vendor-card-item">
                <div>供應商訂單實際收款金額</div>
                <div>{tableInfo.rows[0]?.withdrawAmount}</div>
              </div>

              <div className="vendor-card-item">
                <div>供應商訂單Tappay手續費</div>
                <div>{tableInfo.rows[0]?.tappayFee}</div>
              </div>
            </VendorCard>
          )}

          <Flex vertical gap={16}>
            <Flex gap={16}>
              <Button
                type="secondary"
                loading={loading.export}
                onClick={handleExport}
              >
                下載查詢結果
              </Button>

              <Button
                loading={loading.dispute}
                disabled={!selectedRows.some((row) => row.disputeFlag === 0)}
                onClick={handleDispute}
              >
                爭議申請
              </Button>

              <Button
                loading={loading.disputeCancel}
                disabled={!selectedRows.some((row) => row.disputeFlag === 1)}
                onClick={handleDisputeCancel}
              >
                爭議取消
              </Button>

              <Button
                loading={loading.disputeClose}
                disabled={!selectedRows.some((row) => row.disputeFlag === 1)}
                onClick={handleDisputeClose}
              >
                爭議結案
              </Button>

              <Button
                type="secondary"
                disabled={!tableInfo.rows[0]?.accountNo}
                onClick={handleDownloadInvoice}
              >
                發票下載
              </Button>
            </Flex>

            <Table
              rowKey="indexId"
              rowSelection={{
                selectedRowKeys: selectedRows.map((row) => row.indexId),
                onChange: (selectedRowKeys, selectedRows) => {
                  setSelectedRows(selectedRows);
                },
              }}
              scroll={{ x: 3000 }}
              loading={
                loading.table ||
                loading.dispute ||
                loading.disputeCancel ||
                loading.disputeClose
              }
              columns={columns}
              dataSource={tableInfo.rows}
              pageInfo={{
                total: tableInfo.total,
                page: tableInfo.page,
                pageSize: tableInfo.pageSize,
              }}
              onChange={handleChangeTable}
            />
          </Flex>
        </Flex>
      </Form>
    </Container>
  );
}
