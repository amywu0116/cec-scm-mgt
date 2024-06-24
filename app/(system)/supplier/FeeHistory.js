import styled from "styled-components";
import { Divider } from "antd";

import Button from "@/components/Button";
import Table from "@/components/Table";
import Select from "@/components/Select";
import DatePicker from "@/components/DatePicker";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  padding: 16px 0;

  .ant-btn-link {
    padding: 0;
    min-width: 0;

    span {
      font-size: 14px;
      font-weight: 400;
      color: #212b36;
      text-decoration: underline;
    }
  }
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

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Card = styled.div`
  background-color: rgba(241, 243, 246, 1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Row = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Item = styled.div`
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

const BtnGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const FeeHistory = () => {
  const columns = [
    {
      title: "費用名稱",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "異動類型",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "異動前",
      dataIndex: "c",
      align: "center",
    },
    {
      title: "異動後",
      dataIndex: "d",
      align: "center",
    },
    {
      title: "異動時間",
      dataIndex: "e",
      align: "center",
    },
  ];

  const data = [
    {
      a: "系統維護費",
      b: "新增",
      c: "-",
      d: "1%",
      e: "2024/05/16 17:00",
    },
    {
      a: "系統維護費",
      b: "新增",
      c: "-",
      d: "1%",
      e: "2024/05/16 17:00",
    },
  ];

  return (
    <Container>
      <Wrapper>
        <Card>
          <Row>
            <Item>
              <ItemLabel>費用名稱</ItemLabel>
              <Select
                style={{ width: 250 }}
                placeholder="請選擇問題類別"
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
              <ItemLabel>異動日期</ItemLabel>
              <DatePicker
                style={{ width: 250 }}
                placeholder="異動日期起"
                onChange={() => {}}
              />
              <div>-</div>

              <DatePicker
                style={{ width: 250 }}
                placeholder="異動日期迄"
                onChange={() => {}}
              />
            </Item>
          </Row>

          <Divider style={{ margin: 0 }} />

          <BtnGroup style={{ marginLeft: "auto" }} justifyContent="flex-end">
            <Button type="secondary">查詢</Button>

            <Button type="link">清除查詢條件</Button>
          </BtnGroup>
        </Card>

        <TableWrapper>
          <Title>費用異動歷程</Title>

          <Table columns={columns} dataSource={data} />
        </TableWrapper>
      </Wrapper>
    </Container>
  );
};

export default FeeHistory;
