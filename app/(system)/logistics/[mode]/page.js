"use client";
import { App, Breadcrumb, Flex, Form, Radio, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import ModalDelete from "@/components/Modal/ModalDelete";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";

import api from "@/api";
import { PATH_LOGISTICS } from "@/constants/paths";
import { useBoundStore } from "@/store";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;

  .ant-form-item {
    .ant-form-item-label > label {
      height: 42px;
      font-size: 14px;
      font-weight: 700;
      color: #7b8093;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 35px;
`;

const BtnGroup = styled.div`
  display: flex;
  margin-left: auto;
  gap: 0 16px;
`;

const Page = (props) => {
  const { params } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const router = useRouter();

  const isAdd = params.mode === "add";

  const logistics = useBoundStore((state) => state.logistics) ?? [];

  const [loading, setLoading] = useState({ page: false });
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

  const handleFinish = (values) => {
    console.log("values", values);

    const data = {
      code: values.code,
      logisticsType: String(values.logisticsType),
      logisticsName: values.logisticsName,
      address: values.address,
      contact: values.contact,
      phone: values.phone,
      status: values.status,
      comment: values.comment,
    };

    console.log("data", data);

    setLoading((state) => ({ ...state, page: true }));
    api
      .post("v1/scm/logistics", data)
      .then((res) => {
        message.success(res.message);
        router.push(PATH_LOGISTICS);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, page: false }));
      });
  };

  return (
    <Spin spinning={loading.page}>
      <LayoutHeader>
        <LayoutHeaderTitle>貨運公司維護</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            { title: <Link href={PATH_LOGISTICS}>貨運公司維護</Link> },
            { title: "新增" },
          ]}
        />

        <BtnGroup>
          <Button onClick={() => router.push(PATH_LOGISTICS)}>取消</Button>

          {isAdd ? (
            <>
              <Button type="primary" onClick={() => form.submit()}>
                確定新增
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setOpenModalDelete(true)}>
                刪除貨運公司
              </Button>

              <Button type="primary">保存</Button>
            </>
          )}
        </BtnGroup>
      </LayoutHeader>

      <Form
        form={form}
        colon={false}
        labelCol={{ flex: "110px" }}
        scrollToFirstError={{ behavior: "smooth", block: "center" }}
        onFinish={handleFinish}
      >
        <Container>
          <Wrapper>
            <Title>基礎資料</Title>

            <Flex gap={16}>
              <Form.Item
                style={{ flex: 1 }}
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

              <Form.Item
                style={{ flex: 1 }}
                name="logisticsType"
                label="貨運公司類型"
                rules={[{ required: true, message: "必填" }]}
              >
                <Select
                  style={{ width: "100%" }}
                  placeholder="選擇貨運公司類型"
                  disabled={!isAdd}
                  options={logistics.map((l) => ({
                    ...l,
                    label: l.logisticsName,
                    value: l.logisticsId,
                  }))}
                />
              </Form.Item>
            </Flex>

            <Flex gap={16}>
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
            </Flex>
          </Wrapper>

          <Wrapper>
            <Title>聯絡方式</Title>

            <Flex gap={16}>
              <Form.Item
                name="contact"
                label="聯絡人"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input placeholder="請輸入聯絡人" showCount maxLength={20} />
              </Form.Item>

              <Form.Item
                name="address"
                label="地址"
                rules={[{ required: true, message: "必填" }]}
              >
                <Input placeholder="請輸入地址" showCount maxLength={200} />
              </Form.Item>
            </Flex>

            <Flex gap={16}>
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
            </Flex>
          </Wrapper>

          <Wrapper>
            <Title>其他設定</Title>

            <Flex gap={16}>
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
            </Flex>

            <Flex gap={16}>
              <Form.Item name="comment" label="備註">
                <TextArea autoSize={{ minRows: 3, maxRows: 3 }} />
              </Form.Item>
            </Flex>
          </Wrapper>
        </Container>
      </Form>

      <ModalDelete
        open={openModalDelete}
        onOk={() => {}}
        onCancel={() => setOpenModalDelete(false)}
      />
    </Spin>
  );
};

export default Page;
