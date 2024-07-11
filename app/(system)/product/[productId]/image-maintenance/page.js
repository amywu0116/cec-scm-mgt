"use client";
import { Breadcrumb, Col, Image, Row } from "antd";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import ModalDelete from "@/components/Modal/ModalDelete";
import Select from "@/components/Select";
import Table from "@/components/Table";

import { PATH_PRODUCT_PRODUCT_LIST } from "@/constants/paths";

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
  width: 100%;
`;

export default function Page() {
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
            { title: <Link href={PATH_PRODUCT_PRODUCT_LIST}>商品列表</Link> },
            { title: <Link href="">商品資料</Link> },
            { title: "圖片維護" },
          ]}
        />
      </LayoutHeader>

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Row gutter={16}>
                <Col span={8}>
                  <Item>
                    <ItemLabel>條碼</ItemLabel>
                    <Input />
                  </Item>
                </Col>

                <Col span={8}>
                  <Item>
                    <ItemLabel>品名</ItemLabel>
                    <Input />
                  </Item>
                </Col>

                <Col>
                  <Button
                    type="primary"
                    onClick={() => setShowImageUpload(true)}
                  >
                    上傳圖片
                  </Button>
                </Col>
              </Row>
            </Col>

            {showImageUpload && (
              <Col span={24}>
                <ImageCard>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Item>
                        <ItemLabel>圖片類型</ItemLabel>
                        <Select
                          style={{ width: "100%" }}
                          placeholder="請選擇圖片類型"
                          options={[]}
                        />
                      </Item>
                    </Col>

                    <Col>
                      <Button type="secondary">上傳</Button>
                    </Col>

                    <Col>
                      <Button type="default">新增</Button>
                    </Col>

                    <Col flex>
                      <Row gutter={16} justify="end">
                        <Col>
                          <Button
                            style={{ marginLeft: "auto" }}
                            type="secondary"
                          >
                            確認
                          </Button>
                        </Col>

                        <Col>
                          <Button
                            type="default"
                            onClick={() => setShowImageUpload(false)}
                          >
                            取消
                          </Button>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </ImageCard>
              </Col>
            )}
          </Row>
        </Col>

        <Col span={24}>
          <Table columns={columns} dataSource={data} pagination={false} />
        </Col>
      </Row>

      <ModalDelete
        open={showModalDelete}
        onCancel={() => setShowModalDelete(false)}
      />
    </>
  );
}
