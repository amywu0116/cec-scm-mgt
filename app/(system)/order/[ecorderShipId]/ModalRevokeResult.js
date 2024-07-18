"use client";
import { App, Col, Form, Radio, Row } from "antd";
import dayjs from "dayjs";
import { useState } from "react";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Modal from "@/components/Modal";
import TextArea from "@/components/TextArea";

import api from "@/api";

export default function ModalRevokeResult(props) {
  const { info, open, onOk, onCancel } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const isSuccess = Form.useWatch("isSuccess", form);

  const [loading, setLoading] = useState({
    revokeResult: false,
  });

  const handleFinish = (values) => {
    const data = {
      isSuccess: values.isSuccess,
      backDate: dayjs(values.backDate).format("YYYY-MM-DD"),
      backReason: values.isSuccess ? null : values.backReason,
    };

    setLoading((state) => ({ ...state, revokeResult: true }));
    api
      .post(`v1/scm/order/${info.refundId}/revokeResult`, data)
      .then((res) => {
        message.success(res.message);
        onOk();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, revokeResult: false }));
      });
  };

  return (
    <Modal
      title="設定退貨結果"
      centered
      closeIcon={false}
      width={800}
      destroyOnClose
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" disabled={loading.address} onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={loading.address}
          onClick={() => form.submit()}
        >
          確定送出
        </Button>,
      ]}
    >
      <Form
        form={form}
        colon={false}
        labelCol={{ flex: "80px" }}
        labelWrap
        labelAlign="left"
        requiredMark={false}
        autoComplete="off"
        preserve={false}
        disabled={loading.address}
        onFinish={handleFinish}
      >
        <Row>
          <Col span={24}>
            <Form.Item
              name="isSuccess"
              label="退貨收貨狀態"
              rules={[{ required: true, message: "必填" }]}
            >
              <Radio.Group
                options={[
                  { label: "完成", value: true },
                  { label: "失敗", value: false },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              name="backDate"
              label="退貨收貨失敗日期"
              rules={[{ required: true, message: "必填" }]}
            >
              <DatePicker style={{ width: "100%" }} placeholder="選擇日期" />
            </Form.Item>
          </Col>
        </Row>

        {isSuccess === false && (
          <Row>
            <Col span={24}>
              <Form.Item
                name="backReason"
                label="失敗原因"
                rules={[{ required: true, message: "必填" }]}
              >
                <TextArea rows={6} autoSize={{ minRows: 3, maxRows: 3 }} />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
}
