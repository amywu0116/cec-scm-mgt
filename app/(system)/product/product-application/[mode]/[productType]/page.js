"use client";
import React, { useState, useEffect } from "react";
import { App, Breadcrumb, Radio, Spin, Form } from "antd";
import styled from "styled-components";
import { useParams, useRouter } from "next/navigation";
import dayjs from "dayjs";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import DatePicker from "@/components/DatePicker";

import api from "@/api";
import { useBoundStore } from "@/store";
import { PATH_PRODUCT_PRODUCT_APPLICATION } from "@/constants/paths";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-form-item {
    .ant-form-item-label > label {
      height: 100%;
      font-size: 14px;
      font-weight: 700;
      color: #7b8093;

      &::after {
        margin-inline-end: 16px;
      }
    }
  }

  .ant-radio + span {
    word-break: keep-all;
  }
`;

const Wrapper = styled.div`
  /* display: flex;
  flex-direction: column;
  gap: 16px 0; */
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
  gap: 0 16px;
`;

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const dateFormat = "YYYY/MM/DD";

  const params = useParams();
  const isFood = params.productType === "food";

  const options = useBoundStore((state) => state.options);
  const veggieType = options?.veggie_type ?? [];

  const [loading, setLoading] = useState({ page: true });

  const [categoryList, setCategoryList] = useState([]);

  const fetchCategory = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/system/option/category`)
      .then((res) => setCategoryList(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  const handleFinish = (values) => {
    console.log("finish", values);
    const data = {
      scmCategoryCode: values.scmCategory?.categoryCode ?? undefined,
      scmCategoryName: values.scmCategory?.categoryName ?? undefined,
      isFood: isFood,
      // cartType: "1",
      itemName: values.itemName,
      itemNameEn: values.itemNameEn,
      vendorProdCode: values.vendorProdCode,
      itemEan: values.itemEan,
      itemSpec: values.itemSpec,
      isTax: values.isTax,
      price: values.price ? Number(values.price) : undefined,
      specialPrice: values.specialPrice
        ? Number(values.specialPrice)
        : undefined,
      itemCountry: values.itemCountry,
      vColor: values.vColor,
      vSize: values.vSize,
      vCapacity: values.vCapacity,
      vUnit: values.vUnit,
      vStyle: values.vStyle,
      certMark: values.certMark,
      energyEfficiency: values.energyEfficiency,
      productHeight: values.productHeight
        ? Number(values.productHeight)
        : undefined,
      productWidth: values.productWidth
        ? Number(values.productWidth)
        : undefined,
      productLength: values.productLength
        ? Number(values.productLength)
        : undefined,
      grossWeight: values.grossWeight ? Number(values.grossWeight) : undefined,
      netWeight: values.netWeight ? Number(values.netWeight) : undefined,
      expDateValue: values.expDateValue
        ? Number(values.expDateValue)
        : undefined,
      expDateUnit: values.expDateUnit,
      itemStoreway: values.itemStoreway,
      itemShortdescription: values.itemShortdescription,
      itemDetail: values.itemDetail,
      ingredients: values.ingredients,
      nutrition: values.nutrition,
      veggieType: values.veggieType,
      dutyInsurance: values.dutyInsurance,
      approvalId: values.approvalId,
      warrantyScope: values.warrantyScope,
      powerSpec: values.powerSpec,
      manufacturer: values.manufacturer,
      manufacturerPhone: values.manufacturerPhone,
      manufacturerAddress: values.manufacturerAddress,
      perpetual: values.perpetual,
      stockStartdate: values.stockStartdate
        ? dayjs(values.stockStartdate.$d).format(dateFormat)
        : undefined,
    };

    console.log("data", data);
    setLoading((state) => ({ ...state, page: true }));
    api
      .post(`v1/scm/product/apply/new`, data)
      .then((res) => {
        if (res.code !== "200") {
          message.error(res.data);
        } else {
          message.success("新增成功");
          router.push(PATH_PRODUCT_PRODUCT_APPLICATION);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  const handleFieldsChange = () => {};

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <Spin spinning={loading.page}>
      <LayoutHeader>
        <LayoutHeaderTitle>新增提品資料</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: "提品申請",
            },
            {
              title: isFood ? "新增提品資料_食品" : "新增提品資料_非食品",
            },
          ]}
        />

        <BtnGroup style={{ marginLeft: "auto" }}>
          <Button onClick={() => router.push(PATH_PRODUCT_PRODUCT_APPLICATION)}>
            關閉
          </Button>

          <Button type="primary" onClick={() => form.submit()}>
            暫存
          </Button>
        </BtnGroup>
      </LayoutHeader>

      <Form
        form={form}
        autoComplete="off"
        layout="horizontal"
        colon={false}
        labelCol={{ span: 6 }}
        labelWrap
        labelAlign="right"
        onFinish={handleFinish}
        onFieldsChange={handleFieldsChange}
      >
        <Container>
          <Wrapper>
            <Title>分類設定</Title>

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="scmCategory" label="分類">
                  <Select
                    placeholder="選擇分類"
                    options={categoryList.map((c) => {
                      return {
                        ...c,
                        label: c.categoryName,
                        value: c.categoryName,
                      };
                    })}
                    showSearch
                    onSelect={(value, option) => {
                      form.setFieldValue("scmCategory", option);
                    }}
                  />
                </Form.Item>
              </Item>

              <Item></Item>
              <Item></Item>
            </Row>

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="itemName" label="中文品名">
                  <Input placeholder="請輸入中文品名" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="itemNameEn"
                  label="英文品名"
                >
                  <Input placeholder="請輸入英文品名" />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>

            <Row>
              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="vendorProdCode"
                  label="供應商商品編號"
                >
                  <Input placeholder="請輸入供應商商品編號" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="itemCountry"
                  label="生產國家"
                >
                  <Input placeholder="請輸入生產國家" />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="itemEan" label="條碼">
                  <Input placeholder="請輸入條碼" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item style={{ flex: 1 }} name="itemSpec" label="規格">
                  <Input placeholder="請輸入規格" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item style={{ flex: 1 }} name="isTax" label="應/免稅">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="請輸入應/免稅"
                    options={[
                      {
                        label: "應稅",
                        value: true,
                      },
                      {
                        label: "未稅",
                        value: false,
                      },
                    ]}
                  />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="price" label="原價">
                  <Input placeholder="請輸入原價" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="specialPrice"
                  label="促銷價"
                >
                  <Input placeholder="請輸入促銷價" />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>
          </Wrapper>

          <Wrapper>
            <Title>容量和重量</Title>

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="vCapacity" label="容量">
                  <Input placeholder="請輸入容量" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item style={{ flex: 1 }} name="vUnit" label="容量單位">
                  <Input placeholder="請輸入容量單位" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item style={{ flex: 1 }} name="1" label="庫存單位">
                  <Input placeholder="請輸入庫存單位" />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="2" label="陳列單位(數字)">
                  <Input placeholder="請輸入陳列單位(數字)" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item style={{ flex: 1 }} name="3" label="陳列容量">
                  <Input placeholder="請輸入陳列容量" />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>

            <Row>
              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="productHeight"
                  label="商品高度(cm)"
                >
                  <Input placeholder="請輸入商品高度(cm)" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="productWidth"
                  label="商品寬度(cm)"
                >
                  <Input placeholder="請輸入商品寬度(cm)" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="productLength"
                  label="商品長度(cm)"
                >
                  <Input placeholder="請輸入商品長度(cm)" />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="grossWeight"
                  label="重量-毛重"
                >
                  <Input placeholder="請輸入重量-毛重" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="netWeight"
                  label="重量-淨重"
                >
                  <Input placeholder="請輸入重量-淨重" />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>
          </Wrapper>

          <Wrapper>
            <Title>其他資訊</Title>

            <Row>
              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="expDateValue"
                  label="保存日期"
                >
                  <Input placeholder="請輸入保存日期" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="expDateUnit"
                  label="保存日期單位"
                >
                  <Input placeholder="請輸入保存日期單位" />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>

            {!isFood && (
              <Row>
                <Item>
                  <Form.Item
                    style={{ flex: 1 }}
                    name="powerSpec"
                    label="電源規格"
                  >
                    <Input placeholder="請輸入電源規格" />
                  </Form.Item>
                </Item>

                <Item></Item>
              </Row>
            )}

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="vColor" label="顏色">
                  <Input placeholder="請輸入顏色" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item style={{ flex: 1 }} name="vSize" label="尺寸">
                  <Input placeholder="請輸入尺寸" />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="4" label="等級">
                  <Input placeholder="請輸入等級" />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="itemStoreway"
                  label="保存方式(文字)"
                >
                  <Input placeholder="請輸入保存方式" />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="vStyle" label="款式">
                  <Input placeholder="請輸入款式" />
                </Form.Item>
              </Item>

              <Item></Item>
              <Item></Item>
            </Row>

            <Row>
              <Item>
                <Form.Item name="perpetual" label="庫存">
                  <Radio.Group
                    style={{ display: "flex", alignItems: "center" }}
                    defaultValue={1}
                  >
                    <Radio value={false}>不庫控</Radio>
                    <Radio value={true}>活動庫存</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="5">
                  <Input style={{ width: 102, flex: 1 }} placeholder="數量" />
                </Form.Item>

                <Form.Item name="stockStartdate">
                  <DatePicker
                    style={{ flex: 1 }}
                    placeholder="起始日期"
                    format="YYYY/MM/DD"
                  />
                </Form.Item>
              </Item>

              {/* <Item></Item>
              <Item></Item> */}
            </Row>

            <Row>
              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="itemShortdescription"
                  label="商品特色說明"
                >
                  <TextArea
                    placeholder="請輸入商品特色說明"
                    autoSize={{
                      minRows: 3,
                      maxRows: 3,
                    }}
                  />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="itemDetail"
                  label="商品完整說明(文字)"
                >
                  <TextArea
                    placeholder="請輸入商品完整說明(文字)"
                    autoSize={{
                      minRows: 3,
                      maxRows: 3,
                    }}
                  />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>

            {isFood && (
              <>
                <Row>
                  <Item>
                    <Form.Item
                      style={{ flex: 1 }}
                      name="manufacturer"
                      label="國內負責廠商名稱"
                      rules={[
                        {
                          required: true,
                          message: "必填",
                        },
                      ]}
                    >
                      <Input placeholder="請輸入國內負責廠商名稱" />
                    </Form.Item>
                  </Item>

                  <Item>
                    <Form.Item
                      style={{ flex: 1 }}
                      name="manufacturerPhone"
                      label="電話"
                      rules={[
                        {
                          required: true,
                          message: "必填",
                        },
                      ]}
                    >
                      <Input placeholder="請輸入電話" />
                    </Form.Item>
                  </Item>

                  <Item>
                    <Form.Item
                      style={{ flex: 1 }}
                      name="manufacturerAddress"
                      label="地址"
                      rules={[
                        {
                          required: true,
                          message: "必填",
                        },
                      ]}
                    >
                      <Input placeholder="請輸入地址" />
                    </Form.Item>
                  </Item>
                </Row>

                <Row>
                  <Item>
                    <Form.Item
                      style={{ flex: 1 }}
                      name="veggieType"
                      label="素食種類"
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="請選擇素食種類"
                        options={veggieType.map((v) => ({
                          ...v,
                          label: v.name,
                          value: v.value,
                        }))}
                      />
                    </Form.Item>
                  </Item>

                  <Item></Item>
                  <Item></Item>
                </Row>

                <Row>
                  <Item>
                    <Form.Item
                      style={{ flex: 1 }}
                      name="ingredients"
                      label="產品成份及食品添加物(文字)"
                      rules={[
                        {
                          required: true,
                          message: "必填",
                        },
                      ]}
                    >
                      <TextArea
                        placeholder="請輸入產品成份及食品添加物(文字)"
                        autoSize={{
                          minRows: 3,
                          maxRows: 3,
                        }}
                      />
                    </Form.Item>
                  </Item>

                  <Item>
                    <Form.Item
                      style={{ flex: 1 }}
                      name="nutrition"
                      label="營養標示(文字)"
                      rules={[
                        {
                          required: true,
                          message: "必填",
                        },
                      ]}
                    >
                      <TextArea
                        placeholder="請輸入營養標示(文字)"
                        autoSize={{
                          minRows: 3,
                          maxRows: 3,
                        }}
                      />
                    </Form.Item>
                  </Item>

                  <Item></Item>
                </Row>
              </>
            )}

            <Row>
              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="dutyInsurance"
                  label="產品責任險"
                  rules={[
                    {
                      required: true,
                      message: "必填",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="請輸入產品責任險"
                    autoSize={{
                      minRows: 3,
                      maxRows: 3,
                    }}
                  />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="approvalId"
                  label="產品核准字號"
                  rules={[
                    {
                      required: true,
                      message: "必填",
                    },
                  ]}
                >
                  <TextArea
                    placeholder="請輸入產品核准字號"
                    autoSize={{
                      minRows: 3,
                      maxRows: 3,
                    }}
                  />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>

            {!isFood && (
              <>
                <Row>
                  <Item>
                    <Form.Item
                      style={{ flex: 1 }}
                      name="warrantyScope"
                      label="保固範圍(文字)"
                    >
                      <TextArea
                        placeholder="請輸入保固範圍(文字)"
                        autoSize={{
                          minRows: 3,
                          maxRows: 3,
                        }}
                      />
                    </Form.Item>
                  </Item>

                  <Item>
                    <Form.Item
                      style={{ flex: 1 }}
                      name="approvalOther"
                      label="其他證明(文字)"
                    >
                      <TextArea
                        placeholder="請輸入其他證明(文字)"
                        autoSize={{
                          minRows: 3,
                          maxRows: 3,
                        }}
                      />
                    </Form.Item>
                  </Item>
                </Row>
              </>
            )}

            <Row>
              <Item>
                <Form.Item style={{ flex: 1 }} name="certMark" label="標章">
                  <TextArea
                    placeholder="請輸入標章"
                    autoSize={{
                      minRows: 3,
                      maxRows: 3,
                    }}
                  />
                </Form.Item>
              </Item>

              <Item>
                <Form.Item
                  style={{ flex: 1 }}
                  name="energyEfficiency"
                  label="能源效率"
                >
                  <TextArea
                    placeholder="請輸入能源效率"
                    autoSize={{
                      minRows: 3,
                      maxRows: 3,
                    }}
                  />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>
          </Wrapper>
        </Container>
      </Form>
    </Spin>
  );
};

export default Page;
