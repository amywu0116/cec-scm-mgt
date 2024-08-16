"use client";
import {
  DownOutlined,
  UpOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import {
  App,
  Breadcrumb,
  Col,
  Collapse,
  Form,
  Image,
  Row,
  Space,
  Spin,
} from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled, { css } from "styled-components";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";
import TextArea from "@/components/TextArea";
import ModalAddress from "./ModalAddress";
import ModalRevokeExamine from "./ModalRevokeExamine";
import ModalRevokeResult from "./ModalRevokeResult";
import ModalTax from "./ModalTax";
import OrderDatePicker from "./OrderDatePicker";

import api from "@/api";
import { PATH_ORDER_LIST } from "@/constants/paths";
import { useBoundStore } from "@/store";

const Container = styled.div`
  .ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: 0;
  }

  .ant-collapse .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }

  .ant-collapse-ghost
    > .ant-collapse-item
    > .ant-collapse-content
    > .ant-collapse-content-box {
    padding-block: 0;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 54px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  display: flex;
  gap: 0 5px;
`;

const Tag = styled.div`
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  padding: 2px 6px;
  width: fit-content;

  ${(props) =>
    props.color === "blue" &&
    css`
      color: #006c9c;
      background-color: #00b8d914;
    `}

  ${(props) =>
    props.color === "green" &&
    css`
      color: #118d57;
      background-color: #22c55e14;
    `}

    ${(props) =>
    props.color === "red" &&
    css`
      color: #b71d18;
      background-color: #ff563014;
    `}

    ${(props) =>
    props.color === "grey" &&
    css`
      color: rgba(33, 43, 54, 1);
      background-color: rgba(145, 158, 171, 0.08);
    `}
`;

const OrderStatusTag = styled.div`
  height: 42px;
  display: flex;
  align-items: center;
`;

export default function Page(props) {
  const { params } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const ecorderShipId = params.ecorderShipId;

  const logisticsOptions = useBoundStore((state) => state.logistics) ?? [];

  const [loading, setLoading] = useState({
    page: true,
    ship: false,
    unusual: false,
    arrived: false,
    reject: false,
    cancel: false,
    revoke: false,
  });

  const [showModal, setShowModal] = useState({
    address: false,
    revokeResult: false,
    revokeExamine: false,
    tax: false,
  });

  const [collapseActiveKey, setCollapseActiveKey] = useState([
    "顧客配送信息",
    "出貨設定",
  ]);

  const [info, setInfo] = useState({});
  const actionStatus = info.actionStatus ?? {};
  const product = info.product ?? [];

  const [productTableInfo, setProductTableInfo] = useState({
    rows: [],
  });

  const logisticsName = Form.useWatch("logisticsName", form);
  const shippingCode = Form.useWatch("shippingCode", form);
  const invoiceNo = Form.useWatch("invoiceNo", form);
  const applyDate = Form.useWatch("applyDate", form);
  const packaging = Form.useWatch("packaging", form);
  const backLogisticsName = Form.useWatch("backLogisticsName", form);
  const backShippingCode = Form.useWatch("backShippingCode", form);

  const columns = [
    {
      title: "商品編號",
      dataIndex: "productnumber",
      align: "center",
    },
    {
      title: "商品名稱",
      dataIndex: "itemName",
      align: "center",
    },
    {
      title: "規格",
      dataIndex: "itemSpec",
      align: "center",
    },
    {
      title: "單價",
      dataIndex: "salesPrice",
      align: "center",
    },
    {
      title: "訂購量",
      dataIndex: "qty",
      align: "center",
    },
    {
      title: "小計",
      dataIndex: "finalTotalAmt",
      align: "center",
    },
    {
      title: "出貨量",
      dataIndex: "pickupQty",
      align: "center",
      render: (text, record, index) => {
        return (
          <Input
            style={{ width: 80, textAlign: "center" }}
            disabled={product[index].pickupQty || !actionStatus.shipment}
            status={text && text !== record.qty && "error"}
            value={text}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value) || value === "") {
                const newList = productTableInfo.rows.map((r, idx) => {
                  if (idx !== index) return r;
                  return {
                    ...r,
                    pickupQty: value === "" ? "" : Number(e.target.value),
                  };
                });
                setProductTableInfo((state) => ({ ...state, rows: newList }));
              }
            }}
          />
        );
      },
    },
  ];

  // 貨運公司, 配送單號, 發票號碼, 發票開立日期, 包材重量, 出貨量 必須全部填完才能 enable
  const isShipDisabled = () => {
    const isPickupQtyValid = productTableInfo.rows.every((r) => r.pickupQty);
    return !(
      logisticsName &&
      shippingCode &&
      invoiceNo &&
      applyDate &&
      packaging &&
      isPickupQtyValid
    );
  };

  const isRevokeDisabled = () => {
    return !(backLogisticsName && backShippingCode);
  };

  // 詳細內容
  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/scm/order/${ecorderShipId}`)
      .then((res) => {
        const {
          receiverZip,
          receiverCityName,
          receiverDistrictName,
          receiverAddress,
          product,
          applyDate,
          receiverName,
          receiverPhone,
          receiverTelephone,
          remark,
          receiverAddressRemark,
          receiverElevatorName,
          receiverReceiveName,
          taxId,
          shipDateStart,
          shipDateEnd,
        } = res.data;

        form.setFieldsValue({
          ...res.data,
          applyDate: applyDate ? dayjs(applyDate) : null,
          receiverName: receiverName ? receiverName : "-",
          receiverPhone: receiverPhone ? receiverPhone : "-",
          receiverTelephone: receiverTelephone ? receiverTelephone : "-",
          fullAddress: `${receiverZip}${receiverCityName}${receiverDistrictName}${receiverAddress}`,
          remark: remark ? remark : "-",
          receiverAddressRemark: receiverAddressRemark
            ? receiverAddressRemark
            : "-",
          receiverElevatorName: receiverElevatorName
            ? receiverElevatorName
            : "-",
          receiverReceiveName: receiverReceiveName ? receiverReceiveName : "-",
          taxId: taxId ? taxId : "-",
          shipDate: `${shipDateStart} ~ ${shipDateEnd}`,
        });

        setInfo((state) => ({ ...state, ...res.data }));
        setProductTableInfo((state) => ({ ...state, rows: product }));
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const openModalTax = (e) => {
    e.stopPropagation();
    setShowModal((state) => ({
      ...state,
      tax: true,
    }));
  };

  const openModalAddress = (e) => {
    e.stopPropagation();
    setShowModal((state) => ({
      ...state,
      address: true,
    }));
  };

  // 出貨
  const handleShip = (e) => {
    e.stopPropagation();

    const isPickupQtyInValid = productTableInfo.rows.some(
      (r) => r.pickupQty !== r.qty
    );
    if (isPickupQtyInValid) {
      message.error("出貨量必須等於訂購量");
      return;
    }

    const { logisticsName, shippingCode, invoiceNo, applyDate, packaging } =
      form.getFieldsValue(true);

    const logisticsId = logisticsOptions.find(
      (opt) => opt.logisticsName === logisticsName
    ).logisticsId;

    const data = {
      logisticsId,
      shippingCode,
      invoiceNo,
      applyDate: applyDate.format("YYYY-MM-DD"),
      packaging: Number(packaging),
      product: productTableInfo.rows.map((r) => {
        return {
          ecorderItemDetailId: r.ecorderItemDetailId,
          pickupQty: r.pickupQty,
        };
      }),
    };

    setLoading((state) => ({ ...state, ship: true }));
    api
      .post(`v1/scm/order/${ecorderShipId}/ship`, data)
      .then((res) => {
        message.success(res.message);
        fetchInfo();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, ship: false }));
      });
  };

  // 異常
  const handleUnusual = () => {
    setLoading((state) => ({ ...state, unusual: true }));
    api
      .post(`v1/scm/order/${ecorderShipId}/11`)
      .then((res) => {
        message.success(res.message);
        fetchInfo();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .then(() => {
        setLoading((state) => ({ ...state, unusual: false }));
      });
  };

  // 已送達
  const handleArrived = () => {
    setLoading((state) => ({ ...state, arrived: true }));
    api
      .post(`v1/scm/order/${ecorderShipId}/10`)
      .then((res) => {
        message.success(res.message);
        fetchInfo();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .then(() => {
        setLoading((state) => ({ ...state, arrived: false }));
      });
  };

  // 拒收
  const handleReject = () => {
    setLoading((state) => ({ ...state, reject: true }));
    api
      .post(`v1/scm/order/${ecorderShipId}/12`)
      .then((res) => {
        message.success(res.message);
        fetchInfo();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .then(() => {
        setLoading((state) => ({ ...state, reject: false }));
      });
  };

  // 訂單取消
  const handleCancel = () => {
    const data = {
      ecorderShipId,
    };

    setLoading((state) => ({ ...state, cancel: true }));
    api
      .post(`v1/scm/order/cancel-order`, data)
      .then((res) => {
        message.success(res.message);
        fetchInfo();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .then(() => {
        setLoading((state) => ({ ...state, cancel: false }));
      });
  };

  // 退貨收回
  const handleRevoke = () => {
    const backLogisticsId = logisticsOptions.find(
      (opt) => opt.logisticsName === backLogisticsName
    ).logisticsId;

    const data = {
      backLogisticsId,
      backShippingCode,
    };

    setLoading((state) => ({ ...state, revoke: true }));
    api
      .post(`v1/scm/order/${info.refundId}/revoke`, data)
      .then((res) => {
        message.success(res.message);
        fetchInfo();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, revoke: false }));
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // "退貨申請" 狀態下預設收合 "顧客配送信息" 和 "出貨設定" 區塊
  useEffect(() => {
    setCollapseActiveKey(
      info.backStatusName ? [] : ["顧客配送信息", "出貨設定"]
    );
  }, [info]);

  return (
    <Container>
      <Spin spinning={loading.page}>
        <LayoutHeader>
          <LayoutHeaderTitle>訂單資料</LayoutHeaderTitle>
          <Breadcrumb
            separator=">"
            items={[
              { title: "訂單" },
              { title: <Link href={PATH_ORDER_LIST}>訂單管理</Link> },
              { title: "訂單明細" },
            ]}
          />

          <Space style={{ marginLeft: "auto" }} size={16}>
            {actionStatus.reject && (
              <Button
                type="secondary"
                loading={loading.reject}
                onClick={handleReject}
              >
                拒收
              </Button>
            )}

            {actionStatus.unusual && (
              <Button
                type="secondary"
                loading={loading.unusual}
                onClick={handleUnusual}
              >
                異常
              </Button>
            )}

            {actionStatus.arrived && (
              <Button
                type="primary"
                loading={loading.arrived}
                onClick={handleArrived}
              >
                已送達
              </Button>
            )}

            {actionStatus.revokeExamine && (
              <Button
                type="primary"
                onClick={() =>
                  setShowModal((state) => ({
                    ...state,
                    revokeExamine: true,
                  }))
                }
              >
                設定退貨審核結果
              </Button>
            )}

            {actionStatus.cancel && (
              <Button
                type="primary"
                danger
                loading={loading.cancel}
                onClick={handleCancel}
              >
                訂單取消
              </Button>
            )}
          </Space>
        </LayoutHeader>

        <Form
          form={form}
          colon={false}
          labelCol={{ flex: "130px" }}
          labelWrap
          labelAlign="right"
          requiredMark={false}
          autoComplete="off"
        >
          <Row>
            <Col span={24}>
              <TitleWrapper>
                <Title>基礎資料</Title>
              </TitleWrapper>

              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item name="ecorderDate" label="訂單日期">
                    <Input disabled />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="ecorderNo" label="訂單編號">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item name="orderStatus" label="訂單狀態">
                    <OrderStatusTag>
                      {info.backStatusName ? (
                        <Tag color="blue">{info.backStatusName}</Tag>
                      ) : info.ecorderStatusName || info.pickingStatusName ? (
                        <Tag color="blue">
                          {info.ecorderStatusName} / {info.pickingStatusName}
                        </Tag>
                      ) : undefined}
                    </OrderStatusTag>
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item name="shipDate" label="預計配送日">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={32}>
                <Col span={12}>
                  <Form.Item name="shippingFee" label="運費">
                    <Input disabled />
                  </Form.Item>
                </Col>

                {info.cancelReason && (
                  <Col span={12}>
                    <Form.Item name="cancelReason" label="退貨原因">
                      <Input disabled />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </Col>

            <Col span={24}>
              <Collapse
                activeKey={collapseActiveKey}
                ghost
                bordered={false}
                // expandIconPosition="end"
                items={[
                  {
                    key: "顧客配送信息",
                    showArrow: false,
                    label: (
                      <TitleWrapper>
                        <Title>
                          顧客配送信息
                          {collapseActiveKey.includes("顧客配送信息") ? (
                            <DownOutlined />
                          ) : (
                            <UpOutlined />
                          )}
                        </Title>
                        <Space style={{ marginLeft: "auto" }} size={16}>
                          {actionStatus.editTaxId && (
                            <Button type="secondary" onClick={openModalTax}>
                              修改統一編號
                            </Button>
                          )}

                          {actionStatus.editAddr && (
                            <Button type="secondary" onClick={openModalAddress}>
                              修改配送地址
                            </Button>
                          )}
                        </Space>
                      </TitleWrapper>
                    ),
                    children: (
                      <>
                        <Row gutter={32}>
                          <Col span={12}>
                            <Form.Item name="receiverName" label="姓名">
                              <Input disabled />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item name="receiverPhone" label="手機號碼">
                              <Input disabled />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={32}>
                          <Col span={12}>
                            <Form.Item name="receiverTelephone" label="市話">
                              <Input disabled />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item name="fullAddress" label="地址">
                              <Input disabled />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={32}>
                          <Col span={12}>
                            <Form.Item name="remark" label="訂單備註">
                              <TextArea
                                autoSize={{ minRows: 3, maxRows: 3 }}
                                disabled
                              />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item
                              name="receiverAddressRemark"
                              label="地址備註"
                            >
                              <TextArea
                                autoSize={{ minRows: 3, maxRows: 3 }}
                                disabled
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={32}>
                          <Col span={12}>
                            <Form.Item name="receiverElevatorName" label="電梯">
                              <Input disabled />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item name="receiverReceiveName" label="簽收">
                              <Input disabled />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={32}>
                          <Col span={12}>
                            <Form.Item
                              name="taxId"
                              label={
                                <span
                                  style={{
                                    color: info.taxId ? "red" : "inherit",
                                  }}
                                >
                                  統一編號
                                </span>
                              }
                            >
                              <Input disabled />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    ),
                  },
                  {
                    key: "出貨設定",
                    showArrow: false,
                    label: (
                      <TitleWrapper>
                        <Title>
                          出貨設定
                          {collapseActiveKey.includes("出貨設定") ? (
                            <DownOutlined />
                          ) : (
                            <UpOutlined />
                          )}
                        </Title>
                        <Space style={{ marginLeft: "auto" }} size={16}>
                          {actionStatus.printSalesDetail && (
                            <Link
                              href={`/pdf/salesDetail/${ecorderShipId}`}
                              target="_blank"
                            >
                              <Button
                                type="secondary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                銷貨明細列印
                              </Button>
                            </Link>
                          )}

                          {actionStatus.shipment && (
                            <Button
                              type="secondary"
                              loading={loading.ship}
                              disabled={isShipDisabled()}
                              onClick={handleShip}
                            >
                              出貨
                            </Button>
                          )}
                        </Space>
                      </TitleWrapper>
                    ),
                    children: (
                      <>
                        <Row gutter={32}>
                          <Col span={12}>
                            <Form.Item name="logisticsName" label="貨運公司">
                              <Select
                                style={{ width: "100%" }}
                                placeholder="請選擇貨運公司"
                                disabled={!actionStatus.shipment}
                                options={logisticsOptions.map((opt) => ({
                                  ...opt,
                                  label: opt.logisticsName,
                                  value: opt.logisticsName,
                                }))}
                              />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item name="shippingCode" label="配送單號">
                              <Input
                                placeholder="填寫配送單號"
                                disabled={!actionStatus.shipment}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={32}>
                          <Col span={12}>
                            <Form.Item name="invoiceNo" label="發票號碼">
                              <Input
                                placeholder="填寫發票號碼"
                                disabled={!actionStatus.shipment}
                              />
                            </Form.Item>
                          </Col>

                          <Col span={12}>
                            <Form.Item name="applyDate" label="發票開立日期">
                              <OrderDatePicker
                                style={{ width: "100%" }}
                                placeholder="填寫發票開立日期"
                                disabled={!actionStatus.shipment}
                                ecorderDate={info.ecorderDate}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={32}>
                          <Col span={12}>
                            <Form.Item name="packaging" label="包材重量">
                              <Input
                                placeholder="填寫包材重量"
                                suffix="克"
                                disabled={!actionStatus.shipment}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      </>
                    ),
                  },
                ]}
                onChange={(keyList) => {
                  setCollapseActiveKey(keyList);
                }}
              />
            </Col>

            {info.backStatus && (
              <Col span={24}>
                <TitleWrapper>
                  <Title>收貨設定</Title>
                  <Space style={{ marginLeft: "auto" }} size={16}>
                    {actionStatus.revoke && (
                      <Button
                        type="secondary"
                        disabled={isRevokeDisabled()}
                        loading={loading.revoke}
                        onClick={handleRevoke}
                      >
                        退貨收回
                      </Button>
                    )}

                    {actionStatus.revokeResult && (
                      <Button
                        type="primary"
                        onClick={() =>
                          setShowModal((state) => ({
                            ...state,
                            revokeResult: true,
                          }))
                        }
                      >
                        設定退貨收貨結果
                      </Button>
                    )}
                  </Space>
                </TitleWrapper>

                <Row gutter={32}>
                  <Col span={12}>
                    <Form.Item name="backLogisticsName" label="貨運公司">
                      <Select
                        style={{ width: "100%" }}
                        placeholder="請選擇貨運公司"
                        disabled={loading.revoke || !actionStatus.revoke}
                        options={logisticsOptions.map((opt) => ({
                          ...opt,
                          label: opt.logisticsName,
                          value: opt.logisticsName,
                        }))}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="backShippingCode" label="配送單號">
                      <Input
                        placeholder="填寫配送單號"
                        disabled={loading.revoke || !actionStatus.revoke}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            )}

            {[
              "退貨收貨完成",
              "退貨收貨失敗",
              "退貨退款中",
              "退款完成",
            ].includes(info.backStatusName) && (
              <Col span={24}>
                <TitleWrapper>
                  <Title>退貨資訊</Title>
                </TitleWrapper>

                {["退貨收貨完成"].includes(info.backStatusName) && (
                  <Row gutter={32}>
                    <Col span={12}>
                      <Form.Item name="backDate" label="退貨收貨完成日期">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {["退貨收貨失敗"].includes(info.backStatusName) && (
                  <Row gutter={32}>
                    <Col span={12}>
                      <Form.Item name="backDate" label="退貨收貨失敗日期">
                        <Input disabled />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item name="backReason" label="失敗原因">
                        <Input disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {["退貨退款中", "退款完成"].includes(info.backStatusName) && (
                  <>
                    <Row gutter={32}>
                      <Col span={12}>
                        <Form.Item name="backDate" label="退貨收貨完成日期">
                          <Input disabled />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          name="examDate"
                          label={
                            info.examReason === null
                              ? "退貨核可日期"
                              : "退貨不核可日期"
                          }
                        >
                          <Input disabled />
                        </Form.Item>
                      </Col>
                    </Row>

                    {info.examReason !== null && (
                      <Row gutter={32}>
                        <Col span={12}>
                          <Form.Item name="examReason" label="不核可原因">
                            <Input disabled />
                          </Form.Item>
                        </Col>

                        <Col span={12}>
                          <Form.Item name="examPhoto" label="圖片">
                            <Image
                              width={40}
                              height={40}
                              src={info.examPhoto}
                              alt=""
                              preview={{
                                toolbarRender: (
                                  _,
                                  {
                                    image: { url },
                                    transform: { scale },
                                    actions: { onZoomOut, onZoomIn },
                                  }
                                ) => (
                                  <Space size={12} className="toolbar-wrapper">
                                    <ZoomOutOutlined
                                      disabled={scale === 1}
                                      onClick={onZoomOut}
                                    />
                                    <ZoomInOutlined
                                      disabled={scale === 50}
                                      onClick={onZoomIn}
                                    />
                                  </Space>
                                ),
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </Col>
            )}

            <Col span={24}>
              <Table
                dataSource={productTableInfo.rows}
                columns={columns}
                pagination={false}
              />
            </Col>
          </Row>
        </Form>

        <ModalAddress
          info={{ ...info }}
          open={showModal.address}
          onOk={() => {
            setShowModal((state) => ({ ...state, address: false }));
            fetchInfo();
          }}
          onCancel={() => {
            setShowModal((state) => ({ ...state, address: false }));
          }}
        />

        <ModalRevokeResult
          info={{ ...info }}
          open={showModal.revokeResult}
          onOk={() => {
            setShowModal((state) => ({ ...state, revokeResult: false }));
            fetchInfo();
          }}
          onCancel={() => {
            setShowModal((state) => ({ ...state, revokeResult: false }));
          }}
        />

        <ModalRevokeExamine
          info={{ ...info }}
          open={showModal.revokeExamine}
          onOk={() => {
            setShowModal((state) => ({ ...state, revokeExamine: false }));
            fetchInfo();
          }}
          onCancel={() =>
            setShowModal((state) => ({ ...state, revokeExamine: false }))
          }
        />

        <ModalTax
          info={{ ...info }}
          open={showModal.tax}
          onOk={() => {
            setShowModal((state) => ({ ...state, tax: false }));
            fetchInfo();
          }}
          onCancel={() => {
            setShowModal((state) => ({ ...state, tax: false }));
          }}
        />
      </Spin>
    </Container>
  );
}
