"use client";
import {
  App,
  Breadcrumb,
  Checkbox,
  Col,
  Flex,
  Form,
  Radio,
  Row,
  Space,
  Spin,
} from "antd";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Button from "@/components/Button";
import ResetBtn from "@/components/Button/ResetBtn";
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import ModalConfirm from "@/components/Modal/ModalConfirm";
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

const Mask = styled.div`
  display: none;
  background-color: rgba(255, 255, 255, 0.7);
  position: absolute;
  inset: 0;
  cursor: not-allowed;

  ${(props) =>
    props.$show &&
    css`
      display: block;
    `};
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const params = useParams();
  const router = useRouter();
  const selectedKey = "productnumber";

  const OPTION_CART_TYPE = 1;
  const OPTION_PRODUCT = 2;

  const isAdd = params.slug[0] === "add";
  const isEdit = params.slug[0] === "edit";
  const id = isEdit && params.slug[1];

  const options = useBoundStore((state) => state.options);
  const scmCart = options?.SCM_cart ?? [];

  const mode = Form.useWatch("mode", form);

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

  const [openModal, setOpenModal] = useState({
    confirm: false,
  });

  const [productSourceList, setProductSourceList] = useState([]);
  const [productTargetList, setProductTargetList] = useState([]);

  const [selectedSourceList, setSelectedSourceList] = useState([]);
  const [selectedTargetList, setSelectedTargetList] = useState([]);

  const [discountOptions, setDiscountOptions] = useState([]);

  const [errMsg, setErrMsg] = useState("");
  const [isForce, setIsForce] = useState();

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/scm/vendor_promotion/${id}`)
      .then((res) => {
        form.setFieldsValue({
          promotionId: res.data.promotionId,
          time: [dayjs(res.data.startTime), dayjs(res.data.endTime)],
          cartType: res.data.cartType,
        });

        // 以分車類型設定
        if (res.data.cartType.length > 0) {
          form.setFieldsValue({ mode: OPTION_CART_TYPE });
        }

        // 以商品設定
        if (res.data.info.length > 0) {
          form.setFieldsValue({ mode: OPTION_PRODUCT });
          setProductTargetList(res.data.info);
        }
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  const getPageTitle = () => {
    if (isEdit) return "編輯促銷方案";
    if (isAdd) return "新增促銷方案";
    return "";
  };

  // 確認新增/編輯
  const handleFinish = (values) => {
    if (values.mode === OPTION_PRODUCT && productTargetList.length === 0) {
      message.error("必須至少選取一筆商品");
      return;
    }

    const data = {
      vendorPromotionId: isEdit ? Number(id) : undefined,
      promotionId: values.promotionId,
      startTime: values.time ? values.time[0].format("YYYY-MM-DD") : undefined,
      endTime: values.time ? values.time[1].format("YYYY-MM-DD") : undefined,
      cartType: values.mode === OPTION_CART_TYPE ? values.cartType : undefined,
      info: values.mode === OPTION_PRODUCT ? productTargetList : undefined,
      isForce: isForce === true ? true : undefined,
    };

    setLoading((state) => ({ ...state, page: true, confirm: true }));
    api
      .post(`v1/scm/vendor_promotion/new`, data)
      .then((res) => {
        message.success(res.message);
        router.push(routes.product.promotion);
      })
      .catch((err) => {
        if (err.code === "409") {
          setErrMsg(err.message);
          setOpenModal((state) => ({ ...state, confirm: true }));
          return;
        }
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false, confirm: false }));
        setIsForce(undefined);
      });
  };

  // 抓取 "促銷ID" 下拉選單內容
  const fetchDiscount = () => {
    api
      .get(`v1/system/option/scmDiscount`)
      .then((res) => setDiscountOptions(res.data))
      .catch((err) => message.error(err.message))
      .finally(() => {});
  };

  // 查詢商品
  const handleSearch = () => {
    const productnumber = form.getFieldValue("productnumber");
    const itemName = form.getFieldValue("itemName");

    const params = {
      offset: 0,
      max: 99999,
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

  // 清除查詢條件
  const handleResetSearch = () => {
    form.resetFields(["productnumber", "itemName"]);
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

  const handleConfirm = () => {
    setIsForce(true);
    form.submit();
  };

  useEffect(() => {
    if (isEdit) {
      fetchInfo();
    }
    fetchDiscount();
  }, []);

  useEffect(() => {
    if ([OPTION_CART_TYPE, undefined].includes(mode)) {
      form.setFieldsValue({
        productnumber: undefined,
        itemName: undefined,
      });
    }

    if ([OPTION_PRODUCT, undefined].includes(mode)) {
      form.setFields([{ name: "cartType", errors: [], value: undefined }]);
    }
  }, [mode]);

  return (
    <>
      <Spin spinning={loading.page}>
        <LayoutHeader>
          <LayoutHeaderTitle>{getPageTitle()}</LayoutHeaderTitle>
          <Breadcrumb
            separator=">"
            items={[
              { title: <Link href={routes.product.promotion}>商品促銷</Link> },
              { title: getPageTitle() },
            ]}
          />
        </LayoutHeader>

        <Container>
          <Form
            form={form}
            colon={false}
            labelCol={{ flex: "80px" }}
            labelWrap
            labelAlign="right"
            autoComplete="off"
            onFinish={handleFinish}
          >
            <Row style={{ width: "100%" }}>
              <Col span={24}>
                <Card>
                  <Row gutter={32}>
                    <Form.Item style={{ paddingLeft: 16, marginBottom: 10 }}>
                      <span className="ant-form-item-explain-error">
                        *商品如重複設定促銷, 會重複折扣, 請小心設定!!
                      </span>
                    </Form.Item>
                  </Row>

                  <Row gutter={32}>
                    <Col span={8} xxl={{ span: 6 }}>
                      <Form.Item
                        name="promotionId"
                        label="促銷ID"
                        rules={[{ required: true, message: "必填" }]}
                      >
                        <Select
                          placeholder="選擇商品代碼或名稱"
                          popupMatchSelectWidth={false}
                          options={discountOptions.map((opt) => {
                            return { ...opt, label: opt.name };
                          })}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8} xxl={{ span: 6 }}>
                      <Form.Item
                        name="time"
                        label="日期"
                        rules={[{ required: true, message: "必填" }]}
                      >
                        <RangePicker
                          style={{ width: "100%" }}
                          placeholder={["日期起", "日期迄"]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col
                style={{
                  padding: "16px",
                  borderBottom: "1px solid rgba(228, 231, 237, 1)",
                }}
                span={24}
              >
                <Button
                  type="secondary"
                  onClick={() => form.setFieldValue("mode", undefined)}
                >
                  重置設定方式
                </Button>

                <Flex>
                  <Form.Item
                    name="mode"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Radio.Group>
                      <Space direction="vertical">
                        <Radio value={OPTION_CART_TYPE}>
                          <Flex gap={16} align="center">
                            <div>設定方式1 - 以分車類型設定</div>
                          </Flex>
                        </Radio>

                        <Radio value={OPTION_PRODUCT}>
                          <Flex gap={16} align="center">
                            <div>設定方式2 - 以商品設定</div>
                          </Flex>
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Form.Item>

                  <Space direction="vertical">
                    <Flex gap={16}>
                      <Form.Item
                        style={{ marginBottom: 0, lineHeight: "42px" }}
                        className="form-item-cartType"
                        name="cartType"
                        rules={[
                          {
                            required: mode === OPTION_CART_TYPE,
                            message: "必填",
                          },
                        ]}
                      >
                        <Checkbox.Group
                          disabled={mode === OPTION_PRODUCT}
                          options={scmCart.map((opt) => {
                            return {
                              ...opt,
                              label: `${opt.name}(${opt.value})`,
                            };
                          })}
                        />
                      </Form.Item>
                    </Flex>

                    <Flex gap={16} align="center">
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name="productnumber"
                        label="商城商品編號"
                        labelCol={{ flex: "106px" }}
                      >
                        <Input
                          placeholder="請輸入商城商品編號"
                          disabled={loading.search || mode === OPTION_CART_TYPE}
                        />
                      </Form.Item>

                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name="itemName"
                        label="商品名稱"
                      >
                        <Input
                          placeholder="請輸入商品名稱"
                          disabled={loading.search || mode === OPTION_CART_TYPE}
                        />
                      </Form.Item>

                      <Button
                        type="secondary"
                        loading={loading.search}
                        disabled={mode === OPTION_CART_TYPE}
                        onClick={handleSearch}
                      >
                        查詢
                      </Button>

                      <ResetBtn onClick={handleResetSearch}>
                        清除查詢條件
                      </ResetBtn>
                    </Flex>
                  </Space>
                </Flex>
              </Col>

              <Col span={24}>
                <Row>
                  <Col span={24}>
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
                            <Image
                              src="/arrow.svg"
                              width={6}
                              height={12}
                              alt=""
                            />
                          </TransferBtn>

                          <TransferBtn
                            style={{ transform: "rotate(180deg)" }}
                            $active={selectedTargetList.length > 0}
                            onClick={handleTargetToSource}
                          >
                            <Image
                              src="/arrow.svg"
                              width={6}
                              height={12}
                              alt=""
                            />
                          </TransferBtn>
                        </TransferBtnGroup>

                        <Transfer
                          title="已選取促銷商品"
                          columns={columns}
                          dataSource={productTargetList}
                          selectedKey={selectedKey}
                          selectedList={selectedTargetList}
                          setSelectedList={setSelectedTargetList}
                        />
                      </TransferWrapper>

                      <Mask $show={mode !== OPTION_PRODUCT} />
                    </Spin>
                  </Col>
                </Row>

                <Row justify="end">
                  <Button type="primary" htmlType="submit">
                    {isEdit ? "確認編輯" : "確認新增"}
                  </Button>
                </Row>
              </Col>
            </Row>
          </Form>
        </Container>
      </Spin>

      <ModalConfirm
        open={openModal.confirm}
        loading={loading.confirm}
        title={errMsg}
        onOk={handleConfirm}
        onCancel={() => setOpenModal((state) => ({ ...state, confirm: false }))}
      />
    </>
  );
}
