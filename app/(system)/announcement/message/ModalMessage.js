import { App, Checkbox, Col, Flex, Form, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Table from "@/components/Table";
import TextArea from "@/components/TextArea";

import api from "@/api";

const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 36px;
`;

export default function ModalMessage(props) {
  const { open, rowInfo, onOk, onCancel } = props;
  const { message } = App.useApp();

  const [form] = Form.useForm();
  const itemList = form.getFieldValue("itemList");
  const status = form.getFieldValue("status");

  const [loading, setLoading] = useState({
    modal: false,
  });

  const [isClosed, setIsClosed] = useState(false);

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
  ];

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, modal: true }));
    api
      .get(`v1/scm/consultation/${rowInfo.serviceId}`)
      .then((res) => {
        form.setFieldsValue({
          ecorderNo: res.data.ecorderNo,
          questionCategory: res.data.questionCategory,
          questionContent: res.data.questionContent,
          itemList: res.data.itemList,
          replyMsg: res.data.answer,
          status: res.data.status,
        });
        setIsClosed(!!res.data.status);
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, modal: false })));
  };

  // 送出回覆
  const handleFinish = (values) => {
    const data = {
      replyMsg: values.replyMsg,
      isClosed,
    };

    setLoading((state) => ({ ...state, modal: true }));
    api
      .post(`v1/scm/consultation/${rowInfo.serviceId}/reply`, data)
      .then((res) => {
        message.success(res.message);
        fetchInfo();
        onOk();
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, modal: false })));
  };

  useEffect(() => {
    if (open) {
      fetchInfo();
    } else {
      form.resetFields();
    }
  }, [open]);

  return (
    <Modal
      title="回覆訊息內容"
      centered
      closeIcon={false}
      width={800}
      open={open}
      onCancel={onCancel}
      destroyOnClose
      footer={(_, { OkBtn, CancelBtn }) => (
        <Flex gap={16} justify="flex-end" align="center">
          <Checkbox
            disabled={loading.modal || !!status}
            checked={isClosed}
            onChange={(e) => setIsClosed(e.target.checked)}
          >
            結案
          </Checkbox>

          <Button onClick={onCancel}>取消</Button>

          <Button
            type="primary"
            loading={loading.modal}
            disabled={!!status}
            onClick={() => form.submit()}
          >
            送出回覆
          </Button>
        </Flex>
      )}
    >
      <Spin spinning={loading.modal}>
        <Form
          form={form}
          colon={false}
          labelCol={{ flex: "80px" }}
          labelWrap
          requiredMark={false}
          disabled={loading.modal || !!status}
          autoComplete="off"
          preserve={false}
          onFinish={handleFinish}
        >
          <Flex vertical>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="ecorderNo" label="訂單編號">
                  <Input placeholder="請輸入訂單編號" disabled />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item name="questionCategory" label="問題類別">
                  <Input placeholder="請輸入問題類別" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={24}>
                <Form.Item name="questionContent" label="提問內容">
                  <TextArea
                    autoSize={{ minRows: 3, maxRows: 3 }}
                    disabled
                    placeholder="請輸入提問內容"
                  />
                </Form.Item>
              </Col>
            </Row>

            {itemList?.length > 0 && (
              <Row gutter={32}>
                <Col span={24}>
                  <Form.Item name="itemList">
                    <TableTitle>提問商品</TableTitle>
                    <Table
                      rowKey="productnumber"
                      pagination={false}
                      columns={columns}
                      dataSource={itemList}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={32}>
              <Col span={24}>
                <Form.Item
                  name="replyMsg"
                  label="回覆內容"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
                </Form.Item>
              </Col>
            </Row>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
}
