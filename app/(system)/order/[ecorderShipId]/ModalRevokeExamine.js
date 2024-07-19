"use client";
import { App, Col, Form, Radio, Row, Upload } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import TextArea from "@/components/TextArea";

import api from "@/api";

const Container = styled.div`
  .ant-upload-wrapper {
    display: flex;
  }
`;

export default function ModalRevokeExamine(props) {
  const { info, open, onOk, onCancel } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({
    modal: false,
  });

  const approval = Form.useWatch("approval", form);

  const handleFinish = (values) => {
    const formData = new FormData();
    formData.append("approval", values.approval);
    formData.append("examDate", dayjs(values.examDate).format("YYYY-MM-DD"));

    if (values.approval === false) {
      const file = values.file.file.originFileObj;
      formData.append("file", file);
      formData.append("examReason", values.examReason);
      formData.append("examPrice", values.examPrice);
    }

    setLoading((state) => ({ ...state, modal: true }));
    api
      .post(`v1/scm/order/${info.refundId}/revokeExamine`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        message.success(res.message);
        onOk();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, modal: false }));
      });
  };

  return (
    <Modal
      title="設定退貨審核結果"
      centered
      closeIcon={false}
      width={800}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" disabled={loading.modal} onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={loading.modal}
          onClick={() => form.submit()}
        >
          確定送出
        </Button>,
      ]}
    >
      <Container>
        <Form
          form={form}
          colon={false}
          labelCol={{ flex: "80px" }}
          labelWrap
          labelAlign="left"
          requiredMark={false}
          autoComplete="off"
          preserve={false}
          disabled={loading.modal}
          onFinish={handleFinish}
        >
          <Row>
            <Col span={24}>
              <Form.Item
                name="approval"
                label="退貨核可狀態"
                rules={[{ required: true, message: "必填" }]}
              >
                <Radio.Group
                  options={[
                    { label: "退貨核可", value: true },
                    { label: "退貨不核可", value: false },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item
                name="examDate"
                label="退貨核可日期"
                rules={[{ required: true, message: "必填" }]}
              >
                <DatePicker style={{ width: "100%" }} placeholder="選擇日期" />
              </Form.Item>
            </Col>
          </Row>

          {approval === false && (
            <>
              <Row>
                <Col span={12}>
                  <Form.Item
                    name="examPrice"
                    label="整新費"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Input placeholder="請輸入整新費" />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item
                    name="examReason"
                    label="不核可原因"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <TextArea
                      placeholder="請輸入不核可原因"
                      autoSize={{ minRows: 3, maxRows: 3 }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item
                    name="file"
                    label="上傳圖片"
                    rules={[{ required: true, message: "必填" }]}
                  >
                    <Upload>
                      <Button>選擇檔案</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Container>
    </Modal>
  );
}
