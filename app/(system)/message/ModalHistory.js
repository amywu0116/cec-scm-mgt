import styled from "styled-components";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Table from "@/components/Table";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-table-wrapper .ant-table-thead > tr > th {
    padding: 10px 16px !important;
  }
`;

const Row = styled.div`
  display: flex;
  gap: 0 16px;
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
      title: "回覆時間",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "回覆內容",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "回覆者",
      dataIndex: "c",
      align: "center",
    },
  ];

  const data = [
    {
      a: "2024/05/01 17:40:00",
      b: "您可至該門市找相關部門協助處理",
      c: "Mei",
    },
    {
      a: "2024/05/01 17:40:00",
      b: "您可至該門市找相關部門協助處理",
      c: "Mei",
    },
  ];

  return (
    <Modal
      title="訊息歷程查詢"
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
        <Row>
          <Item>
            <ItemLabel>訂單編號</ItemLabel>
            <Input disabled value="10124881" />
          </Item>

          <Item>
            <ItemLabel>問題類別</ItemLabel>
            <Select
              style={{ width: "100%" }}
              disabled
              placeholder="選擇貨運公司"
              options={[
                {
                  value: "lucy",
                  label: "Lucy",
                },
              ]}
            />
          </Item>
        </Row>

        <Row>
          <Item>
            <ItemLabel>提問內容</ItemLabel>
            <Input disabled value="購買時有效期限就過期，拿回換貨可以找誰？" />
          </Item>
        </Row>

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
