import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Table from "@/components/Table";

const ModalHistory = (props) => {
  const { open, onCancel } = props;

  const columns = [
    {
      title: "No.",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "登入日期",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "登入IP",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "登入人員",
      dataIndex: "d",
      align: "center",
    },
  ];

  const data = [
    {
      a: "1",
      b: "2024/05/16",
      c: "12.23.34.78",
      d: "王心凌",
    },
    {
      a: "1",
      b: "2024/05/16",
      c: "12.23.34.78",
      d: "王心凌",
    },
    {
      a: "1",
      b: "2024/05/16",
      c: "12.23.34.78",
      d: "王心凌",
    },
    {
      a: "1",
      b: "2024/05/16",
      c: "12.23.34.78",
      d: "王心凌",
    },
    {
      a: "1",
      b: "2024/05/16",
      c: "12.23.34.78",
      d: "王心凌",
    },
    {
      a: "1",
      b: "2024/05/16",
      c: "12.23.34.78",
      d: "王心凌",
    },
  ];

  return (
    <>
      <Modal
        title="供應商登入歷程"
        centered
        closeIcon={false}
        width={800}
        open={open}
        onCancel={onCancel}
        footer={[<Button onClick={onCancel}>了解</Button>]}
      >
        <Table
          size="small"
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: 240 }}
        />
      </Modal>
    </>
  );
};

export default ModalHistory;
