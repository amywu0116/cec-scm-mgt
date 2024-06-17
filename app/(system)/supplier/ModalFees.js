import styled from "styled-components";

import Modal from "@/components/Modal";
import Button from "@/components/Button";
import Table from "@/components/Table";
import Input from "@/components/Input";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
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

const Row = styled.div`
  display: flex;
  gap: 0 32px;
`;

const ModalFees = (props) => {
  const { open, onCancel } = props;

  const columns = [
    {
      title: "分類ID",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "分類名稱",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "開始時間",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "結束時間",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "佣金比例",
      dataIndex: "e",
      align: "center",
    },
  ];

  const data = [
    {
      a: "G001",
      b: "Carbonate碳酸飲料",
      c: "2024/05/01",
      d: "2024/05/16",
      e: "2%",
    },
    {
      a: "G001",
      b: "Carbonate碳酸飲料",
      c: "2024/05/01",
      d: "2024/05/16",
      e: "2%",
    },
    {
      a: "G001",
      b: "Carbonate碳酸飲料",
      c: "2024/05/01",
      d: "2024/05/16",
      e: "2%",
    },
    {
      a: "G001",
      b: "Carbonate碳酸飲料",
      c: "2024/05/01",
      d: "2024/05/16",
      e: "2%",
    },
    {
      a: "G001",
      b: "Carbonate碳酸飲料",
      c: "2024/05/01",
      d: "2024/05/16",
      e: "2%",
    },
    {
      a: "G001",
      b: "Carbonate碳酸飲料",
      c: "2024/05/01",
      d: "2024/05/16",
      e: "2%",
    },
  ];

  return (
    <>
      <Modal
        title=""
        centered
        closeIcon={false}
        width={800}
        open={open}
        onCancel={onCancel}
        footer={[
          <Button key="ok" onClick={onCancel}>
            了解
          </Button>,
        ]}
      >
        <Content>
          <Wrapper>
            <Title>供應商商城費用</Title>

            <Row>
              <Item>
                <ItemLabel>
                  行政
                  <br />
                  手續費
                </ItemLabel>
                <Input />
              </Item>

              <Item>
                <ItemLabel>
                  行銷
                  <br />
                  導流費
                </ItemLabel>
                <Input />
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>
                  會員
                  <br />
                  紅利費
                </ItemLabel>
                <Input />
              </Item>

              <Item></Item>
            </Row>
          </Wrapper>

          <Wrapper>
            <Title>商城分類佣金</Title>

            <Row>
              <Table
                size="small"
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ y: 190 }}
              />
            </Row>
          </Wrapper>
        </Content>
      </Modal>
    </>
  );
};

export default ModalFees;
