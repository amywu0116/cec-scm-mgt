"use client";
import { App, Breadcrumb, Col, Form, Radio, Row, Spin } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";

import api from "@/api";
import { PATH_PRODUCT_APPLICATION } from "@/constants/paths";
import { useBoundStore } from "@/store";

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
  margin-bottom: 16px;
`;

export default function Page() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const params = useParams();

  const isAdd = params.slug[0] === "add";
  const isEdit = params.slug[0] === "edit";
  const applyId = isEdit && params.slug[1];

  const isFood =
    (isAdd && params.slug[1] === "food") ||
    (isEdit && form.getFieldValue("isFood"));
  const isNonFood = isAdd && params.slug[1] === "non-food";

  const options = useBoundStore((state) => state.options);
  const veggieType = options?.veggie_type ?? [];

  const [loading, setLoading] = useState({ page: true });

  const [categoryList, setCategoryList] = useState([]);
  const [shippingList, setShippingList] = useState();

  const validateCartType = () => {
    if (shippingList.length === 0) {
      return Promise.reject(
        new Error("請先至 供應商>運費設定 功能頁面，進行運費設定！")
      );
    }

    return Promise.resolve();
  };

  const removeLeadingZero = (value) => {
    while (value.length > 1 && value.startsWith("0")) {
      value = value.substring(1);
    }
    return value;
  };

  const fetchCategory = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/system/option/category`)
      .then((res) => {
        setCategoryList(res.data);
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
        setShippingList(res.data ?? []);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/product/apply/new", {
        params: {
          applyId,
          includeApplyHistory: true,
        },
      })
      .then((res) => {
        const { stockStartdate, scmCategoryCode } = res.data;

        form.setFieldsValue({
          ...res.data,
          scmCategory: scmCategoryCode,
          stockStartdate: dayjs(stockStartdate),
        });
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const handleFinish = (values) => {
    const scmCategoryName = categoryList.find(
      (c) => c.categoryCode === values.scmCategoryCode
    )?.categoryName;

    const data = {
      applyId: isEdit ? applyId : undefined,
      scmCategoryCode: values.scmCategoryCode,
      scmCategoryName: scmCategoryName,
      isFood: isAdd && isFood ? true : isAdd && isNonFood ? false : undefined,
      cartType: values.cartType,
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
      brand: values.brand,
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
        ? values.stockStartdate.format("YYYY-MM-DD")
        : undefined,
    };

    setLoading((state) => ({ ...state, page: true }));
    api
      .post(`v1/scm/product/apply/new`, data)
      .then((res) => {
        message.success(res.message);
        router.push(PATH_PRODUCT_APPLICATION);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  useEffect(() => {
    fetchCategory();
    fetchShipping();
  }, []);

  useEffect(() => {
    if (isEdit) {
      fetchInfo();
    }
  }, []);

  useEffect(() => {
    if (!shippingList) return;
    form.validateFields(["cartType"]);
  }, [shippingList]);

  return (
    <Spin spinning={loading.page}>
      <LayoutHeader>
        <LayoutHeaderTitle>
          {isAdd ? "新增提品資料" : isEdit ? "編輯提品資料" : ""}
        </LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            {
              title: <Link href={PATH_PRODUCT_APPLICATION}>提品申請</Link>,
            },
            {
              title: isEdit
                ? "編輯提品資料"
                : isFood
                  ? "新增提品資料_食品"
                  : "新增提品資料_非食品",
            },
          ]}
        />

        <Row style={{ marginLeft: "auto" }} gutter={16}>
          <Col>
            <Link href={PATH_PRODUCT_APPLICATION}>
              <Button>關閉</Button>
            </Link>
          </Col>

          <Col>
            <Button type="primary" onClick={() => form.submit()}>
              暫存
            </Button>
          </Col>
        </Row>
      </LayoutHeader>

      <Form
        form={form}
        autoComplete="off"
        colon={false}
        labelCol={{ flex: "80px" }}
        labelWrap
        labelAlign="left"
        onFinish={handleFinish}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Title>分類設定</Title>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="cartType"
                  label="分車類型"
                  rules={[{ validator: validateCartType }]}
                >
                  <Select
                    placeholder="請選擇分車類型"
                    showSearch
                    allowClear
                    options={
                      shippingList?.map((opt) => ({
                        ...opt,
                        label: `${opt.cartTypeName}(出貨天數: ${opt.shippingDays})`,
                        value: opt.cartType,
                      })) ?? []
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="scmCategoryCode" label="分類">
                  <Select
                    placeholder="選擇分類"
                    showSearch
                    allowClear
                    options={categoryList.map((c) => {
                      return {
                        ...c,
                        label: c.categoryName,
                        value: c.categoryCode,
                      };
                    })}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="brand" label="品牌">
                  <Input placeholder="請輸入品牌" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="itemName" label="中文品名">
                  <Input placeholder="請輸入中文品名" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="itemNameEn" label="英文品名">
                  <Input placeholder="請輸入英文品名" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="vendorProdCode" label="供應商商品編號">
                  <Input placeholder="請輸入供應商商品編號" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="itemCountry" label="生產國家">
                  <Input placeholder="請輸入生產國家" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={8}>
                <Form.Item name="itemEan" label="條碼">
                  <Input placeholder="請輸入條碼" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="itemSpec" label="規格">
                  <Input placeholder="請輸入規格" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="isTax" label="應/免稅">
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
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="price" label="原價">
                  <Input
                    placeholder="請輸入原價"
                    value={form.getFieldValue("price")}
                    onChange={(e) => {
                      const value = removeLeadingZero(e.target.value);
                      if (/^\d*$/.test(value)) {
                        form.setFieldValue("price", value);
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="specialPrice" label="促銷價">
                  <Input
                    placeholder="請輸入促銷價"
                    value={form.getFieldValue("specialPrice")}
                    onChange={(e) => {
                      const value = removeLeadingZero(e.target.value);
                      if (/^\d*$/.test(value)) {
                        form.setFieldValue("specialPrice", value);
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Title>容量和重量</Title>

            <Row gutter={32}>
              <Col span={8}>
                <Form.Item name="productHeight" label="商品高度(cm)">
                  <Input placeholder="請輸入商品高度(cm)" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="productWidth" label="商品寬度(cm)">
                  <Input placeholder="請輸入商品寬度(cm)" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="productLength" label="商品長度(cm)">
                  <Input placeholder="請輸入商品長度(cm)" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={8}>
                <Form.Item
                  name="grossWeight"
                  label="重量-毛重"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="請輸入重量-毛重" />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="netWeight"
                  label="重量-淨重"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="請輸入重量-淨重" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Title>其他資訊</Title>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="expDateValue" label="保存日期">
                  <Input placeholder="請輸入保存日期" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="expDateUnit" label="保存日期單位">
                  <Input placeholder="請輸入保存日期單位" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              {!isFood && (
                <Col span={12}>
                  <Form.Item name="powerSpec" label="電源規格">
                    <Input placeholder="請輸入電源規格" />
                  </Form.Item>
                </Col>
              )}

              <Col span={12}>
                <Form.Item name="itemStoreway" label="保存方式(文字)">
                  <Input placeholder="請輸入保存方式" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="vColor" label="顏色">
                  <Input placeholder="請輸入顏色" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="vSize" label="尺寸">
                  <Input placeholder="請輸入尺寸" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="vCapacity" label="容量">
                  <Input placeholder="請輸入容量" />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="vUnit" label="入數">
                  <Input placeholder="請輸入入數" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="vStyle" label="款式">
                  <Input placeholder="請輸入款式" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Row>
                  <Col span={14}>
                    <Form.Item name="perpetual" label="庫存">
                      <Radio.Group
                        options={[
                          { label: "不庫控", value: false },
                          { label: "活動庫存", value: true },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={10}>
                    <Form.Item name="stockStartdate">
                      <DatePicker placeholder="起始日期" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="itemShortdescription" label="商品特色說明">
                  <TextArea
                    placeholder="請輸入商品特色說明"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="itemDetail" label="商品完整說明(文字)">
                  <TextArea
                    placeholder="請輸入商品完整說明(文字)"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {isFood && (
              <>
                <Row gutter={32}>
                  <Col span={8}>
                    <Form.Item
                      name="manufacturer"
                      label="國內負責廠商名稱"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Input placeholder="請輸入國內負責廠商名稱" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="manufacturerPhone"
                      label="電話"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Input placeholder="請輸入電話" />
                    </Form.Item>
                  </Col>

                  <Col span={8}>
                    <Form.Item
                      name="manufacturerAddress"
                      label="地址"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Input placeholder="請輸入地址" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item name="veggieType" label="素食種類">
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
                  </Col>
                </Row>

                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item
                      name="ingredients"
                      label="產品成份及食品添加物(文字)"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <TextArea
                        placeholder="請輸入產品成份及食品添加物(文字)"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item
                      name="nutrition"
                      label="營養標示(文字)"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <TextArea
                        placeholder="請輸入營養標示(文字)"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="dutyInsurance"
                  label="產品責任險"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <TextArea
                    placeholder="請輸入產品責任險"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="approvalId"
                  label="產品核准字號"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <TextArea
                    placeholder="請輸入產品核准字號"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>
            </Row>

            {!isFood && (
              <>
                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item name="warrantyScope" label="保固範圍(文字)">
                      <TextArea
                        placeholder="請輸入保固範圍(文字)"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="approvalOther" label="其他證明(文字)">
                      <TextArea
                        placeholder="請輸入其他證明(文字)"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="certMark" label="標章">
                  <TextArea
                    placeholder="請輸入標章"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="energyEfficiency" label="能源效率">
                  <TextArea
                    placeholder="請輸入能源效率"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
}
