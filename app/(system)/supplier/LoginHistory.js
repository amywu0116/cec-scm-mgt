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

const LoginHistory = () => {
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
    <Container>
      <Wrapper>
        <Title>供應商登入歷程</Title>

        <Table columns={columns} dataSource={data} />
      </Wrapper>
    </Container>
  );
};

export default LoginHistory;
