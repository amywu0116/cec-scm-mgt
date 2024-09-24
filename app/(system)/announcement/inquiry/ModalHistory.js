import { App, Col, Flex, Form, Row, Spin } from "antd";
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

export default function ModalHistory(props) {
  const { open, rowInfo, onCancel } = props;
  const { message } = App.useApp();

  const [form] = Form.useForm();
  const itemList = form.getFieldValue("itemList");
  const historyList = form.getFieldValue("historyList");

  const [loading, setLoading] = useState({
    modal: false,
  });

  const productColumns = [
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

  const columns = [
    {
      title: "回覆時間",
      dataIndex: "answerTime",
      align: "center",
    },
    {
      title: "回覆內容",
      dataIndex: "answer",
      align: "center",
    },
    {
      title: "回覆者",
      dataIndex: "respondent",
      align: "center",
    },
  ];

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, modal: true }));
    api
      .get(`v1/scm/consultation/${rowInfo.serviceId}/history`)
      .then((res) => {
        form.setFieldsValue({
          ecorderNo: res.data.ecorderNo,
          questionCategory: res.data.questionCategory,
          questionContent: res.data.questionContent,
          itemList: res.data.itemList,
          historyList: res.data.historyList,
        });
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
      title="訊息歷程查詢"
      centered
      closeIcon={false}
      width={800}
      open={open}
      onCancel={onCancel}
      destroyOnClose
      footer={[
        <Button key="ok" type="primary" onClick={onCancel}>
          了解
        </Button>,
      ]}
    >
      <Spin spinning={loading.modal}>
        <Form
          form={form}
          colon={false}
          labelCol={{ flex: "80px" }}
          labelWrap
          requiredMark={false}
          disabled={loading.modal}
          autoComplete="off"
          preserve={false}
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
                      columns={productColumns}
                      dataSource={itemList}
                    />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Row gutter={32}>
              <Col span={24}>
                <Form.Item name="itemList">
                  <TableTitle>回覆歷程</TableTitle>
                  <Table
                    size="small"
                    scroll={{ y: 240 }}
                    columns={columns}
                    dataSource={historyList}
                    pagination={false}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Flex>
        </Form>
      </Spin>
    </Modal>
  );
}
