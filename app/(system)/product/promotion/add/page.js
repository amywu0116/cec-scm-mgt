"use client";
import { Breadcrumb, Checkbox, Col, Form, Radio, Row } from "antd";
import Image from "next/image";
import { useState } from "react";
import styled, { css } from "styled-components";
import Link from "next/link";

import Button from "@/components/Button";
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";

import { PATH_PRODUCT_PROMOTION } from "@/constants/paths";

const Container = styled.div`
  .ant-checkbox-group {
    gap: 20px 18px;
  }
`;

const Card = styled.div`
  background-color: rgba(241, 243, 246, 1);
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const TransferWrapper = styled.div`
  margin: 16px 0;
  display: flex;
  gap: 0 16px;
`;

const TransferList = styled.div`
  height: 358px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 16px;
`;

const TransferListHeader = styled.div`
  height: 48px;
  display: flex;
  padding: 10px 16px;
  background-color: rgba(241, 244, 247, 1);
  border-bottom: 1px solid rgba(204, 204, 204, 1);

  > div {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: rgba(123, 128, 147, 1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const TransferListBody = styled.div`
  flex: 1;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px 0;
  background-color: rgba(248, 248, 248, 1);
  overflow-y: scroll;
`;

const TransferItem = styled.div`
  position: relative;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(204, 204, 204, 1);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  display: flex;

  ${(props) =>
    props.$isSelected &&
    css`
      background-color: rgba(255, 255, 232, 1);

      &::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 16px;
        transform: translateY(-50%);
        width: 14px;
        height: 10px;
        background-image: url("/check.svg");
        background-size: cover;
      }
    `}

  > div {
    flex: 1;
    font-size: 14px;
    font-weight: 400;
    color: rgba(123, 128, 147, 1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const TransferListFooter = styled.div`
  height: 48px;
  background-color: rgba(248, 248, 248, 1);
  border-top: 1px solid rgba(204, 204, 204, 1);
  font-size: 14px;
  font-weight: 400;
  color: rgba(123, 128, 147, 1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TransferListTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: rgba(86, 101, 155, 1);
`;

const TransferListWrapper = styled.div`
  flex: 1;
`;

const TransferBtnGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  cursor: pointer;
  align-self: center;
`;

const TransferBtn = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: rgba(241, 244, 247, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) =>
    props.$active &&
    css`
      background-color: rgba(51, 51, 51, 1);
    `}
`;

export default function Page() {
  const [form] = Form.useForm();

  const [mockSourceData, setMockSourceData] = useState([
    { id: 0, a: "G000123456701", b: "黑松汽水" },
    { id: 1, a: "G000123456801 ", b: "百事可樂" },
    { id: 2, a: "G00012345700", b: "多力多姿" },
    { id: 3, a: "G000123456333", b: "巧克力香蕉船" },
    { id: 4, a: "G000123456701", b: "黑松汽水" },
    { id: 5, a: "G000123456801 ", b: "百事可樂" },
    { id: 6, a: "G00012345700", b: "多力多姿" },
    { id: 7, a: "G000123456333", b: "巧克力香蕉船" },
  ]);

  const [mockTargetData, setMockTargetData] = useState([
    { id: 10, a: "G000123456701", b: "黑松汽水" },
    { id: 11, a: "G000123456801 ", b: "百事可樂" },
    { id: 12, a: "G00012345700", b: "多力多姿" },
    { id: 13, a: "G000123456333", b: "巧克力香蕉船" },
    { id: 14, a: "G000123456701", b: "黑松汽水" },
    { id: 15, a: "G000123456801 ", b: "百事可樂" },
    { id: 16, a: "G00012345700", b: "多力多姿" },
    { id: 17, a: "G000123456333", b: "巧克力香蕉船" },
  ]);

  const [productSourceList, setProductSourceList] = useState([]);
  const [productTargetList, setProductTargetList] = useState([]);

  const handleFinish = () => {};

  console.log("mockSourceData", mockSourceData);
  console.log("mockTargetData", mockTargetData);
  console.log("productSourceList", productSourceList);
  console.log("productTargetList", productTargetList);

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>新增促銷方案</LayoutHeaderTitle>
        <Breadcrumb
          separator=">"
          items={[
            { title: <Link href={PATH_PRODUCT_PROMOTION}>商品促銷</Link> },
            { title: "新增促銷方案" },
          ]}
        />
      </LayoutHeader>

      <Container>
        <Form
          form={form}
          colon={false}
          labelCol={{ flex: "80px" }}
          labelWrap
          labelAlign="left"
          requiredMark={false}
          onFinish={handleFinish}
        >
          <Row>
            <Col span={24}>
              <Card>
                <Row gutter={32}>
                  <Col span={8} xxl={{ span: 6 }}>
                    <Form.Item name="a" label="促銷ID">
                      <Select placeholder="選擇商品代碼或名稱" />
                    </Form.Item>
                  </Col>

                  <Col span={8} xxl={{ span: 6 }}>
                    <Form.Item name="b" label="日期">
                      <RangePicker
                        style={{ width: "100%" }}
                        placeholder={["日期起", "日期迄"]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Form.Item name="c" label="是否啟用">
                      <Radio.Group
                        options={[
                          { label: "啟用", value: false },
                          { label: "禁用", value: true },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Form.Item name="c" label="適用對象">
                      <Checkbox.Group
                        options={[
                          { label: "a", value: "1" },
                          { label: "b", value: "2" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col span={24}>
              <Row
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(228, 231, 237, 1)",
                }}
                gutter={16}
              >
                <Col span={8} xxl={{ span: 6 }}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="a"
                    label="查詢商品"
                  >
                    <Input placeholder="請輸入商品代碼或名稱" />
                  </Form.Item>
                </Col>

                <Col>
                  <Button type="secondary">查詢</Button>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <TransferWrapper>
                    <TransferListWrapper>
                      <TransferListTitle>選擇要加入的商品</TransferListTitle>
                      <TransferList>
                        <TransferListHeader>
                          <div>促銷ID</div>
                          <div>商品名稱</div>
                        </TransferListHeader>

                        <TransferListBody>
                          {mockSourceData.map((d, idx) => {
                            return (
                              <TransferItem
                                key={idx}
                                $isSelected={productSourceList.includes(d.id)}
                                onClick={() => {
                                  setProductSourceList((prevList) => {
                                    if (productSourceList.includes(d.id)) {
                                      return prevList.filter(
                                        (item) => item !== d.id
                                      );
                                    } else {
                                      return [...prevList, d.id];
                                    }
                                  });
                                }}
                              >
                                <div>{d.a}</div>
                                <div>{d.b}</div>
                              </TransferItem>
                            );
                          })}
                        </TransferListBody>

                        <TransferListFooter>
                          總筆數：{mockSourceData.length}
                        </TransferListFooter>
                      </TransferList>
                    </TransferListWrapper>

                    <TransferBtnGroup>
                      <TransferBtn
                        $active={productSourceList.length > 0}
                        onClick={() => {
                          const list = [];
                          productSourceList.forEach((s) => {
                            const item = mockSourceData.find((d) => d.id === s);
                            list.push(item);
                          });
                          setMockTargetData((state) => [...state, ...list]);

                          // const newMockSourceData = mockSourceData.filter(
                          //   (d) => d.id !== s
                          // );
                          // setMockSourceData(newMockSourceData);
                        }}
                      >
                        <Image src="/arrow.svg" width={6} height={12} />
                      </TransferBtn>

                      <TransferBtn
                        style={{ transform: "rotate(180deg)" }}
                        $active={productTargetList.length > 0}
                      >
                        <Image src="/arrow.svg" width={6} height={12} />
                      </TransferBtn>
                    </TransferBtnGroup>

                    <TransferListWrapper>
                      <TransferListTitle>已選取促銷商品</TransferListTitle>
                      <TransferList>
                        <TransferListHeader>
                          <div>促銷ID</div>
                          <div>商品名稱</div>
                        </TransferListHeader>

                        <TransferListBody>
                          {mockTargetData.map((d, idx) => {
                            return (
                              <TransferItem
                                key={idx}
                                $isSelected={productTargetList.includes(d.id)}
                                onClick={() => {
                                  setProductTargetList((prevList) => {
                                    if (productTargetList.includes(d.id)) {
                                      return prevList.filter(
                                        (item) => item !== d.id
                                      );
                                    } else {
                                      return [...prevList, d.id];
                                    }
                                  });
                                }}
                              >
                                <div>{d.a}</div>
                                <div>{d.b}</div>
                              </TransferItem>
                            );
                          })}
                        </TransferListBody>

                        <TransferListFooter>
                          總筆數：{mockTargetData.length}
                        </TransferListFooter>
                      </TransferList>
                    </TransferListWrapper>
                  </TransferWrapper>
                </Col>
              </Row>

              <Row justify="end">
                <Col>
                  <Button type="primary">確認新增</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}
