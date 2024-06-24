import styled from "styled-components";

import Table from "@/components/Table";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  padding: 16px 0;
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
  line-height: 35px;
`;

const CommissionInfo = () => {
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
    <Container>
      <Wrapper>
        <Title>商城分類佣金</Title>

        <Table columns={columns} dataSource={data} />
      </Wrapper>
    </Container>
  );
};

export default CommissionInfo;
