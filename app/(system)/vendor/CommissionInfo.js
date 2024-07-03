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
      title: "佣金比例",
      dataIndex: "e",
      align: "center",
    },
  ];

  return (
    <Container>
      <Wrapper>
        <Title>商城分類佣金</Title>

        <Table columns={columns} dataSource={[]} />
      </Wrapper>
    </Container>
  );
};

export default CommissionInfo;
