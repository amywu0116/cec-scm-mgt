"use client";
import { App, Breadcrumb, Checkbox, Col, Form, Row, Space, Spin } from "antd";
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

import { PATH_PRODUCT_PROMOTION } from "@/constants/paths";
import { useBoundStore } from "@/store";

const Container = styled.div`
  .ant-checkbox-group {
    gap: 20px 18px;
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

  const isAdd = params.slug[0] === "add";
  const isEdit = params.slug[0] === "edit";
  const id = isEdit && params.slug[1];

  const options = useBoundStore((state) => state.options);
  const scmCart = options?.SCM_cart ?? [];

  const cartType = Form.useWatch("cartType", form);

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
        setProductTargetList(res.data.info);
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  const getPageTitle = () => {
    if (isEdit) return "編輯促銷方案";
    if (isAdd) return "新增促銷方案";
    return "";
  };

  // 確認新增
  const handleFinish = (values) => {
    const data = {
      vendorPromotionId: isEdit ? Number(id) : undefined,
      promotionId: values.promotionId,
      startTime: values.time ? values.time[0].format("YYYY-MM-DD") : undefined,
      endTime: values.time ? values.time[1].format("YYYY-MM-DD") : undefined,
      cartType: values.cartType?.length === 0 ? undefined : values.cartType,
      info: values.cartType?.length === 4 ? undefined : productTargetList,
      isForce: isForce === true ? true : undefined,
    };

    setLoading((state) => ({ ...state, page: true, confirm: true }));
    api
      .post(`v1/scm/vendor_promotion/new`, data)
      .then((res) => {
        message.success(res.message);
        router.push(PATH_PRODUCT_PROMOTION);
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

  return (
    <>
      <Spin spinning={loading.page}>
        <LayoutHeader>
          <LayoutHeaderTitle>{getPageTitle()}</LayoutHeaderTitle>
          <Breadcrumb
            separator=">"
            items={[
              { title: <Link href={PATH_PRODUCT_PROMOTION}>商品促銷</Link> },
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
            <Row>
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

                  <Row>
                    <Col span={24}>
                      <Form.Item
                        style={{ lineHeight: "42px" }}
                        name="cartType"
                        label="適用對象"
                      >
                        <Checkbox.Group
                          options={scmCart.map((opt) => {
                            return {
                              ...opt,
                              label: `${opt.name}(${opt.value})`,
                            };
                          })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>

              <Col span={24}>
                <div>
                  <Row
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid rgba(228, 231, 237, 1)",
                    }}
                    gutter={16}
                  >
                    <Col span={8} xxl={{ span: 6 }}>
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name="productnumber"
                        label="商城商品編號"
                      >
                        <Input
                          placeholder="請輸入商城商品編號"
                          disabled={loading.search}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={8} xxl={{ span: 6 }}>
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

                    <Col>
                      <Space size={16}>
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
                      </Space>
                    </Col>
                  </Row>

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
                      </Spin>
                    </Col>
                  </Row>

                  <Mask $show={cartType?.length === 4} />
                </div>

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
