import styled from "styled-components";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Table from "@/components/Table";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-table-wrapper .ant-table-thead > tr > th {
    padding: 10px 16px !important;
  }
`;

const Item = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #7b8093;
  width: 64px;
  flex-shrink: 0;
`;

const ModalHistory = (props) => {
  const { open, onCancel } = props;

  const columns = [
    {
      title: "更新時間",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "原公告內容",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "修正後公告內容",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "人員",
      dataIndex: "d",
      align: "center",
    },
  ];

  const data = [
    {
      a: "2024/05/01 17:40:00",
      b: "因應原物料上漲，蛋價每顆上漲1元",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "Mei",
    },
    {
      a: "2024/04/29 17:40:00",
      b: "因應原物料上漲，蛋價每顆上漲1元",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "Mei",
    },
    {
      a: "2024/05/01 17:40:00",
      b: "因應原物料上漲，蛋價每顆上漲1元",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "Mei",
    },
    {
      a: "2024/04/29 17:40:00",
      b: "因應原物料上漲，蛋價每顆上漲1元",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "Mei",
    },
    {
      a: "2024/05/01 17:40:00",
      b: "因應原物料上漲，蛋價每顆上漲1元",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "Mei",
    },
    {
      a: "2024/04/29 17:40:00",
      b: "因應原物料上漲，蛋價每顆上漲1元",
      c: "因應原物料上漲，蛋價每顆上漲1元!",
      d: "Mei",
    },
  ];

  return (
    <Modal
      title="公告歷程查詢"
      centered
      closeIcon={false}
      width={800}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="ok" type="primary" onClick={onCancel}>
          了解
        </Button>,
      ]}
    >
      <Content>
        <Item>
          <ItemLabel>主題</ItemLabel>
          <Input disabled value="廠商Ａ公告" />
        </Item>

        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: 240 }}
        />
      </Content>
    </Modal>
  );
};

export default ModalHistory;
