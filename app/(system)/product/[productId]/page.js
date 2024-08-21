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

import ModalPreviewPDP from "../ModalPreviewPDP";
import TableChange from "./TableChange";

import api from "@/api";
import {
  PATH_PRODUCT_IMAGE_MAINTENANCE,
  PATH_PRODUCT_STOCK_SETTINGS,
} from "@/constants/paths";
import { useBoundStore } from "@/store";

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
  const [form] = Form.useForm();
  const router = useRouter();

  const params = useParams();
  const productId = params.productId;

  const options = useBoundStore((state) => state.options);
  const variationType = options?.variation_type ?? [];

  const [loading, setLoading] = useState({
    page: false,
    pdpPreview: false,
  });

  const [openModal, setOpenModal] = useState({
    pdpPreview: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [shippingList, setShippingList] = useState([]);
  const [info, setInfo] = useState({});

  const scmCategoryCode = form.getFieldValue("scmCategoryCode");
  const scmCategoryName = form.getFieldValue("scmCategoryName");
  const itemName = form.getFieldValue("itemName");
  const itemEan = form.getFieldValue("itemEan");
  const isFood = form.getFieldValue("isFood") === true;
  const isNonFood = form.getFieldValue("isFood") === false;
  const changList = form.getFieldValue("changeList");

  const perpetual = Form.useWatch("perpetual", form);
  const variationType1Code = Form.useWatch("variationType1Code", form);
  const variationType2Code = Form.useWatch("variationType2Code", form);

  const validateWarningPrice = (_, value) => {
    const priceBefore = Number(info.price);
    const priceAfter = Number(value);
    const isGreaterThan = priceAfter > priceBefore + priceBefore * 0.25;
    const isLessThan = priceAfter < priceBefore - priceBefore * 0.25;

    if (value && (isGreaterThan || isLessThan)) {
      return Promise.reject(
        new Error(
          `原價調整前:${priceBefore} / 調整後:${priceAfter}，調整幅度大於正負25%`
        )
      );
    }

    return Promise.resolve();
  };

  const validateWarningSpecialPrice = (_, value) => {
    const priceBefore = Number(info.specialPrice);
    const priceAfter = Number(value);
    const isGreaterThan = priceAfter > priceBefore + priceBefore * 0.25;
    const isLessThan = priceAfter < priceBefore - priceBefore * 0.25;

    if (priceBefore && value && (isGreaterThan || isLessThan)) {
      return Promise.reject(
        new Error(
          `原價調整前:${priceBefore} / 調整後:${priceAfter}，調整幅度大於正負25%`
        )
      );
    }

    return Promise.resolve();
  };

  const validateSpecialPrice = (_, value) => {
    const price = form.getFieldValue("price");

    if (value > price) {
      return Promise.reject(new Error("促銷價需低於原價"));
    }

    return Promise.resolve();
  };

  // 驗證 多規類型(一)內容
  const validateVariationType1Value = (_, value) => {
    const variationType1Code = form.getFieldValue("variationType1Code");
    if (variationType1Code && !value) {
      return Promise.reject(new Error("必填"));
    }
    return Promise.resolve();
  };

  // 驗證 多規類型(二)內容
  const validateVariationType2Value = (_, value) => {
    const variationType2Code = form.getFieldValue("variationType2Code");
    if (variationType2Code && !value) {
      return Promise.reject(new Error("必填"));
    }
    return Promise.resolve();
  };

  // 驗證 多規類型(二)
  const validateVariationType2Code = (_, value) => {
    const variationType1Code = form.getFieldValue("variationType1Code");
    const variationType2Code = form.getFieldValue("variationType2Code");
    if (variationType1Code && variationType1Code === variationType2Code) {
      return Promise.reject(new Error("不能與多規類型(一)相同"));
    }
    return Promise.resolve();
  };

  // 詳細內容
  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/scm/product/${params.productId}`)
      .then((res) => {
        const { stockStartdate } = res.data;
        form.setFieldsValue({
          ...res.data,
          stockStartdate: stockStartdate ? dayjs(stockStartdate) : undefined,
        });
        setInfo({ ...res.data });
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  // 分車類型
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

  // 確認修改
  const handleFinish = (values) => {
    const data = {
      ...values,
      price: values.price ? Number(values.price) : undefined,
      specialPrice: values.specialPrice
        ? Number(values.specialPrice)
        : undefined,
    };

    setLoading((state) => ({ ...state, page: true }));
    api
      .patch(`v1/scm/product/${productId}`, data)
      .then((res) => {
        message.success(res.message);
        setIsEditing(false);
        fetchInfo();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

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
              {
                title: (
                  <Link href="javascript:;" onClick={() => router.back()}>
                    商品列表
                  </Link>
                ),
              },
              { title: "商品資料" },
            ]}
          />

          <Space style={{ marginLeft: "auto" }} size={16}>
            {isEditing ? (
              <>
                <Button
                  type="default"
                  onClick={() => {
                    setIsEditing(false);
                    form.setFieldsValue({
                      ...info,
                      stockStartdate: info.stockStartdate
                        ? dayjs(info.stockStartdate)
                        : undefined,
                    });
                  }}
                >
                  取消
                </Button>

                <Button type="primary" onClick={() => form.submit()}>
                  確認修改
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" onClick={() => setIsEditing(true)}>
                  編輯修改
                </Button>

                <Link
                  href={{
                    pathname: `${PATH_PRODUCT_IMAGE_MAINTENANCE}/product/${params.productId}`,
                    query: { itemName, itemEan },
                  }}
                >
                  <Button type="secondary">圖片維護</Button>
                </Link>
              </>
            )}

            <Button
              type="secondary"
              onClick={() => {
                setOpenModal((state) => ({ ...state, pdpPreview: true }));
              }}
            >
              PDP預覽
            </Button>

            <Link
              href={{
                pathname: `${PATH_PRODUCT_STOCK_SETTINGS}`,
                query: {
                  productId: params.productId,
                  itemName,
                  itemEan,
                },
              }}
            >
              <Button type="secondary">庫存設定</Button>
            </Link>
          </Space>
        </LayoutHeader>

        <Form
          form={form}
          autoComplete="off"
          colon={false}
          labelCol={{ flex: "130px" }}
          labelWrap
          labelAlign="right"
          disabled={!isEditing}
          onFinish={handleFinish}
        >
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Title>基本設定</Title>
              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item name="productnumber" label="商城商品編號">
                    <div style={{ lineHeight: "42px" }}>
                      {form.getFieldValue("productnumber") ?? "-"}
                    </div>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item
                    name="cartType"
                    label="分車類型"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Select
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
                </Col>
              </Row>

              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item label="商品分類">
                    <CategoryLabel style={{ width: 350, lineHeight: "42px" }}>
                      {scmCategoryCode} / {scmCategoryName}
                    </CategoryLabel>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="brand" label="品牌">
                    <Input placeholder="請輸入品牌" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="itemName"
                    label="中文品名"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入中文品名" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="itemNameEn"
                    label="英文品名"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入英文品名" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="itemCountry"
                    label="生產國家"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入生產國家" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="isPublushed" label="上下架狀態">
                    <Select
                      placeholder="請選擇上下架狀態"
                      showSearch
                      allowClear
                      options={[
                        { label: "上架", value: true },
                        { label: "下架", value: false },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item name="itemEan" label="條碼">
                    <Input placeholder="請輸入條碼" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="itemSpec"
                    label="規格"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入規格" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="isTax"
                    label="應/免稅"
                    rules={[{ required: true, message: "必填" }]}
                  >
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

                <Col span={12}>
                  <Form.Item
                    name="price"
                    label="原價"
                    rules={[
                      { required: true, message: "必填" },
                      {
                        validator: validateWarningPrice,
                        warningOnly: true,
                      },
                    ]}
                  >
                    <Input placeholder="請輸入原價" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="specialPrice"
                    label="促銷價"
                    rules={[
                      {
                        validator: validateWarningSpecialPrice,
                        warningOnly: true,
                      },
                      { validator: validateSpecialPrice },
                    ]}
                  >
                    <Input placeholder="請輸入促銷價" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <Title>容量和重量</Title>
              <Row gutter={32}>
                <Col span={8}>
                  <Form.Item
                    name="productHeight"
                    label="商品高度(cm)"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入商品高度(cm)" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="productWidth"
                    label="商品寬度(cm)"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入商品寬度(cm)" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="productLength"
                    label="商品長度(cm)"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入商品長度(cm)" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="grossWeight"
                    label="重量-毛重"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input suffix="克(g)" placeholder="請輸入重量-毛重" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="netWeight"
                    label="重量-淨重"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input suffix="克(g)" placeholder="請輸入重量-淨重" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col span={24}>
              <Title>其他資訊</Title>
              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item
                    name="expDateValue"
                    label="保存日期"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入保存日期" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="expDateUnit" label="保存日期單位">
                    <Input placeholder="請輸入保存日期單位" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="powerSpec" label="電源規格">
                    <Input placeholder="請輸入電源規格" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="itemStoreway"
                    label="保存方式(文字)"
                    rules={[{ required: isFood, message: "必填" }]}
                  >
                    <Input placeholder="請輸入保存方式(文字)" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item style={{ marginBottom: 0 }} label="多規類型(一)">
                    <Flex justify="space-between">
                      <Form.Item
                        style={{ display: "inline-block", width: "48%" }}
                        name="variationType1Code"
                      >
                        <Select
                          style={{ width: "100%" }}
                          placeholder="請輸入多規類型(一) "
                          options={variationType.map((v) => ({
                            ...v,
                            label: v.name,
                            value: v.value,
                          }))}
                          onChange={() => {
                            form.setFieldValue(
                              "variationType1Value",
                              undefined
                            );
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        style={{ display: "inline-block", width: "48%" }}
                        name="variationType1Value"
                        rules={[{ validator: validateVariationType1Value }]}
                      >
                        <Input
                          placeholder="請輸入多規類型(一)內容"
                          disabled={!isEditing || !variationType1Code}
                        />
                      </Form.Item>
                    </Flex>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item style={{ marginBottom: 0 }} label="多規類型(二) ">
                    <Flex justify="space-between">
                      <Form.Item
                        style={{ display: "inline-block", width: "48%" }}
                        name="variationType2Code"
                        rules={[{ validator: validateVariationType2Code }]}
                      >
                        <Select
                          style={{ width: "100%" }}
                          placeholder="請輸入多規類型(二) "
                          options={variationType.map((v) => ({
                            ...v,
                            label: v.name,
                            value: v.value,
                          }))}
                          onChange={() => {
                            form.setFieldValue(
                              "variationType2Value",
                              undefined
                            );
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        style={{ display: "inline-block", width: "48%" }}
                        name="variationType2Value"
                        rules={[{ validator: validateVariationType2Value }]}
                      >
                        <Input
                          placeholder="請輸入多規類型(二)內容"
                          disabled={!isEditing || !variationType2Code}
                        />
                      </Form.Item>
                    </Flex>
                  </Form.Item>
                </Col>

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

                <Col span={12}>
                  <Form.Item name="vStyle" label="款式">
                    <Input placeholder="請輸入款式" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Row>
                    <Col span={6}>
                      <Form.Item
                        name="perpetual"
                        label="庫存"
                        rules={[{ required: true, message: "必填" }]}
                      >
                        <Radio.Group
                          options={[
                            { label: "不庫控", value: true },
                            { label: "活動庫存", value: false },
                          ]}
                        />
                      </Form.Item>
                    </Col>

                    {perpetual === false && (
                      <>
                        <Col span={3}>
                          <Form.Item style={{ width: "90%" }} name="stock">
                            <Input placeholder="數量" />
                          </Form.Item>
                        </Col>

                        <Col span={3}>
                          <Form.Item name="stockStartdate">
                            <DatePicker placeholder="起始日期" />
                          </Form.Item>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>

                <Col span={12}>
                  <Form.Item name="itemShortdescription" label="商品特色說明">
                    <div style={{ lineHeight: "42px" }}>
                      商品特色說明圖請至「圖片維護上傳」
                    </div>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="itemDetail"
                    label="商品完整說明(文字)"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <TextArea
                      placeholder="請輸入商品完整說明(文字)"
                      autoSize={{ minRows: 3, maxRows: 3 }}
                    />
                  </Form.Item>
                </Col>

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
                    label={
                      isFood
                        ? "食品業者登錄字號"
                        : isNonFood
                          ? "產品核准字號"
                          : ""
                    }
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <TextArea
                      placeholder="例如：BSMI , NCC認證 , 衛部(署)粧輸字第OOOOOO號 ... 等等"
                      autoSize={{ minRows: 3, maxRows: 3 }}
                    />
                  </Form.Item>
                </Col>

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

            <Col span={24}>
              <Title>異動紀錄</Title>
              <TableChange data={changList} />
            </Col>
          </Row>
        </Form>
      </Spin>

      <ModalPreviewPDP
        type="product"
        id={params.productId}
        open={openModal.pdpPreview}
        onCancel={() => {
          setOpenModal((state) => ({ ...state, pdpPreview: false }));
        }}
      />
    </>
  );
}
