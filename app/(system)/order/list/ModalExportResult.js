import { Col, Modal, Row, Spin } from "antd";
import styled from "styled-components";
import { useState } from "react";

import Button from "@/components/Button";
import Image from "next/image";
import Table from "@/components/Table";

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: rgba(95, 95, 95, 1);
  text-align: center;
`;

const Subtitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: rgba(95, 95, 95, 1);
  text-align: center;
`;

const BtnGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

export default function ModalExportResult(props) {
  const { open, loading = false, onOk, onCancel } = props;

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const columns = [
    {
      title: "訂單編號",
      dataIndex: "",
      align: "center",
    },
    {
      title: "貨運公司代碼",
      dataIndex: "",
      align: "center",
    },
    {
      title: "貨運公司",
      dataIndex: "",
      align: "center",
    },
    {
      title: "配送單號",
      dataIndex: "",
      align: "center",
    },
    {
      title: "發票號碼",
      dataIndex: "",
      align: "center",
    },
    {
      title: "發票開立日期",
      dataIndex: "",
      align: "center",
    },
    {
      title: "包材重量(單位為g)",
      dataIndex: "",
      align: "center",
    },
    {
      title: "狀態",
      dataIndex: "",
      align: "center",
    },
    {
      title: "處理情形",
      dataIndex: "",
      align: "center",
    },
  ];

  const handleChangeTable = (page, pageSize) => {
    // const list = splitArrayIntoParts(recordList, pageSize);
    // setTableInfo((state) => ({
    //   ...state,
    //   rows: list[page - 1],
    //   page,
    //   pageSize,
    // }));
  };

  return (
    <Modal
      title="匯入結果"
      width={1200}
      closable={false}
      maskClosable={false}
      open={open}
      centered
      footer={(_, { OkBtn, CancelBtn }) => (
        <Button type="primary" onClick={onCancel}>
          確認
        </Button>
      )}
      onCancel={onCancel}
    >
      <Row gutter={[0, 16]}>
        <Col span={24}>xxx</Col>

        <Col span={24}>
          <Table
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
    </Modal>
  );
}
