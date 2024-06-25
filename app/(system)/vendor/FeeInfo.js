"use client";
import styled from "styled-components";

import Input from "@/components/Input";

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
  width: 750px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
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

const FeeInfo = () => {
  return (
    <Container>
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
    </Container>
  );
};

export default FeeInfo;