"use client";
import React, { useState, useEffect } from "react";
import { App, Breadcrumb, Radio, Spin, Form } from "antd";
import styled from "styled-components";
import { useParams, useRouter } from "next/navigation";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";

import api from "@/api";
import { useBoundStore } from "@/store";
import { PATH_PRODUCT_PRODUCT_APPLICATION } from "@/constants/paths";

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 0 16px;
`;

const Page = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { message } = App.useApp();

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
      scmCategoryCode: values.scmCategory.categoryCode,
      scmCategoryName: values.scmCategory.categoryName,
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
      stockStartdate: values.stockStartdate,
    };

    console.log("data", data);
    setLoading((state) => ({ ...state, page: true }));
    api
      .post(`v1/scm/product/apply/new`, data)
      .then((res) => {
        if (res.message !== "200") {
          message.error(res.data);
          return;
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

        <ButtonGroup style={{ marginLeft: "auto" }}>
          <Button onClick={() => router.push(PATH_PRODUCT_PRODUCT_APPLICATION)}>
            關閉
          </Button>

          <Button type="primary" onClick={() => form.submit()}>
            暫存
          </Button>
        </ButtonGroup>
      </LayoutHeader>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        onFieldsChange={handleFieldsChange}
      >
        <Container>
          <Wrapper>
            <Title>分類設定</Title>

            <Row>
              <Item>
                <ItemLabel>分類</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="scmCategory">
                  <Select
                    // style={{ width: "100%" }}
                    placeholder="選擇分類"
                    options={categoryList.map((c) => {
                      return {
                        ...c,
                        label: c.categoryName,
                        value: c.categoryName,
                      };
                    })}
                    showSearch
                    dropdownMatchSelectWidth
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
                <ItemLabel>中文品名</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="itemName">
                  <Input placeholder="請輸入中文品名" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>英文品名</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="itemNameEn">
                  <Input placeholder="請輸入英文品名" />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>供應商商品編號</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="vendorProdCode">
                  <Input placeholder="請輸入供應商商品編號" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>生產國家</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="itemCountry">
                  <Input placeholder="請輸入生產國家" />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>條碼</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="itemEan">
                  <Input placeholder="請輸入條碼" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>規格</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="itemSpec">
                  <Input placeholder="請輸入規格" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>應/免稅</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="isTax">
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
                <ItemLabel>原價</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="price">
                  <Input placeholder="請輸入原價" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>促銷價</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="specialPrice">
                  <Input placeholder="請輸入促銷價" />
                </Form.Item>
              </Item>
            </Row>
          </Wrapper>

          <Wrapper>
            <Title>容量和重量</Title>

            <Row>
              <Item>
                <ItemLabel>容量</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="vCapacity">
                  <Input placeholder="請輸入容量" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>容量單位</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="vUnit">
                  <Input placeholder="請輸入容量單位" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>庫存單位</ItemLabel>
                <Input placeholder="請輸入庫存單位" />
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>陳列單位(數字)</ItemLabel>
                <Input placeholder="請輸入陳列單位(數字)" />
              </Item>

              <Item>
                <ItemLabel>陳列容量</ItemLabel>
                <Input placeholder="請輸入陳列容量" />
              </Item>

              <Item></Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>商品高度(cm)</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="productHeight">
                  <Input placeholder="請輸入商品高度(cm)" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>商品寬度(cm)</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="productWidth">
                  <Input placeholder="請輸入商品寬度(cm)" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>商品長度(cm)</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="productLength">
                  <Input placeholder="請輸入商品長度(cm)" />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>重量-毛重</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="grossWeight">
                  <Input placeholder="請輸入重量-毛重" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>重量-淨重</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="netWeight">
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
                <ItemLabel>保存日期</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="expDateValue">
                  <Input placeholder="請輸入保存日期" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>保存日期單位</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="expDateUnit">
                  <Input placeholder="請輸入保存日期單位" />
                </Form.Item>
              </Item>
            </Row>

            {!isFood && (
              <Row>
                <Item>
                  <ItemLabel>電源規格</ItemLabel>
                  <Form.Item style={{ flex: 1 }} name="powerSpec">
                    <Input placeholder="請輸入電源規格" />
                  </Form.Item>
                </Item>

                <Item></Item>
              </Row>
            )}

            <Row>
              <Item>
                <ItemLabel>顏色</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="vColor">
                  <Input placeholder="請輸入顏色" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>尺寸</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="vSize">
                  <Input placeholder="請輸入尺寸" />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>等級</ItemLabel>
                <Input placeholder="請輸入等級" />
              </Item>

              <Item>
                <ItemLabel>保存方式(文字)</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="itemStoreway">
                  <Input placeholder="請輸入保存方式" />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>款式</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="vStyle">
                  <Input placeholder="請輸入款式" />
                </Form.Item>
              </Item>

              <Item></Item>
              <Item></Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>庫存</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="perpetual">
                  <Radio.Group
                    style={{ display: "flex", alignItems: "center" }}
                    defaultValue={1}
                  >
                    <Radio value={false}>不庫控</Radio>
                    <Radio value={true}>活動庫存</Radio>
                  </Radio.Group>
                </Form.Item>

                <Input style={{ width: 102, flex: 1 }} placeholder="數量" />

                <Form.Item style={{ flex: 1 }} name="stockStartdate">
                  <Input
                    style={{ width: 102, flex: 1 }}
                    placeholder="起始日期"
                  />
                </Form.Item>
              </Item>

              <Item></Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>商品特色說明</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="itemShortdescription">
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
                <ItemLabel>商品完整說明(文字)</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="itemDetail">
                  <TextArea
                    placeholder="請輸入商品完整說明(文字)"
                    autoSize={{
                      minRows: 3,
                      maxRows: 3,
                    }}
                  />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>國內負責廠商名稱</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="manufacturer">
                  <Input placeholder="請輸入國內負責廠商名稱" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>電話</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="manufacturerPhone">
                  <Input placeholder="請輸入電話" />
                </Form.Item>
              </Item>

              <Item>
                <ItemLabel>地址</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="manufacturerAddress">
                  <Input placeholder="請輸入地址" />
                </Form.Item>
              </Item>
            </Row>

            <Row>
              <Item>
                <ItemLabel>素食種類</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="veggieType">
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

            {isFood && (
              <Row>
                <Item>
                  <ItemLabel>產品成份及食品添加物(文字)</ItemLabel>
                  <Form.Item style={{ flex: 1 }} name="ingredients">
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
                  <ItemLabel>營養標示(文字)</ItemLabel>
                  <Form.Item style={{ flex: 1 }} name="nutrition">
                    <TextArea
                      placeholder="請輸入營養標示(文字)"
                      autoSize={{
                        minRows: 3,
                        maxRows: 3,
                      }}
                    />
                  </Form.Item>
                </Item>
              </Row>
            )}

            {!isFood && (
              <>
                <Row>
                  <Item>
                    <ItemLabel>產品責任險</ItemLabel>
                    <Form.Item style={{ flex: 1 }} name="dutyInsurance">
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
                    <ItemLabel>產品核准字號</ItemLabel>
                    <Form.Item style={{ flex: 1 }} name="approvalId">
                      <TextArea
                        placeholder="請輸入產品核准字號"
                        autoSize={{
                          minRows: 3,
                          maxRows: 3,
                        }}
                      />
                    </Form.Item>
                  </Item>
                </Row>

                <Row>
                  <Item>
                    <ItemLabel>保固範圍(文字)</ItemLabel>
                    <Form.Item style={{ flex: 1 }} name="warrantyScope">
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
                    <ItemLabel>其他證明(文字)</ItemLabel>
                    <Form.Item style={{ flex: 1 }} name="approvalOther">
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
                <ItemLabel>標章</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="certMark">
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
                <ItemLabel>能源效率</ItemLabel>
                <Form.Item style={{ flex: 1 }} name="energyEfficiency">
                  <TextArea
                    placeholder="請輸入能源效率"
                    autoSize={{
                      minRows: 3,
                      maxRows: 3,
                    }}
                  />
                </Form.Item>
              </Item>
            </Row>
          </Wrapper>
        </Container>
      </Form>
    </Spin>
  );
};

export default Page;
