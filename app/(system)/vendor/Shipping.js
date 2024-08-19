"use client";
import { App, Col, Row, Space, Spin } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Select from "@/components/Select";

import api from "@/api";
import { useBoundStore } from "@/store";

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 0 16px;
`;

const ItemLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: rgba(89, 89, 89, 1);
  flex-shrink: 0;
`;

const ErrorMessage = styled.div`
  color: rgb(255, 77, 79);
`;

export default function ShippingFeeSettings() {
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
        shippingMethod: [null, undefined].includes(item.shippingMethod),
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
            shippingMethod: "",
            shippingMethodName: "",
          };
        });
        setShippingListDefault(res.data ?? list);
        setShippingList(res.data ?? list);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const handleSave = () => {
    const errorObj = validate(shippingList);
    setError(errorObj);

    if (checkError(errorObj)) return;

    setLoading((state) => ({ ...state, page: true }));
    api
      .post("v1/scm/vendor/shipping", shippingList)
      .then((res) => {
        message.success(res.message);
        setIsEdit(false);
      })
      .catch((err) => {
        message.error(err.message);
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
      <Row style={{ marginTop: 16 }} gutter={[0, 16]}>
        <Col span={24}>
          <Space size={16}>
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
          </Space>
        </Col>

        {checkError(error) && (
          <Col span={24}>
            <ErrorMessage>請填寫所有欄位</ErrorMessage>
          </Col>
        )}

        <Col span={24}>
          <Row gutter={[0, 16]}>
            {scmCart.map((a, idx) => {
              const item =
                shippingList?.find((b) => b.cartType === a.value) ?? {};

              let shippingMethod = {};
              if (item.shippingMethod) {
                shippingMethod = scmShippingMethod.find(
                  (c) => c.value === item.shippingMethod
                );
              }

              return (
                <Col key={idx} span={24}>
                  <Row gutter={[32]}>
                    <Col span={6}>
                      <Item>
                        <ItemLabel>{a.name}</ItemLabel>
                        <Input
                          style={{ width: 200 }}
                          disabled
                          suffix="天"
                          value={item.shippingDays}
                        />
                      </Item>
                    </Col>

                    <Col span={18}>
                      <Item>
                        <ItemLabel>運費促銷方式</ItemLabel>
                        <Select
                          style={{ width: 300 }}
                          disabled={!isEdit}
                          placeholder="選擇運費促銷方式"
                          options={scmShippingMethod.map((a) => ({
                            ...a,
                            label: a.name,
                          }))}
                          status={
                            error[item.cartType]?.shippingMethod
                              ? "error"
                              : undefined
                          }
                          value={shippingMethod}
                          onChange={(value, option) => {
                            const newList = shippingList.map((item, i) => {
                              if (item.cartType !== a.value) return item;
                              return {
                                ...item,
                                shippingMethod: option?.value,
                                shippingMethodName: option?.name,
                              };
                            });
                            setShippingList(newList);
                          }}
                        />
                      </Item>
                    </Col>
                  </Row>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Spin>
  );
}
