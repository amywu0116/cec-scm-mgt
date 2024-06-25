"use client";
import { useState } from "react";
import { Breadcrumb, Image } from "antd";
import styled from "styled-components";
import Link from "next/link";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Table from "@/components/Table";
import FunctionBtn from "@/components/Button/FunctionBtn";
import ModalDelete from "@/components/Modal/ModalDelete";

import { PATH_PRODUCT_PRODUCT_LIST } from "@/constants/paths";

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

const Row = styled.div`
  display: flex;
  gap: 0 16px;
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
  min-width: 28px;
  flex-shrink: 0;
`;

const ImageCard = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Page = () => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const columns = [
    {
      title: "No",
      dataIndex: "a",
      align: "center",
    },
    {
      title: "圖片類型",
      dataIndex: "b",
      align: "center",
    },
    {
      title: "圖片",
      dataIndex: "c",
      align: "center",
      render: () => {
        return (
          <Image
            width={40}
            height={40}
            src="https://fakeimg.pl/580x580/"
            alt=""
          />
        );
      },
    },
    {
      title: "功能",
      dataIndex: "h",
      align: "center",
      render: (text, record, index) => {
        return (
          <FunctionBtn onClick={() => setShowModalDelete(true)}>
            刪除
          </FunctionBtn>
        );
      },
    },
  ];

  const data = [
    {
      a: "1",
      b: "商品圖",
      c: "",
      d: "",
    },
    {
      a: "1",
      b: "商品圖",
      c: "",
      d: "",
    },
  ];

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>圖片維護</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link href={PATH_PRODUCT_PRODUCT_LIST}>商品列表</Link>,
            },
            {
              title: <Link href="">商品資料</Link>,
            },
            {
              title: "圖片維護",
            },
          ]}
        />
      </LayoutHeader>

      <Container>
        <Wrapper>
          <Row>
            <Item>
              <ItemLabel>條碼</ItemLabel>
              <Input />
            </Item>

            <Item>
              <ItemLabel>品名</ItemLabel>
              <Input />
            </Item>

            <Button
              style={{ width: 220 }}
              type="primary"
              onClick={() => setShowImageUpload(true)}
            >
              上傳圖片
            </Button>
          </Row>

          {showImageUpload && (
            <Row>
              <ImageCard>
                <Item>
                  <ItemLabel>圖片類型</ItemLabel>
                  <Select
                    style={{ width: 342 }}
                    placeholder="請選擇圖片類型"
                    options={[
                      {
                        value: "lucy",
                        label: "Lucy",
                      },
                    ]}
                  />

                  <Button style={{ width: 86 }} type="secondary">
                    上傳
                  </Button>

                  <Button style={{ width: 86 }} type="default">
                    新增
                  </Button>

                  <ButtonGroup style={{ marginLeft: "auto" }}>
                    <Button style={{ width: 86 }} type="secondary">
                      確認
                    </Button>

                    <Button
                      style={{ width: 86 }}
                      type="default"
                      onClick={() => setShowImageUpload(false)}
                    >
                      取消
                    </Button>
                  </ButtonGroup>
                </Item>
              </ImageCard>
            </Row>
          )}
        </Wrapper>

        <Table columns={columns} dataSource={data} pagination={false} />
      </Container>

      <ModalDelete
        open={showModalDelete}
        onCancel={() => setShowModalDelete(false)}
      />
    </>
  );
};

export default Page;
