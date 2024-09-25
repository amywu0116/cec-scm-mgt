"use client";
import { Flex } from "antd";

import Modal from "@/components/Modal";
import Table from "@/components/Table";

export default function ModalInstalmentError(props) {
  const { info = {}, open, onCancel } = props;

  const columns = [
    {
      title: "列數",
      dataIndex: "rowNumber",
      align: "center",
      width: 100,
      render: (text) => {
        return <div style={{ color: "red" }}>{text}</div>;
      },
    },
    {
      title: "商城商品編號",
      dataIndex: "productnumber",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "失敗原因",
      dataIndex: "errorMessage",
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
      width="50vw"
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
          scroll={{ x: 500, y: 500 }}
        />
      </Flex>
    </Modal>
  );
}
