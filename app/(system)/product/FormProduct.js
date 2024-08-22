"use client";
import { Col, Flex, Form, Radio, Row, Space } from "antd";
import dayjs from "dayjs";
import styled from "styled-components";

import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";

import TableApplyHistory from "./TableApplyHistory";
import TableChange from "./TableChange";

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

export default function FormProduct(props) {
  const {
    type,
    form,
    info,
    disabled,
    categoryList = [],
    shippingList = [],
    isFood,
    isNonFood,
    onFinish,
  } = props;

  const isApply = type === "apply";
  const isProduct = type === "product";

  const options = useBoundStore((state) => state.options);
  const veggieType = options?.veggie_type ?? [];
  const variationType = options?.variation_type ?? [];

  const perpetual = Form.useWatch("perpetual", form);
  const variationType1Code = Form.useWatch("variationType1Code", form);
  const variationType2Code = Form.useWatch("variationType2Code", form);

  const price = Form.useWatch("price", form);
  const specialPrice = Form.useWatch("specialPrice", form);

  // 禁用今天及今天之前的日期
  const disabledStockDate = (current) => {
    return current && current <= dayjs().endOf("day");
  };

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

  const validatePrice = (_, value) => {
    const p = Number(value);
    const s = Number(specialPrice);
    if (s && p < s) {
      return Promise.reject(new Error("原價需高於促銷價"));
    }
    return Promise.resolve();
  };

  const validateSpecialPrice = (_, value) => {
    const s = Number(value);
    const p = Number(price);
    if (p && s > p) {
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

  return (
    <Form
      form={form}
      autoComplete="off"
      colon={false}
      labelCol={{ flex: "130px" }}
      labelWrap
      labelAlign="right"
      disabled={disabled}
      onFinish={onFinish}
    >
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Title>分類設定</Title>

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
                  placeholder="請依據下拉選單選擇分車類型"
                  showSearch
                  allowClear
                  options={shippingList?.map((opt) => ({
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
              <Form.Item
                name="scmCategoryCode"
                label="商品分類"
                rules={[{ required: true, message: "必填" }]}
              >
                {isProduct && (
                  <CategoryLabel style={{ lineHeight: "42px" }}>
                    {form.getFieldValue("scmCategoryCode")} /{" "}
                    {form.getFieldValue("scmCategoryName")}
                  </CategoryLabel>
                )}

                {isApply && (
                  <Select
                    placeholder="請依據下拉選單選擇商品分類"
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
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="brand" label="品牌">
                <Input placeholder="請輸入品牌文字" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={32}>
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
              <Form.Item name="itemNameEn" label="英文品名">
                <Input placeholder="請輸入英文品名" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                name="itemCountry"
                label="生產國家"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input placeholder="請輸入商品的生產國家" />
              </Form.Item>
            </Col>

            {isProduct && (
              <Col span={12}>
                <Form.Item
                  name="isPublushed"
                  label="上下架狀態"
                  rules={[{ required: true, message: "必填" }]}
                >
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
            )}
          </Row>

          <Row gutter={32}>
            <Col span={8}>
              <Form.Item name="itemEan" label="條碼">
                <Input placeholder="請輸入商品條碼" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="itemSpec"
                label="商品規格"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input placeholder="請輸入規格，例如：14片 x 3包 x 1件" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="isTax"
                label="應/免稅"
                rules={[{ required: true, message: "必填" }]}
              >
                <Select
                  placeholder="請依據下拉選單選擇稅別"
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
              <Form.Item
                name="price"
                label="原價"
                rules={[
                  { required: true, message: "必填" },
                  {
                    validator: validateWarningPrice,
                    warningOnly: true,
                  },
                  { validator: validatePrice },
                ]}
              >
                <Input placeholder="請輸入商品原價" />
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
                <Input placeholder="請輸入商品促銷價" />
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
                <Input placeholder="請輸入商品高度" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="productWidth"
                label="商品寬度(cm)"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input placeholder="請輸入商品寬度" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="productLength"
                label="商品長度(cm)"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input placeholder="請輸入商品長度" />
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
                <Input
                  placeholder="請輸入商品毛重，以克為單位，請輸入數字"
                  suffix="克(g)"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="netWeight"
                label="重量-淨重"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input
                  placeholder="請輸入商品淨重，以克為單位，請輸入數字"
                  suffix="克(g)"
                />
              </Form.Item>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <Title>其他資訊</Title>

          <Row gutter={32}>
            <Col span={8}>
              <Form.Item
                name="expDateValue"
                label="保存日期"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input placeholder="請輸入保存日期，請輸入數字，例如：12" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="expDateUnit"
                label="保存日期單位"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input placeholder="請輸入保存日期單位：小時 / 日 / 週 / 月 / 年，例如：月" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="itemStoreway"
                label="保存方式"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input placeholder="請輸入保存方式" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={32}>
            {isNonFood && (
              <Col span={12}>
                <Form.Item name="powerSpec" label="電源規格">
                  <Input placeholder="例如：110V , 220V" />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={32}>
            <Col span={12}>
              <Form.Item style={{ marginBottom: 0 }} label="多規類型(一)">
                <Flex justify="space-between">
                  <Form.Item
                    style={{ display: "inline-block", width: "48%" }}
                    name="variationType1Code"
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder="請依據下拉選單選擇第一個多規類型 "
                      options={variationType.map((v) => ({
                        ...v,
                        label: v.name,
                        value: v.value,
                      }))}
                      onChange={() => {
                        form.setFieldValue("variationType1Value", undefined);
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    style={{ display: "inline-block", width: "48%" }}
                    name="variationType1Value"
                    rules={[{ validator: validateVariationType1Value }]}
                  >
                    <Input
                      placeholder="請輸入第一個多規類型的值"
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
                      placeholder="請依據下拉選單選擇第二個多規類型"
                      options={variationType.map((v) => ({
                        ...v,
                        label: v.name,
                        value: v.value,
                      }))}
                      onChange={() => {
                        form.setFieldValue("variationType2Value", undefined);
                      }}
                    />
                  </Form.Item>

                  <Form.Item
                    style={{ display: "inline-block", width: "48%" }}
                    name="variationType2Value"
                    rules={[{ validator: validateVariationType2Value }]}
                  >
                    <Input
                      placeholder="請輸入第二個多規類型的值"
                      disabled={!variationType2Code}
                    />
                  </Form.Item>
                </Flex>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={32}>
            <Col span={24}>
              <Form.Item
                style={{ display: "inline-block", width: 250 }}
                name="perpetual"
                label="是否庫控"
                rules={[{ required: true, message: "必填" }]}
              >
                <Radio.Group>
                  <Radio value={true}>否</Radio>
                  <Radio value={false}>是</Radio>
                </Radio.Group>
              </Form.Item>

              {perpetual === false && (
                <Space size={10}>
                  <Form.Item
                    style={{ display: "inline-block", width: 250 }}
                    name="stock"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入活動庫存，請輸入整數數字" />
                  </Form.Item>

                  <Form.Item
                    style={{ display: "inline-block", width: 400 }}
                    name="stockDate"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <RangePicker
                      style={{ width: "100%" }}
                      placeholder={[
                        "請輸入活動庫存開始時間",
                        "請輸入活動庫存結束時間",
                      ]}
                      disabledDate={disabledStockDate}
                    />
                  </Form.Item>
                </Space>
              )}
            </Col>
          </Row>

          <Row gutter={32}>
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
                label="商品完整說明"
                rules={[{ required: true, message: "必填" }]}
              >
                <TextArea
                  placeholder="請輸入商品完整說明文字"
                  autoSize={{ minRows: 3, maxRows: 3 }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={32}>
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
                  label="國內負責廠商電話"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="請輸入國內負責廠商電話" />
                </Form.Item>
              </Col>
            )}

            {isFood && (
              <Col span={8}>
                <Form.Item
                  name="manufacturerAddress"
                  label="國內負責廠商地址"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="請輸入國內負責廠商地址" />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={32}>
            {isFood && (
              <Col span={12}>
                <Form.Item name="veggieType" label="素食種類">
                  <Select
                    style={{ width: "100%" }}
                    placeholder="請依據下拉選單選擇素食種類"
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
                  label="產品成份及食品添加物"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <TextArea
                    placeholder="請輸入產品成份及食品添加物文字"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={32}>
            {isFood && (
              <Col span={12}>
                <Form.Item
                  name="nutrition"
                  label="營養標示(文字)"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <TextArea
                    placeholder="請輸入營養標示文字"
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
          </Row>

          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                name="approvalId"
                label={
                  isFood ? "食品業者登錄字號" : isNonFood ? "產品核准字號" : ""
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
                <Form.Item name="warrantyScope" label="保固範圍">
                  <TextArea
                    placeholder="請輸入保固範圍"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={32}>
            {isNonFood && (
              <Col span={12}>
                <Form.Item name="warrantyPeriod" label="保固期間">
                  <TextArea
                    placeholder="請輸入保固期間"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Row gutter={32}>
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

        {isApply && (
          <Col span={24}>
            <Title>審核歷程</Title>
            <TableApplyHistory data={form.getFieldValue("applyHisInfo")} />
          </Col>
        )}

        {isProduct && (
          <Col span={24}>
            <Title>異動紀錄</Title>
            <TableChange data={form.getFieldValue("changeList")} />
          </Col>
        )}
      </Row>
    </Form>
  );
}
