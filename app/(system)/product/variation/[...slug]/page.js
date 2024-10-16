"use client";
import { App, Breadcrumb, Col, Flex, Form, Row, Spin } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Button from "@/components/Button";
import ResetBtn from "@/components/Button/ResetBtn";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";

import Transfer from "./Transfer";

import api from "@/api";
import { routes } from "@/routes";
import { useBoundStore } from "@/store";

const Container = styled.div`
  .ant-checkbox-group {
    gap: 20px 18px;
  }

  .form-item-cartType {
    .ant-col.ant-form-item-control {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .ant-form-item-explain-error {
      margin-left: 10px;
    }
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
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const params = useParams();
  const router = useRouter();
  const selectedKey = "productnumber";

  const isAdd = params.slug[0] === "add";
  const isEdit = params.slug[0] === "edit";
  const id = isEdit && params.slug[1];

  const options = useBoundStore((state) => state.options);
  const variationType = options?.variation_type ?? [];

  const columns = [
    {
      title: "商城商品編號",
      dataIndex: "productnumber",
    },
    {
      title: "商品名稱",
      dataIndex: "itemName",
    },
  ];

  const [loading, setLoading] = useState({
    page: false,
    search: false,
    confirm: false,
  });

  const [productSourceList, setProductSourceList] = useState([]);
  const [productTargetList, setProductTargetList] = useState([]);

  const [selectedSourceList, setSelectedSourceList] = useState([]);
  const [selectedTargetList, setSelectedTargetList] = useState([]);

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/scm/variation/${id}`)
      .then((res) => {
        form.setFieldsValue({
          mainProductId: res.data.mainProductId,
          mainItemName: res.data.itemName,
          variationAttributeId1: res.data.variationAttributeId1,
          variationAttributeId2: res.data.variationAttributeId2,
        });

        if (res.data.info.length > 0) {
          setProductTargetList(res.data.info);
        }
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  const getPageTitle = () => {
    if (isEdit) return "編輯樣式商品";
    if (isAdd) return "新增樣式商品";
    return "";
  };

  // 確認新增/編輯
  const handleFinish = (values) => {
    if (productTargetList.length === 0) {
      message.error("必須至少選取一筆商品");
      return;
    }

    const data = {
      id: isEdit ? id : undefined,
      variationAttributeId1: values.variationAttributeId1
        ? values.variationAttributeId1
        : undefined,
      variationAttributeId2: values.variationAttributeId2
        ? values.variationAttributeId2
        : undefined,
      itemName: values.mainItemName ? values.mainItemName : undefined,
      info: productTargetList,
    };

    setLoading((state) => ({ ...state, page: true, confirm: true }));
    api
      .post(`v1/scm/variation/new`, data)
      .then((res) => {
        message.success(res.message);
        router.push(routes.product.variation);
      })
      .catch((err) => message.error(err.message))
      .finally(() => {
        setLoading((state) => ({ ...state, page: false, confirm: false }));
      });
  };

  // 查詢商品
  const handleSearch = () => {
    const variationAttributeId1 = form.getFieldValue("variationAttributeId1");
    const variationAttributeId2 = form.getFieldValue("variationAttributeId2");
    const productnumber = form.getFieldValue("productnumber");
    const itemName = form.getFieldValue("itemName");

    if (!variationAttributeId1 && !variationAttributeId2) {
      message.error("必須至少填寫一個樣式種類");
      return;
    }

    const params = {
      offset: 0,
      max: 99999,
      variationAttributeId1: variationAttributeId1
        ? variationAttributeId1
        : undefined,
      variationAttributeId2: variationAttributeId2
        ? variationAttributeId2
        : undefined,
      productnumber: productnumber ? productnumber : undefined,
      itemName: itemName ? itemName : undefined,
    };

    setLoading((state) => ({ ...state, search: true }));
    api
      .get(`v1/scm/product`, { params })
      .then((res) => {
        const list = res.data.rows.map((row) => {
          return {
            itemName: row.itemName,
            productnumber: row.productnumber,
          };
        });
        setProductSourceList(list);
        setSelectedSourceList([]);
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, search: false })));
  };

  const handleSourceToTarget = () => {
    if (selectedSourceList.length === 0) return;
    const list = [];
    selectedSourceList.forEach((s) => {
      const item = productSourceList.find((d) => d[selectedKey] === s);
      list.push(item);
    });

    const newProductSourceList = productSourceList.filter(
      (d) => !selectedSourceList.includes(d[selectedKey])
    );

    setProductTargetList((state) => [...state, ...list]);
    setProductSourceList(newProductSourceList);
    setSelectedSourceList([]);
  };

  const handleTargetToSource = () => {
    if (selectedTargetList.length === 0) return;
    const list = [];
    selectedTargetList.forEach((s) => {
      const item = productTargetList.find((d) => d[selectedKey] === s);
      list.push(item);
    });

    const newProductTargetList = productTargetList.filter(
      (d) => !selectedTargetList.includes(d[selectedKey])
    );

    setProductSourceList((state) => [...state, ...list]);
    setProductTargetList(newProductTargetList);
    setSelectedTargetList([]);
  };

  // 清除查詢條件
  const handleResetSearch = () => {
    form.resetFields(["productnumber", "itemName"]);
  };

  useEffect(() => {
    if (isEdit) {
      fetchInfo();
    }
  }, []);

  return (
    <>
      <Spin spinning={loading.page}>
        <LayoutHeader>
          <LayoutHeaderTitle>{getPageTitle()}</LayoutHeaderTitle>
          <Breadcrumb
            separator=">"
            items={[
              { title: <Link href={routes.product.variation}>樣式商品</Link> },
              { title: getPageTitle() },
            ]}
          />
        </LayoutHeader>

        <Container>
          <Form
            form={form}
            colon={false}
            labelCol={{ flex: "120px" }}
            labelWrap
            autoComplete="off"
            onFinish={handleFinish}
          >
            <Flex vertical>
              <Card>
                <Row gutter={32}>
                  {isEdit && (
                    <Col span={8}>
                      <Form.Item
                        name="mainProductId"
                        label="主商品編號"
                        rules={[{ required: true, message: "必填" }]}
                      >
                        <Input placeholder="請輸入主商品編號" disabled />
                      </Form.Item>
                    </Col>
                  )}

                  <Col span={8}>
                    <Form.Item
                      name="mainItemName"
                      label="主商品名稱"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Input placeholder="請輸入主商品名稱" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={32}>
                  <Col span={8}>
                    <Form.Item
                      name="variationAttributeId1"
                      label="樣式種類1"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Select
                        placeholder="選擇樣式種類1"
                        popupMatchSelectWidth={false}
                        options={variationType.map((opt) => {
                          return { ...opt, label: opt.name };
                        })}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item name="variationAttributeId2" label="樣式種類2">
                      <Select
                        placeholder="選擇樣式種類2"
                        popupMatchSelectWidth={false}
                        options={variationType.map((opt) => {
                          return { ...opt, label: opt.name };
                        })}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>

              <Row
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(228, 231, 237, 1)",
                }}
                gutter={16}
              >
                <Col span={6}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="productnumber"
                    label="商城商品編號"
                    labelCol={{ flex: "110px" }}
                  >
                    <Input
                      placeholder="請輸入商城商品編號"
                      disabled={loading.search}
                    />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="itemName"
                    label="商品名稱"
                  >
                    <Input
                      placeholder="請輸入商品名稱"
                      disabled={loading.search}
                    />
                  </Form.Item>
                </Col>

                <Col span={6}>
                  <Flex gap={16} align="center">
                    <Button
                      type="secondary"
                      loading={loading.search}
                      onClick={handleSearch}
                    >
                      查詢
                    </Button>

                    <ResetBtn onClick={handleResetSearch}>
                      清除查詢條件
                    </ResetBtn>
                  </Flex>
                </Col>
              </Row>

              <Spin spinning={loading.search}>
                <TransferWrapper>
                  <Transfer
                    title="選擇要加入的商品"
                    columns={columns}
                    dataSource={productSourceList}
                    selectedKey={selectedKey}
                    selectedList={selectedSourceList}
                    setSelectedList={setSelectedSourceList}
                  />

                  <TransferBtnGroup>
                    <TransferBtn
                      $active={selectedSourceList.length > 0}
                      onClick={handleSourceToTarget}
                    >
                      <Image src="/arrow.svg" width={6} height={12} alt="" />
                    </TransferBtn>

                    <TransferBtn
                      style={{ transform: "rotate(180deg)" }}
                      $active={selectedTargetList.length > 0}
                      onClick={handleTargetToSource}
                    >
                      <Image src="/arrow.svg" width={6} height={12} alt="" />
                    </TransferBtn>
                  </TransferBtnGroup>

                  <Transfer
                    title="已選取樣式商品"
                    columns={columns}
                    dataSource={productTargetList}
                    selectedKey={selectedKey}
                    selectedList={selectedTargetList}
                    setSelectedList={setSelectedTargetList}
                  />
                </TransferWrapper>
              </Spin>

              <Row justify="end">
                <Button type="primary" htmlType="submit">
                  {isEdit ? "確認編輯" : "確認新增"}
                </Button>
              </Row>
            </Flex>
          </Form>
        </Container>
      </Spin>
    </>
  );
}
