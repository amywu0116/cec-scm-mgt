"use client";
import { App, Breadcrumb, Form, Space, Spin } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";

import FormProduct from "../../FormProduct";
import ModalPreviewPDP from "../../ModalPreviewPDP";

import api from "@/api";
import { routes } from "@/routes";

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

  const [loading, setLoading] = useState({ page: true, pdpPreview: false });
  const [showModal, setShowModal] = useState({ previewPDP: false });

  const [categoryList, setCategoryList] = useState([]);
  const [shippingList, setShippingList] = useState();
  const [info, setInfo] = useState({});

  // 商品分類下拉選單內容
  const fetchCategory = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/system/option/category`)
      .then((res) => {
        setCategoryList(res.data);
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
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
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
        router.push(routes.product.applicationEdit(res.data.applyId));
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
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
        router.push(routes.product.application);
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
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
              onClick={() => form.submit()}
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

            <Link
              href={{
                pathname: routes.product.imageMaintenanceApply(applyId),
                query: {
                  itemName: form.getFieldValue("itemName"),
                  itemEan: form.getFieldValue("itemEan"),
                },
              }}
            >
              <Button
                type="secondary"
                disabled={!isEdit || ["審核通過"].includes(applyStatusName)}
              >
                商品相關圖檔維護
              </Button>
            </Link>
          </Space>
        </LayoutHeader>

        <FormProduct
          type="apply"
          form={form}
          info={info}
          disabled={isEdit && !canEdit}
          categoryList={categoryList}
          shippingList={shippingList}
          isFood={isFood}
          isNonFood={isNonFood}
          onFinish={handleFinish}
        />
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
