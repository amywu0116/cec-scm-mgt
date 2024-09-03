import { App, Col, Flex, Form, Modal, Row } from "antd";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import TextArea from "@/components/TextArea";

import api from "@/api";

export default function ModalMessage(props) {
  const { open, selectedRows, onCancel } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState({
    modal: false,
  });

  const handleFinish = (values) => {
    const data = {
      msg: values.msg,
      idList: selectedRows.map((row) => row.ecorderShipId),
    };

    setLoading((state) => ({ ...state, modal: true }));
    api
      .post(`v1/scm/consultation/insert/noReply`, data)
      .then((res) => {
        message.success(res.message);
        onCancel();
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, modal: false })));
  };

  useEffect(() => {
    if (!open) {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title="發送訊息"
      width={600}
      closable={false}
      open={open}
      centered
      footer={() => {
        return (
          <Flex gap={16} justify="flex-end" align="center">
            <Button disabled={loading.modal} onClick={onCancel}>
              取消
            </Button>

            <Button
              type="primary"
              loading={loading.modal}
              onClick={() => form.submit()}
            >
              確認
            </Button>
          </Flex>
        );
      }}
      onCancel={onCancel}
    >
      <Form
        form={form}
        colon={false}
        labelCol={{ flex: "80px" }}
        labelWrap
        requiredMark={false}
        disabled={loading.modal}
        autoComplete="off"
        onFinish={handleFinish}
      >
        <Row>
          <Col span={24}>
            <Form.Item name="msg" rules={[{ required: true, message: "必填" }]}>
              <TextArea
                autoSize={{ minRows: 3, maxRows: 3 }}
                placeholder="請輸入訊息"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
