"use client";
import { App, Breadcrumb, Form, Space, Spin } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";

import FormProduct from "../FormProduct";
import ModalPreviewPDP from "../ModalPreviewPDP";

import api from "@/api";
import {
  PATH_PRODUCT_IMAGE_MAINTENANCE,
  PATH_PRODUCT_STOCK_SETTINGS,
} from "@/constants/paths";

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const router = useRouter();

  const params = useParams();
  const productId = params.productId;

  const [loading, setLoading] = useState({
    page: false,
    pdp: false,
  });

  const [openModal, setOpenModal] = useState({
    pdp: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [shippingList, setShippingList] = useState([]);
  const [info, setInfo] = useState({});

  const itemName = form.getFieldValue("itemName");
  const itemEan = form.getFieldValue("itemEan");
  const isFood = form.getFieldValue("isFood") === true;
  const isNonFood = form.getFieldValue("isFood") === false;

  // 詳細內容
  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/scm/product/${params.productId}`)
      .then((res) => {
        const { stockStartdate, stockEnddate } = res.data;
        form.setFieldsValue({
          ...res.data,
          stockDate:
            stockStartdate && stockEnddate
              ? [dayjs(stockStartdate), dayjs(stockEnddate)]
              : undefined,
        });
        setInfo({ ...res.data });
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  // 分車類型下拉選單內容
  const fetchShipping = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/vendor/shipping")
      .then((res) => {
        setShippingList(res.data);
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  // 確認修改
  const handleFinish = (values) => {
    const data = {
      ...values,
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
      .patch(`v1/scm/product/${productId}`, data)
      .then((res) => {
        message.success(res.message);
        setIsEditing(false);
        fetchInfo();
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
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
              onClick={() => setOpenModal((state) => ({ ...state, pdp: true }))}
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

        <FormProduct
          type="product"
          form={form}
          info={info}
          disabled={!isEditing}
          shippingList={shippingList}
          isFood={isFood}
          isNonFood={isNonFood}
          onFinish={handleFinish}
        />
      </Spin>

      <ModalPreviewPDP
        type="product"
        id={params.productId}
        open={openModal.pdp}
        onCancel={() => setOpenModal((state) => ({ ...state, pdp: false }))}
      />
    </>
  );
}
