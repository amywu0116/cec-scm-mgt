import Table from "@/components/Table";

export default function ApplyHistoryTable(props) {
  const { data } = props;

  const columns = [
    {
      title: "日期",
      dataIndex: "procTime",
      align: "center",
    },
    {
      title: "處理人員",
      dataIndex: "procUserName",
      align: "center",
    },
    {
      title: "處理狀態",
      dataIndex: "procStatus",
      align: "center",
    },
    {
      title: "備註",
      dataIndex: "procRemark",
      align: "center",
      render: (text, record, index) => {
        if (!text) return "-";
        return text;
      },
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} pagination={false} />
    </>
  );
}
