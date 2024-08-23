"use client";
import { Flex } from "antd";

import Modal from "@/components/Modal";
import Table from "@/components/Table";

export default function ModalImportError(props) {
  const { info = {}, open, onCancel } = props;

  const columns = [
    {
      title: "狀態",
      dataIndex: "statusName",
      align: "center",
      render: (text) => {
        return <div style={{ color: "red" }}>{text}</div>;
      },
    },
    {
      title: "提品類別",
      dataIndex: "isFood",
      align: "center",
      render: (text) => {
        return text ? "食品提品" : "非食品提品";
      },
    },
    {
      title: "處理情形",
      dataIndex: "messages",
      align: "left",
      width: 400,
      render: (text) => {
        return text.map((t, idx) => {
          return <div key={idx}>- {t}</div>;
        });
      },
    },
    {
      title: "分車類型",
      dataIndex: "cartTypeStr",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "商品分類",
      dataIndex: "scmCategory",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "品牌",
      dataIndex: "brand",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "生產國家",
      dataIndex: "itemCountry",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "中文品名",
      dataIndex: "itemName",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "英文品名",
      dataIndex: "itemNameEn",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "商品規格",
      dataIndex: "itemSpec",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "條碼",
      dataIndex: "itemEan",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
  ];

  return (
    <Modal
      title="匯入結果"
      centered
      destroyOnClose
      width="80vw"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Flex vertical gap={16}>
        <div>
          <div>成功筆數：{info.successCount}</div>
          <div>失敗筆數：{info.errorCount}</div>
        </div>

        <Table
          columns={columns}
          dataSource={info.rows}
          pagination={false}
          scroll={{ x: 2000, y: 500 }}
        />
      </Flex>
    </Modal>
  );
}
