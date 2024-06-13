"use client";
import React, { useState } from "react";
import { Breadcrumb, Radio } from "antd";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Input from "@/components/Input";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import ModalDelete from "@/components/Modal/ModalDelete";

import { PATH_SHIPPING_COMPANY } from "@/constants/paths";

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

const BtnGroup = styled.div`
  display: flex;
  margin-left: auto;
  gap: 0 16px;
`;

const TextCount = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(145, 158, 171, 1);
`;

const Page = (props) => {
  const { params } = props;
  const router = useRouter();

  const [openModalDelete, setOpenModalDelete] = useState(false);

  const isAdd = params.mode === "add";

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>貨運公司維護</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link href={PATH_SHIPPING_COMPANY}>貨運公司維護</Link>,
            },
            {
              title: "新增",
            },
          ]}
        />

        <BtnGroup>
          <Button onClick={() => router.push(PATH_SHIPPING_COMPANY)}>
            取消
          </Button>

          {isAdd ? (
            <>
              <Button type="primary">確定新增</Button>
            </>
          ) : (
            <>
              <Button onClick={() => setOpenModalDelete(true)}>
                刪除貨運公司
              </Button>
              <Button type="primary">保存</Button>
            </>
          )}
        </BtnGroup>
      </LayoutHeader>

      <Container>
        <Wrapper>
          <Title>基礎資料</Title>

          <Row>
            <Item>
              <ItemLabel>代碼</ItemLabel>
              <Input placeholder="請輸入代碼" disabled={!isAdd} />
              <TextCount>0/20</TextCount>
            </Item>

            <Item>
              <ItemLabel>貨運公司類型</ItemLabel>
              <Select
                style={{ width: "100%" }}
                placeholder="選擇貨運公司類型"
                disabled={!isAdd}
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
              <ItemLabel>貨運公司名稱</ItemLabel>
              <Input placeholder="請輸入貨運公司名稱" />
              <TextCount>0/50</TextCount>
            </Item>

            <Item></Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <Title>聯絡方式</Title>

          <Row>
            <Item>
              <ItemLabel>聯絡人</ItemLabel>
              <Input placeholder="請輸入聯絡人" />
              <TextCount>0/20</TextCount>
            </Item>

            <Item>
              <ItemLabel>地址</ItemLabel>
              <Input placeholder="請輸入地址" />
              <TextCount>0/200</TextCount>
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>聯絡電話</ItemLabel>
              <Input placeholder="請輸入貨運公司名稱" />
              <TextCount>0/20</TextCount>
            </Item>

            <Item></Item>
          </Row>
        </Wrapper>

        <Wrapper>
          <Title>其他設定</Title>

          <Row>
            <Item>
              <ItemLabel>啟用</ItemLabel>
              <Radio.Group
                style={{ display: "flex", flex: 1, alignItems: "center" }}
                defaultValue={1}
                // onChange={() => {}}
                // value={1}
              >
                <Radio value={1}>是</Radio>
                <Radio value={2}>否</Radio>
              </Radio.Group>
            </Item>
          </Row>

          <Row>
            <Item>
              <ItemLabel>備註</ItemLabel>
              <TextArea
                autoSize={{
                  minRows: 3,
                  maxRows: 3,
                }}
              />
            </Item>

            <Item></Item>
          </Row>
        </Wrapper>
      </Container>

      <ModalDelete
        open={openModalDelete}
        onOk={() => {}}
        onCancel={() => setOpenModalDelete(false)}
      />
    </>
  );
};

export default Page;
