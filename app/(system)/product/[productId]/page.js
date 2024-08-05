"use client";
import {
  App,
  Breadcrumb,
  Col,
  Flex,
  Form,
  Radio,
  Row,
  Space,
  Spin,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import ModalPreviewPDP from "./ModalPreviewPDP";

import api from "@/api";
import { PATH_PRODUCT_PRODUCT_LIST } from "@/constants/paths";

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
  margin-bottom: 16px;
`;

const CategoryLabel = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: rgba(89, 89, 89, 1);
`;

export default function Page() {
  const { message } = App.useApp();
  const params = useParams();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({ page: false });
  const [showModal, setShowModal] = useState({ previewPDP: false });

  const [isEditing, setIsEditing] = useState(false);
  const [shippingList, setShippingList] = useState([]);

  const scmCategoryCode = form.getFieldValue("scmCategoryCode");
  const scmCategoryName = form.getFieldValue("scmCategoryName");

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/scm/product/${params.productId}`)
      .then((res) => {
        form.setFieldsValue({
          ...res.data,
        });
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const fetchShipping = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/vendor/shipping")
      .then((res) => {
        setShippingList(res.data);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const handleFinish = (values) => {};

  useEffect(() => {
    fetchInfo();
    fetchShipping();
  }, []);

  return (
    <>
      <Spin spinning={loading.page}>
        <LayoutHeader>
          <LayoutHeaderTitle>商品列表</LayoutHeaderTitle>

          <Breadcrumb
            separator=">"
            items={[
              { title: <Link href={PATH_PRODUCT_PRODUCT_LIST}>商品列表</Link> },
              { title: "商品資料" },
            ]}
          />

          <Space style={{ marginLeft: "auto" }} size={16}>
            {isEditing ? (
              <>
                <Button type="default" onClick={() => setIsEditing(false)}>
                  取消
                </Button>

                <Button type="primary" onClick={() => setIsEditing(false)}>
                  確認修改
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" onClick={() => setIsEditing(true)}>
                  編輯修改
                </Button>

                <Link href={"/product/123/image-maintenance"}>
                  <Button type="secondary">圖片維護</Button>
                </Link>
              </>
            )}

            <Button
              type="secondary"
              onClick={() => {
                setShowModal((state) => ({ ...state, previewPDP: true }));
              }}
            >
              PDP預覽
            </Button>
          </Space>
        </LayoutHeader>

        <Form
          form={form}
          autoComplete="off"
          colon={false}
          labelCol={{ flex: "80px" }}
          labelWrap
          labelAlign="left"
          disabled={!isEditing}
          onFinish={handleFinish}
        >
          <Row>
            <Col span={24}>
              <Title>基本設定</Title>

              <Flex gap={16}>
                <Form.Item name="cartType" label="分車類型">
                  <Select
                    style={{ width: 350 }}
                    placeholder="請選擇分車類型"
                    showSearch
                    allowClear
                    options={shippingList.map((opt) => ({
                      ...opt,
                      label: `${opt.cartTypeName}(出貨天數: ${opt.shippingDays})`,
                      value: opt.cartType,
                    }))}
                  />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item label="商品分類">
                  <CategoryLabel style={{ width: 350 }}>
                    {scmCategoryCode} / {scmCategoryName}
                  </CategoryLabel>
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item style={{ flex: 1 }} name="itemName" label="品牌">
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="itemCountry"
                  label="生產國家"
                >
                  <Input />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item style={{ flex: 1 }} name="itemName" label="中文品名">
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="itemNameEn"
                  label="英文品名"
                >
                  <Input />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="vendorProdCode"
                  label="供應商商品編號"
                >
                  <Input />
                </Form.Item>

                <Form.Item style={{ flex: 1 }} name="itemSpec" label="規格">
                  <Input />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item style={{ flex: 1 }} name="itemEan" label="條碼">
                  <Input />
                </Form.Item>

                <Form.Item style={{ flex: 1 }} name="isTax" label="應/免稅">
                  <Select
                    placeholder="請輸入應/免稅"
                    showSearch
                    allowClear
                    options={[
                      { label: "應稅", value: true },
                      { label: "未稅", value: false },
                    ]}
                  />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item style={{ flex: 1 }} name="price" label="原價">
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="specialPrice"
                  label="促銷價"
                >
                  <Input />
                </Form.Item>
              </Flex>
            </Col>

            <Col span={24}>
              <Title>容量和重量</Title>

              <Flex gap={16}>
                <Form.Item style={{ flex: 1 }} name="vCapacity" label="容量">
                  <Input />
                </Form.Item>

                <Form.Item style={{ flex: 1 }} name="vUnit" label="容量單位">
                  <Input />
                </Form.Item>

                {/* <Form.Item name="" label="庫存單位">
                <Input />
              </Form.Item> */}
              </Flex>

              {/* <Flex gap={16}>
            <Form.Item name="" label="陳列單位(數字)">
                <Input />
              </Form.Item>

              <Form.Item name="" label="陳列容量">
                <Input />
              </Form.Item>
            </Flex> */}

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="productHeight"
                  label="商品高度(cm)"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="productWidth"
                  label="商品寬度(cm)"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="productLength"
                  label="商品長度(cm)"
                >
                  <Input />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="grossWeight"
                  label="重量-毛重"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="netWeight"
                  label="重量-淨重"
                >
                  <Input />
                </Form.Item>
              </Flex>
            </Col>

            <Col span={24}>
              <Title>其他資訊</Title>

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="expDateValue"
                  label="保存日期"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="expDateUnit"
                  label="保存日期單位"
                >
                  <Input />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="powerSpec"
                  label="電源規格"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="itemStoreway"
                  label="保存方式(文字)"
                >
                  <Input />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item style={{ flex: 1 }} name="vColor" label="顏色">
                  <Input />
                </Form.Item>

                <Form.Item style={{ flex: 1 }} name="vSize" label="尺寸">
                  <Input />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                {/* <Form.Item name="" label="入數">
                <Input />
              </Form.Item> */}
              </Flex>

              {/* <Flex gap={16}>
              <Form.Item name="" label="款式">
                <Input />
              </Form.Item>
            </Flex> */}

              <Flex gap={16}>
                <Form.Item name="perpetual" label="庫存">
                  <Radio.Group
                    // style={{ width: 250 }}
                    disabled
                    options={[
                      { label: "不庫控", value: false },
                      { label: "活動庫存", value: true },
                    ]}
                  />
                </Form.Item>

                <Form.Item name="">
                  <Input placeholder="數量" disabled />
                </Form.Item>

                <Form.Item name="">
                  <DatePicker
                    placeholder="起始日期"
                    format="YYYY/MM/DD"
                    disabled
                  />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="itemShortdescription"
                  label="商品特色說明"
                >
                  <TextArea
                    placeholder="請輸入商品特色說明"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="itemDetail"
                  label="商品完整說明(文字)"
                >
                  <TextArea
                    placeholder="請輸入商品完整說明(文字)"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="ingredients"
                  label="產品成份及食品添加物(文字)"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <TextArea
                    placeholder="請輸入產品成份及食品添加物(文字)"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="nutrition"
                  label="營養標示(文字)"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <TextArea
                    placeholder="請輸入營養標示(文字)"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="manufacturer"
                  label="國內負責廠商名稱"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="請輸入國內負責廠商名稱" />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="manufacturerPhone"
                  label="電話"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="請輸入電話" />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="manufacturerAddress"
                  label="地址"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="請輸入地址" />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="dutyInsurance"
                  label="產品責任險"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <TextArea
                    placeholder="請輸入產品責任險"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="approvalId"
                  label="產品核准字號"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <TextArea
                    placeholder="請輸入產品核准字號"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item
                  style={{ flex: 1 }}
                  name="warrantyScope"
                  label="保固範圍(文字)"
                >
                  <TextArea
                    placeholder="請輸入保固範圍(文字)"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="approvalOther"
                  label="其他證明(文字)"
                >
                  <TextArea
                    placeholder="請輸入其他證明(文字)"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Flex>

              <Flex gap={16}>
                <Form.Item style={{ flex: 1 }} name="certMark" label="標章">
                  <TextArea
                    placeholder="請輸入標章"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>

                <Form.Item
                  style={{ flex: 1 }}
                  name="energyEfficiency"
                  label="能源效率"
                >
                  <TextArea
                    placeholder="請輸入能源效率"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Flex>
            </Col>
          </Row>
        </Form>
      </Spin>

      <ModalPreviewPDP
        open={showModal.previewPDP}
        onCancel={() => {
          setShowModal((state) => ({ ...state, previewPDP: false }));
        }}
      />
    </>
  );
}
