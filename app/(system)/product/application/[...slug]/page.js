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
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import ModalPreviewPDP from "../../ModalPreviewPDP";
import ApplyHistoryTable from "./ApplyHistoryTable";

import api from "@/api";
import {
  PATH_PRODUCT_APPLICATION,
  PATH_PRODUCT_IMAGE_MAINTENANCE,
} from "@/constants/paths";
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
    (isEdit && form.getFieldValue("isFood") === true);
  const isNonFood =
    (isAdd && params.slug[1] === "non-food") ||
    (isEdit && form.getFieldValue("isFood") === false);

  const applyStatusName = form.getFieldValue("applyStatusName");
  const canEdit = ["暫存", "審核退件"].includes(applyStatusName);

  const options = useBoundStore((state) => state.options);
  const veggieType = options?.veggie_type ?? [];
  const variationType = options?.variation_type ?? [];

  const [loading, setLoading] = useState({ page: true, pdpPreview: false });
  const [showModal, setShowModal] = useState({ previewPDP: false });

  const [categoryList, setCategoryList] = useState([]);
  const [shippingList, setShippingList] = useState();

  const perpetual = Form.useWatch("perpetual", form);
  const variationType1Code = Form.useWatch("variationType1Code", form);
  const variationType2Code = Form.useWatch("variationType2Code", form);

  const removeLeadingZero = (value) => {
    while (value.length > 1 && value.startsWith("0")) {
      value = value.substring(1);
    }
    return value;
  };

  // 禁用今天及今天之前的日期
  const disabledStockDate = (current) => {
    return current && current <= dayjs().endOf("day");
  };

  // 驗證 規格(一)內容
  const validateVariationType1Value = (_, value) => {
    const variationType1Code = form.getFieldValue("variationType1Code");
    if (variationType1Code && !value) {
      return Promise.reject(new Error("必填"));
    }
    return Promise.resolve();
  };

  // 驗證 規格(二)內容
  const validateVariationType2Value = (_, value) => {
    const variationType2Code = form.getFieldValue("variationType2Code");
    if (variationType2Code && !value) {
      return Promise.reject(new Error("必填"));
    }
    return Promise.resolve();
  };

  // 驗證 規格(二)
  const validateVariationType2Code = (_, value) => {
    const variationType1Code = form.getFieldValue("variationType1Code");
    const variationType2Code = form.getFieldValue("variationType2Code");
    if (variationType1Code && variationType1Code === variationType2Code) {
      return Promise.reject(new Error("不能與規格(一)相同"));
    }
    return Promise.resolve();
  };

  // 分類
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

  // 分車類型
  const fetchShipping = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/vendor/shipping")
      .then((res) => {
        const shippingList = res.data;
        if (shippingList.some((l) => l.shippingMethod === null)) {
          form.setFields([
            {
              name: "cartType",
              errors: ["請先至 供應商>運費設定 功能頁面，進行運費設定！"],
            },
          ]);
        } else {
          setShippingList(shippingList ?? []);
        }
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  // 詳細內容
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
        const { stockStartdate, stockEnddate, scmCategoryCode } = res.data;
        form.setFieldsValue({
          ...res.data,
          scmCategory: scmCategoryCode,
          stockStartdate: stockStartdate ? dayjs(stockStartdate) : undefined,
          stockDate:
            stockStartdate && stockEnddate
              ? [dayjs(stockStartdate), dayjs(stockEnddate)]
              : undefined,
        });
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  // 暫存
  const handleFinish = (values) => {
    const scmCategoryName = categoryList.find(
      (c) => c.categoryCode === values.scmCategoryCode
    )?.categoryName;

    const data = {
      ...values,
      applyId: isEdit ? applyId : undefined,
      scmCategoryName: scmCategoryName,
      isFood:
        isAdd && isFood
          ? true
          : isAdd && isNonFood
            ? false
            : isEdit
              ? form.getFieldValue("isFood")
              : undefined,
      price: values.price ? Number(values.price) : undefined,
      specialPrice: values.specialPrice
        ? Number(values.specialPrice)
        : undefined,
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
      stockStartdate: values.stockDate
        ? values.stockDate[0].format("YYYY-MM-DD")
        : undefined,
      stockEnddate: values.stockDate
        ? values.stockDate[1].format("YYYY-MM-DD")
        : undefined,
    };

    setLoading((state) => ({ ...state, page: true }));
    api
      .post(`v1/scm/product/apply/new`, data)
      .then((res) => {
        message.success(res.message);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  // 送審
  const handleApply = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .post(`v1/scm/product/apply`, {
        applyIds: [applyId],
      })
      .then(() => {
        message.success("送審成功");
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

  return (
    <>
      <Spin spinning={loading.page}>
        <LayoutHeader>
          <LayoutHeaderTitle>
            {isAdd ? "新增提品資料" : isEdit ? "編輯提品資料" : ""}
          </LayoutHeaderTitle>

          <Breadcrumb
            separator=">"
            items={[
              {
                title: (
                  <Link href="javascript:;" onClick={() => router.back()}>
                    提品申請
                  </Link>
                ),
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

          <Space style={{ marginLeft: "auto" }} size={16}>
            <Button onClick={() => router.back()}>關閉</Button>

            <Button
              type="primary"
              disabled={isEdit && !canEdit}
              onClick={() => {
                form.submit();
              }}
            >
              暫存
            </Button>

            <Button
              type="primary"
              disabled={isAdd || (isEdit && !canEdit)}
              onClick={handleApply}
            >
              送審
            </Button>

            <Button
              type="secondary"
              disabled={isAdd}
              onClick={() => {
                setShowModal((state) => ({ ...state, previewPDP: true }));
              }}
            >
              PDP預覽
            </Button>

            {isEdit && (
              <Link
                href={{
                  pathname: `${PATH_PRODUCT_IMAGE_MAINTENANCE}/apply/${applyId}`,
                  query: {
                    itemName: form.getFieldValue("itemName"),
                    itemEan: form.getFieldValue("itemEan"),
                  },
                }}
              >
                <Button type="secondary">商品相關圖檔維護</Button>
              </Link>
            )}
          </Space>
        </LayoutHeader>

        <Form
          form={form}
          autoComplete="off"
          colon={false}
          labelCol={{ flex: "130px" }}
          labelWrap
          labelAlign="right"
          disabled={isEdit && !canEdit}
          onFinish={handleFinish}
        >
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <Title>分類設定</Title>

              {["審核通過"].includes(applyStatusName) && (
                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item name="productnumber" label="商城商品編號">
                      <div style={{ lineHeight: "42px" }}>
                        {form.getFieldValue("productnumber")}
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              )}

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
                  <Form.Item
                    name="scmCategoryCode"
                    label="分類"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Select
                      placeholder="選擇分類"
                      showSearch
                      allowClear
                      options={categoryList.map((c) => {
                        return {
                          ...c,
                          label: `${c.categoryCode} / ${c.categoryName}`,
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

                <Col span={12}>
                  <Form.Item
                    name="itemName"
                    label="中文品名"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請在商品開頭增加 [] 符號並填入公司名稱. 例如:[家樂福]" />
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

                <Col span={12}></Col>

                <Col span={12}>
                  <Form.Item name="itemEan" label="條碼">
                    <Input placeholder="請輸入條碼" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="itemSpec"
                    label="規格"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入規格" />
                  </Form.Item>
                </Col>

                <Col span={12}>
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
                    rules={[{ required: true, message: "必填" }]}
                  >
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
                    <Input placeholder="請輸入重量-毛重" suffix="克(g)" />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    name="netWeight"
                    label="重量-淨重"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入重量-淨重" suffix="克(g)" />
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
                    <Input placeholder="請輸入阿拉伯數字，例如：12" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    name="expDateUnit"
                    label="保存日期單位"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入 小時 / 日 / 週 / 月 / 年，例如：月" />
                  </Form.Item>
                </Col>

                {isNonFood && (
                  <Col span={12}>
                    <Form.Item name="powerSpec" label="電源規格">
                      <Input placeholder="例如：110V , 220V" />
                    </Form.Item>
                  </Col>
                )}

                <Col span={12}>
                  <Form.Item
                    name="itemStoreway"
                    label="保存方式(文字)"
                    rules={[{ required: isFood, message: "必填" }]}
                  >
                    <Input placeholder="請輸入保存方式" />
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
                          disabled={!variationType1Code}
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
                          disabled={!variationType2Code}
                        />
                      </Form.Item>
                    </Flex>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    style={{ display: "inline-block", width: 330 }}
                    name="perpetual"
                    label="庫存"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Radio.Group>
                      <Radio value={true}>不庫控</Radio>
                      <Radio value={false}>活動庫存</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {perpetual === false && (
                    <Space size={10}>
                      <Form.Item
                        style={{ display: "inline-block", width: 100 }}
                        name="stock"
                        rules={[{ required: true, message: "必填" }]}
                      >
                        <Input placeholder="數量" />
                      </Form.Item>

                      <Form.Item
                        style={{ display: "inline-block", width: 260 }}
                        name="stockDate"
                        rules={[{ required: true, message: "必填" }]}
                      >
                        <RangePicker
                          placeholder={["日期起", "日期迄"]}
                          disabledDate={disabledStockDate}
                        />
                      </Form.Item>
                    </Space>
                  )}
                </Col>

                <Col span={12}>
                  <Form.Item name="itemShortdescription" label="商品特色說明">
                    <TextArea
                      placeholder="請輸入商品特色說明"
                      autoSize={{ minRows: 3, maxRows: 3 }}
                    />
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

                {isFood && (
                  <Col span={8}>
                    <Form.Item
                      name="manufacturer"
                      label="國內負責廠商名稱"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Input placeholder="請輸入國內負責廠商名稱" />
                    </Form.Item>
                  </Col>
                )}

                {isFood && (
                  <Col span={8}>
                    <Form.Item
                      name="manufacturerPhone"
                      label="電話"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Input placeholder="請輸入電話" />
                    </Form.Item>
                  </Col>
                )}

                {isFood && (
                  <Col span={8}>
                    <Form.Item
                      name="manufacturerAddress"
                      label="地址"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Input placeholder="請輸入地址" />
                    </Form.Item>
                  </Col>
                )}

                {isFood && (
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
                )}

                {isFood && (
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
                )}

                {isFood && (
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
                )}

                <Col span={12}>
                  <Form.Item
                    name="dutyInsurance"
                    label="產品責任險"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <TextArea
                      placeholder="請載明 : OO產物保險股份有限公司 保單號碼OOOO 字第OOOOO"
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

                {isNonFood && (
                  <Col span={12}>
                    <Form.Item name="warrantyScope" label="保固範圍(文字)">
                      <TextArea
                        placeholder="請輸入保固範圍(文字)"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                      />
                    </Form.Item>
                  </Col>
                )}

                {isNonFood && (
                  <Col span={12}>
                    <Form.Item name="warrantyPeriod" label="保固期間(文字)">
                      <TextArea
                        placeholder="請輸入保固期間(文字)"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                      />
                    </Form.Item>
                  </Col>
                )}

                {isNonFood && (
                  <Col span={12}>
                    <Form.Item name="approvalOther" label="其他證明(文字)">
                      <TextArea
                        placeholder="請輸入其他證明(文字)"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                      />
                    </Form.Item>
                  </Col>
                )}

                {isNonFood && (
                  <Col span={12}>
                    <Form.Item name="certMark" label="標章">
                      <TextArea
                        placeholder="例如：省水標章 , 環保標章 ... 等等"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                      />
                    </Form.Item>
                  </Col>
                )}

                {isNonFood && (
                  <Col span={12}>
                    <Form.Item name="energyEfficiency" label="能源效率">
                      <TextArea
                        placeholder="例如：能源效率登錄編號"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                      />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Col>

            <Col span={24}>
              <Title>審核歷程</Title>
              <ApplyHistoryTable data={form.getFieldValue("applyHisInfo")} />
            </Col>
          </Row>
        </Form>
      </Spin>

      <ModalPreviewPDP
        type="apply"
        id={form.getFieldValue("applyId")}
        open={showModal.previewPDP}
        onCancel={() => {
          setShowModal((state) => ({ ...state, previewPDP: false }));
        }}
      />
    </>
  );
}
