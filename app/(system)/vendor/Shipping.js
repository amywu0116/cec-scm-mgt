"use client";
import { App, Spin } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";

import api from "@/api";
import { useBoundStore } from "@/store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  padding: 16px 0;
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
`;

const Row = styled.div`
  display: flex;
  gap: 0 32px;
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const ErrorMessage = styled.div`
  color: rgb(255, 77, 79);
`;

const ShippingFeeSettings = () => {
  const { message } = App.useApp();

  const options = useBoundStore((state) => state.options);
  const scmCart = options?.SCM_cart ?? [];
  const scmShippingMethod = options?.SCM_shipping_method ?? [];

  const [loading, setLoading] = useState({ page: false });
  const [error, setError] = useState({});

  const [isEdit, setIsEdit] = useState(false);

  const [shippingListDefault, setShippingListDefault] = useState([]);
  const [shippingList, setShippingList] = useState([]);

  const validate = (arr) => {
    const obj = {};
    arr.forEach((item) => {
      obj[item.cartType] = {
        shippingDays: item.shippingDays === "",
        shippingMethod: item.shippingMethod === "",
      };
    });
    return obj;
  };

  const checkError = (obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (typeof value === "object" && value !== null) {
          if (checkError(value)) {
            return true;
          }
        } else if (value === true) {
          return true;
        }
      }
    }

    return false;
  };

  const fetchShipping = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/vendor/shipping")
      .then((res) => {
        const list = scmCart.map((item) => {
          return {
            cartType: item.value,
            cartTypeName: item.name,
            shippingDays: ["RR", "RC"].includes(item.value) ? "1" : "",
            shippingMethod: "",
            shippingMethodName: "",
          };
        });
        setShippingListDefault(res.data ?? list);
        setShippingList(res.data ?? list);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const removeLeadingZero = (value) => {
    while (value.length > 1 && value.startsWith("0")) {
      value = value.substring(1);
    }
    return value;
  };

  const handleSave = () => {
    const errorObj = validate(shippingList);
    setError(errorObj);

    if (checkError(errorObj)) return;

    const data = shippingList.map((item) => {
      return { ...item, shippingDays: Number(item.shippingDays) };
    });

    setLoading((state) => ({ ...state, page: true }));
    api
      .post("v1/scm/vendor/shipping", data)
      .then((res) => {
        message.success(res.message);
        setIsEdit(false);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    setShippingList(shippingListDefault);
    setError([]);
  };

  useEffect(() => {
    fetchShipping();
  }, []);

  return (
    <Spin spinning={loading.page}>
      <Container>
        <BtnGroup>
          {isEdit ? (
            <>
              <Button onClick={handleCancelEdit}>取消</Button>
              <Button type="primary" onClick={handleSave}>
                保存
              </Button>
            </>
          ) : (
            <Button type="primary" onClick={() => setIsEdit(true)}>
              編輯
            </Button>
          )}
        </BtnGroup>

        {checkError(error) && <ErrorMessage>請填寫所有欄位</ErrorMessage>}

        {scmCart.map((a, idx) => {
          const item = shippingList?.find((b) => b.cartType === a.value) ?? {};

          let shippingMethod = {};
          if (item.shippingMethod) {
            shippingMethod = scmShippingMethod.find(
              (c) => c.value === item.shippingMethod
            );
          }

          return (
            <Row key={idx}>
              <Item>
                <ItemLabel>{a.name}</ItemLabel>

                <Input
                  style={{ width: 200 }}
                  disabled={
                    !isEdit || (isEdit && ["RR", "RC"].includes(a.value))
                  }
                  status={
                    error[item.cartType]?.shippingDays ? "error" : undefined
                  }
                  suffix="天"
                  value={item.shippingDays}
                  onChange={(e) => {
                    const value = removeLeadingZero(e.target.value);
                    if (/^\d*$/.test(value)) {
                      const newList = shippingList.map((item, i) => {
                        if (item.cartType !== a.value) return item;
                        return { ...item, shippingDays: value };
                      });
                      setShippingList(newList);
                    }
                  }}
                />
              </Item>

              <Item>
                <ItemLabel>運費備註</ItemLabel>
                <Select
                  style={{ width: 400 }}
                  disabled={!isEdit}
                  placeholder="選擇運費備註"
                  options={scmShippingMethod.map((a) => ({
                    ...a,
                    label: a.name,
                  }))}
                  status={
                    error[item.cartType]?.shippingMethod ? "error" : undefined
                  }
                  value={shippingMethod}
                  onChange={(value, option) => {
                    const newList = shippingList.map((item, i) => {
                      if (item.cartType !== a.value) return item;
                      return {
                        ...item,
                        shippingMethod: option.value,
                        shippingMethodName: option.name,
                      };
                    });
                    setShippingList(newList);
                  }}
                />
              </Item>
            </Row>
          );
        })}
      </Container>
    </Spin>
  );
};

export default ShippingFeeSettings;
