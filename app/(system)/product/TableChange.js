import Table from "@/components/Table";

export default function TableChange(props) {
  const { data } = props;

  const columns = [
    {
      title: "日期",
      dataIndex: "createdAt",
      align: "center",
    },
    {
      title: "處理人員",
      dataIndex: "createdUser",
      align: "center",
      render: (text) => {
        if ([null, undefined].includes(text)) return "-";
        return text;
      },
    },
    {
      title: "類型",
      dataIndex: "changeType",
      align: "center",
    },
    {
      title: "修改前資料",
      dataIndex: "beforeData",
      align: "center",
      width: 400,
    },
    {
      title: "修改後資料",
      dataIndex: "afterData",
      align: "center",
      width: 400,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      scroll={{ y: 300 }}
    />
  );
}
