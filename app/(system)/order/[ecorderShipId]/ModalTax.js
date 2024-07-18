"use client";
import { App, Col, Form, Row } from "antd";
import { useParams } from "next/navigation";
import { useState } from "react";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";

import api from "@/api";
import { isValidTaxId } from "@/utils/validate";

export default function ModalTax(props) {
  const { info, open, onOk, onCancel } = props;
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const params = useParams();
  const ecorderShipId = params.ecorderShipId;

  const [loading, setLoading] = useState({
    tax: false,
  });

  const validateTaxId = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }

    if (!isValidTaxId(value)) {
      return Promise.reject(new Error("統一編號格式錯誤"));
    }

    return Promise.resolve();
  };

  const handleFinish = (values) => {
    const data = {
      taxId: values.taxId,
    };

    setLoading((state) => ({ ...state, tax: true }));
    api
      .post(`v1/scm/order/${ecorderShipId}/taxId`, data)
      .then((res) => {
        message.success(res.message);
        onOk();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, tax: false }));
      });
  };

  return (
    <Modal
      title="修改統一編號"
      centered
      closeIcon={false}
      width={400}
      open={open}
      destroyOnClose
      onCancel={onCancel}
      footer={[
        <Button key="cancel" disabled={loading.tax} onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={loading.tax}
          onClick={() => form.submit()}
        >
          確定送出
        </Button>,
      ]}
    >
      <Form
        form={form}
        autoComplete="off"
        preserve={false}
        disabled={loading.tax}
        onFinish={handleFinish}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>原統一編號：{`${info.taxId ?? "-"}`}</Col>

          <Col span={24}>
            <Form.Item
              name="taxId"
              rules={[
                { required: true, message: "必填" },
                { validator: validateTaxId },
              ]}
            >
              <Input placeholder="請輸入新統一編號" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
