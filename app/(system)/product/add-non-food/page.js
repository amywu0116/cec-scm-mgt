"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Radio } from "antd";
import styled, { css } from "styled-components";
import Link from "next/link";
import { PlusOutlined } from "@ant-design/icons";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TextArea from "@/components/TextArea";
import Image from "next/image";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #212b36;
  margin-right: 32px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const SpecCard = styled.div`
  background-color: rgba(241, 243, 246, 1);
  padding: 8px 16px;
  display: flex;
  gap: 0 32px;
`;

const SpecItem = styled.div`
  display: flex;
`;

const SpecButton = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const SpecItemContentList = styled.div`
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px 0;
`;

const SpecItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0 8px;
`;

const Page = () => {
  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>新增提品資料</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "提品申請",
            },
            {
              title: "新增提品資料_非食品",
            },
          ]}
        />

        <ButtonGroup style={{ marginLeft: "auto" }}>
          <Button>關閉</Button>
          <Button type="primary">暫存</Button>
        </ButtonGroup>
      </LayoutHeader>

      <Container>
        <Wrapper>
          <Title>分類設定</Title>

          <Row>
            <Item>
              <ItemLabel>分類1</ItemLabel>
              <Select
                style={{ width: "100%" }}
                placeholder="選擇分類"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <Item>
              <ItemLabel>分類2</ItemLabel>
              <Select
                style={{ width: "100%" }}
                placeholder="選擇分類"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <Item>
              <ItemLabel>分類3</ItemLabel>
              <Select
                style={{ width: "100%" }}
                placeholder="選擇分類"
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
              <ItemLabel>分類4</ItemLabel>
              <Select
                style={{ width: "100%" }}
                placeholder="選擇分類"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <Item>
              <ItemLabel>分類5</ItemLabel>
              <Select
                style={{ width: "100%" }}
                placeholder="選擇分類"
                options={[
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                ]}
              />
            </Item>

            <Item></Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>中文品名</ItemLabel>
              <Input style={{ width: 444 }} placeholder="請輸入品名" />
            </Item>

            <Item>
              <ItemLabel>英文品名</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>供應商商品編號</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>

            <Item>
              <ItemLabel>銷售碼 Unitcode</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>條碼</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>

            <Item>
              <ItemLabel>應/免稅</ItemLabel>
              <Select
                style={{ width: 444 }}
                placeholder=""
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
              <ItemLabel>建議售價(含稅)</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>

            <Item>
              <ItemLabel>生產國家</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <Title>容量和重量</Title>

          <Row>
            <Item>
              <ItemLabel>容量</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>

            <Item>
              <ItemLabel>容量單位</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>

            <Item>
              <ItemLabel>庫存單位</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>陳列單位(數字)</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>

            <Item>
              <ItemLabel>陳列容量</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>

            <Item></Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>商品高度(cm)</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>

            <Item>
              <ItemLabel>商品寬度(cm)</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>

            <Item>
              <ItemLabel>商品長度(cm)</ItemLabel>
              <Input style={{ width: 250 }} placeholder="請輸入品名" />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>重量-毛重</ItemLabel>
              <Input style={{ width: 444 }} placeholder="請輸入重量-毛重" />
            </Item>

            <Item>
              <ItemLabel>重量-淨重</ItemLabel>
              <Input style={{ width: 444 }} placeholder="請輸入重量-淨重" />
            </Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <Title>其他資訊</Title>

          <Row>
            <Item>
              <ItemLabel>保存日期</ItemLabel>
              <Input style={{ width: 444 }} placeholder="請輸入保存日期" />
            </Item>

            <Item>
              <ItemLabel>保存日期單位</ItemLabel>
              <Select
                style={{ width: 444 }}
                placeholder="請選擇保存日期單位"
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
              <ItemLabel>電源規格</ItemLabel>
              <Input style={{ width: 444 }} placeholder="請輸入電源規格" />
            </Item>

            <Item>
              <ItemLabel>影片檔Youtube之影音URL</ItemLabel>
              <Input
                style={{ width: 444 }}
                placeholder="請輸入影片檔Youtube之影音URL"
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>多規</ItemLabel>
              <Radio.Group
                style={{ display: "flex", alignItems: "center" }}
                defaultValue={1}
              >
                <Radio value={1}>否</Radio>
                <Radio value={2}>是</Radio>
              </Radio.Group>
            </Item>
          </Row>

          <Row>
            <SpecCard>
              <SpecItem>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ItemLabel>規格一</ItemLabel>
                  <Select
                    style={{ width: 90 }}
                    placeholder="選擇"
                    options={[
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                    ]}
                  />
                </div>

                <SpecItemContentList>
                  <SpecItemContent>
                    <Input
                      style={{ width: 298 }}
                      placeholder="請輸入項目內容"
                    />
                    <SpecButton>
                      <Image src="/button-add.svg" fill alt="" />
                    </SpecButton>

                    <SpecButton>
                      <Image src="/button-remove.svg" fill alt="" />
                    </SpecButton>
                  </SpecItemContent>
                </SpecItemContentList>
              </SpecItem>

              <SpecItem>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ItemLabel>規格二</ItemLabel>
                  <Select
                    style={{ width: 90 }}
                    placeholder="選擇"
                    options={[
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                    ]}
                  />
                </div>

                <SpecItemContentList>
                  <SpecItemContent>
                    <Input
                      style={{ width: 298 }}
                      placeholder="請輸入項目內容"
                    />
                    <SpecButton>
                      <Image src="/button-add.svg" fill alt="" />
                    </SpecButton>
                  </SpecItemContent>
                </SpecItemContentList>
              </SpecItem>
              <SpecItemContentList></SpecItemContentList>
            </SpecCard>
          </Row>

          <Row>
            <Item>
              <ItemLabel>顏色</ItemLabel>
              <Input style={{ width: 444 }} placeholder="請輸入顏色" />
            </Item>

            <Item>
              <ItemLabel>尺寸</ItemLabel>
              <Input style={{ width: 444 }} placeholder="請輸入尺寸" />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>等級</ItemLabel>
              <Input style={{ width: 444 }} placeholder="請輸入等級" />
            </Item>

            <Item>
              <ItemLabel>保存方式(文字)</ItemLabel>
              <Input style={{ width: 444 }} placeholder="請輸入保存方式" />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>等級</ItemLabel>
              <Radio.Group
                style={{ display: "flex", alignItems: "center" }}
                defaultValue={1}
              >
                <Radio value={1}>不庫控</Radio>
                <Radio value={2}>活動庫存</Radio>
              </Radio.Group>

              <Input style={{ width: 102, flex: 1 }} placeholder="數量" />

              <Input style={{ width: 102, flex: 1 }} placeholder="起始日期" />
            </Item>

            <Item></Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>商品特色說明</ItemLabel>
              <TextArea
                style={{ width: 444 }}
                placeholder="請輸入商品特色說明"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
              />
            </Item>

            <Item>
              <ItemLabel>商品完整說明(文字)</ItemLabel>
              <TextArea
                style={{ width: 444 }}
                placeholder="請輸入商品完整說明(文字)"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>產品責任險</ItemLabel>
              <TextArea
                style={{ width: 444 }}
                placeholder="請輸入產品責任險"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
              />
            </Item>

            <Item>
              <ItemLabel>產品核准字號</ItemLabel>
              <TextArea
                style={{ width: 444 }}
                placeholder="請輸入產品核准字號"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
              />
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>保固範圍(文字)</ItemLabel>
              <TextArea
                style={{ width: 444 }}
                placeholder="請輸入保固範圍(文字)"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
              />
            </Item>

            <Item>
              <ItemLabel>其他證明(文字)</ItemLabel>
              <TextArea
                style={{ width: 444 }}
                placeholder="請輸入其他證明(文字)"
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
              />
            </Item>
          </Row>
        </Wrapper>
      </Container>
    </>
  );
};

export default Page;
