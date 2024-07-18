import { Col, Modal, Row } from "antd";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Table from "@/components/Table";

export default function ModalImportShip(props) {
  const { data, open, onCancel } = props;

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "訂單編號",
      dataIndex: "ecorderNo",
      align: "center",
      width: 160,
    },
    {
      title: "貨運公司代碼",
      dataIndex: "logisticsCode",
      align: "center",
    },
    {
      title: "配送單號",
      dataIndex: "shippingCode",
      align: "center",
    },
    {
      title: "發票號碼",
      dataIndex: "invoiceNo",
      align: "center",
    },
    {
      title: "發票開立日期",
      dataIndex: "applyDate",
      align: "center",
    },
    {
      title: "包材重量(單位為g)",
      dataIndex: "packageStr",
      align: "center",
    },
    {
      title: "狀態",
      dataIndex: "statusName",
      align: "center",
    },
    {
      title: "處理情形",
      dataIndex: "message",
      align: "center",
    },
  ];

  const splitArrayIntoParts = (array, pageSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += pageSize) {
      result.push(array.slice(i, i + pageSize));
    }
    return result;
  };

  const handleChangeTable = (page, pageSize) => {
    const list = splitArrayIntoParts(data, pageSize);
    setTableInfo((state) => ({
      ...state,
      rows: list[page - 1],
      page,
      pageSize,
    }));
  };

  useEffect(() => {
    const list = splitArrayIntoParts(data, tableInfo.pageSize);
    setTableInfo((state) => ({
      ...state,
      rows: list[tableInfo.page - 1],
      total: data.length,
    }));
  }, [data]);

  return (
    <Modal
      title="匯入結果"
      width={1200}
      closable={false}
      open={open}
      centered
      footer={() => (
        <Button type="primary" onClick={onCancel}>
          確認
        </Button>
      )}
      onCancel={onCancel}
    >
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={tableInfo.rows}
            scroll={{ y: 400, scrollToFirstRowOnChange: true }}
            pageInfo={{
              total: tableInfo.total,
              page: tableInfo.page,
              pageSize: tableInfo.pageSize,
            }}
            onChange={handleChangeTable}
          />
        </Col>
      </Row>
    </Modal>
  );
}
