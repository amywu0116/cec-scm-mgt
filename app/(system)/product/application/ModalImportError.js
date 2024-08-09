"use client";
import Modal from "@/components/Modal";
import Table from "@/components/Table";

export default function ModalImportError(props) {
  const { info, open, onCancel } = props;

  const columns = [
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
      title: "供應商商品編號",
      dataIndex: "vendorProdCode",
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
    {
      title: "狀態",
      dataIndex: "statusName",
      align: "center",
    },
    {
      title: "處理情形",
      dataIndex: "messages",
      align: "left",
      render: (text) => {
        return text.map((t, idx) => {
          return <div key={idx}>- {t}</div>;
        });
      },
    },
  ];

  return (
    <Modal
      title="匯入結果"
      centered
      destroyOnClose
      width="90vw"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <Table
        columns={columns}
        dataSource={info}
        pagination={false}
        scroll={{ x: 2000 }}
      />
    </Modal>
  );
}
