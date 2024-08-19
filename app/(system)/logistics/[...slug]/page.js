"use client";
import { App, Breadcrumb, Col, Form, Radio, Row, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import ModalDelete from "@/components/Modal/ModalDelete";
import TextArea from "@/components/TextArea";

import api from "@/api";
import { PATH_LOGISTICS } from "@/constants/paths";

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
`;

export default function Page(props) {
  const { params } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const router = useRouter();

  const isAdd = params.slug[0] === "add";
  const isEdit = params.slug[0] === "edit";
  const logisticsId = isEdit && params.slug[1];

  const [loading, setLoading] = useState({ page: false, delete: false });
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const validateCode = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }

    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return Promise.reject(new Error("只能輸入英數字"));
    }

    return Promise.resolve();
  };

  const validatePhone = (_, value) => {
    if (!value) {
      return Promise.resolve();
    }

    if (!/^[0-9]+$/.test(value)) {
      return Promise.reject(new Error("只能輸入數字"));
    }

    return Promise.resolve();
  };

  const fetchInfo = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get(`v1/scm/logistics/${logisticsId}`)
      .then((res) => {
        form.setFieldsValue({ ...res.data });
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const handleFinish = (values) => {
    const data = {
      code: isAdd ? values.code : undefined,
      logisticsName: values.logisticsName,
      address: values.address,
      contact: values.contact,
      phone: values.phone,
      status: values.status,
      comment: values.comment,
    };

    setLoading((state) => ({ ...state, page: true }));
    api
      .post(`v1/scm/logistics/${isEdit ? logisticsId : ""}`, data)
      .then((res) => {
        message.success(res.message);
        router.push(PATH_LOGISTICS);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  const handleDelete = () => {
    setLoading((state) => ({ ...state, delete: true }));
    api
      .delete(`v1/scm/logistics/${logisticsId}`)
      .then((res) => {
        message.success(res.message);
        router.push(PATH_LOGISTICS);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, delete: false }));
      });
  };

  useEffect(() => {
    if (isEdit) {
      fetchInfo();
    }
  }, []);

  return (
    <Spin spinning={loading.page}>
      <LayoutHeader>
        <LayoutHeaderTitle>貨運公司維護</LayoutHeaderTitle>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: (
                <Link href="javascript:;" onClick={() => router.back()}>
                  貨運公司維護
                </Link>
              ),
            },
            { title: isAdd ? "新增" : isEdit ? "編輯" : "" },
          ]}
        />

        <Row style={{ marginLeft: "auto" }} gutter={16}>
          <Col>
            <Button onClick={() => router.push(PATH_LOGISTICS)}>取消</Button>
          </Col>

          {isAdd && (
            <Col>
              <Button type="primary" onClick={() => form.submit()}>
                確定新增
              </Button>
            </Col>
          )}

          {isEdit && (
            <>
              <Col>
                <Button onClick={() => setOpenModalDelete(true)}>
                  刪除貨運公司
                </Button>
              </Col>

              <Col>
                <Button type="primary" onClick={() => form.submit()}>
                  保存
                </Button>
              </Col>
            </>
          )}
        </Row>
      </LayoutHeader>

      <Form
        form={form}
        autoComplete="off"
        labelCol={{ flex: "110px" }}
        colon={false}
        onFinish={handleFinish}
      >
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <Title>基礎資料</Title>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="code"
                  label="代碼"
                  rules={[
                    { required: true, message: "必填" },
                    { validator: validateCode },
                  ]}
                >
                  <Input
                    placeholder="請輸入代碼"
                    disabled={!isAdd}
                    showCount
                    maxLength={20}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="logisticsName"
                  label="貨運公司名稱"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input
                    placeholder="請輸入貨運公司名稱"
                    showCount
                    maxLength={50}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Title>聯絡方式</Title>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="contact"
                  label="聯絡人"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="請輸入聯絡人" showCount maxLength={20} />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="address"
                  label="地址"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Input placeholder="請輸入地址" showCount maxLength={200} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="聯絡電話"
                  rules={[
                    { required: true, message: "必填" },
                    { validator: validatePhone },
                  ]}
                >
                  <Input
                    placeholder="請輸入貨運公司名稱"
                    showCount
                    maxLength={20}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Title>其他設定</Title>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="啟用"
                  rules={[{ required: true, message: "必填" }]}
                >
                  <Radio.Group
                    options={[
                      { label: "是", value: 1 },
                      { label: "否", value: 0 },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="comment" label="備註">
                  <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>

      <ModalDelete
        open={openModalDelete}
        loading={loading.delete}
        onOk={handleDelete}
        onCancel={() => setOpenModalDelete(false)}
      />
    </Spin>
  );
}
