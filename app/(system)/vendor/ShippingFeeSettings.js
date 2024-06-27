"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Spin } from "antd";

import Input from "@/components/Input";

import api from "@/api";
import { useBoundStore } from "@/store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  padding: 16px 0;
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

const ShippingFeeSettings = () => {
  const options = useBoundStore((state) => state.options);
  const scmCart = options?.SCM_cart ?? [];

  const [loading, setLoading] = useState({ page: false });

  const [info, setInfo] = useState([]);

  return (
    <Spin spinning={loading.page}>
      <Container>
        {scmCart.map((a, idx) => {
          const item = info?.settingList?.find((b) => b.cart === a.value) ?? {};

          return (
            <Row key={idx}>
              <Item>
                <ItemLabel>
                  {a.name}
                  <br />
                  /天
                </ItemLabel>
                <Input disabled value={item.shippingDays} />
              </Item>

              <Item>
                <ItemLabel>運費備註</ItemLabel>
                <Input disabled value={item.shippingMethod} />
              </Item>

              <Item></Item>
            </Row>
          );
        })}
      </Container>
    </Spin>
  );
};

export default ShippingFeeSettings;