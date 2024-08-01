"use client";
import {
  DeleteOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { App, Breadcrumb, Col, Form, Image, Row, Space, Upload } from "antd";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import ModalDelete from "@/components/Modal/ModalDelete";
import Select from "@/components/Select";
import Table from "@/components/Table";

import api from "@/api";
import {
  PATH_PRODUCT_APPLICATION,
  PATH_PRODUCT_PRODUCT_LIST,
} from "@/constants/paths";
import { useBoundStore } from "@/store";

const ImageCard = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  width: 100%;
  border-radius: 5px;
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const params = useParams();
  const applyId = params.applyId;

  const searchParams = useSearchParams();
  const itemName = searchParams.get("itemName");
  const itemEan = searchParams.get("itemEan");

  const options = useBoundStore((state) => state.options);
  const imgTypeOptions = options?.img_type ?? [];

  const [loading, setLoading] = useState({ table: false });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [imageList, setImageList] = useState();
  const [currentRowData, setCurrentRowData] = useState();

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      align: "center",
    },
    {
      title: "圖片類型",
      dataIndex: "imgType",
      align: "center",
    },
    {
      title: "圖片",
      dataIndex: "imgList",
      align: "center",
      render: (text, record, index) => {
        return (
          <Space size={10}>
            {text.map((t) => {
              return (
                <Image
                  key={t.id}
                  width={50}
                  height={50}
                  src={t.imgUrl}
                  alt=""
                  preview={{
                    toolbarRender: (
                      _,
                      {
                        image: { url },
                        transform: { scale },
                        actions: { onZoomOut, onZoomIn },
                      }
                    ) => (
                      <Space size={12} className="toolbar-wrapper">
                        <ZoomOutOutlined
                          disabled={scale === 1}
                          onClick={onZoomOut}
                        />

                        <ZoomInOutlined
                          disabled={scale === 50}
                          onClick={onZoomIn}
                        />

                        <DeleteOutlined
                          style={{ color: "red" }}
                          onClick={() => setShowModalDelete(true)}
                        />
                      </Space>
                    ),
                  }}
                />
              );
            })}
          </Space>
        );
      },
    },
    {
      title: "功能",
      dataIndex: "",
      align: "center",
      render: (text, record, index) => {
        return (
          <FunctionBtn
            onClick={() => {
              setCurrentRowData(record);
              setShowModalDelete(true);
            }}
          >
            刪除
          </FunctionBtn>
        );
      },
    },
  ];

  const fetchList = () => {
    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/product/apply/img`, { params: { applyId } })
      .then((res) => {
        setImageList(res.data);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  const handleFinish = (values) => {
    console.log("values", values);
    const formData = new FormData();
    formData.append("applyId", applyId);
    formData.append("imgType", values.imgType);

    const fileList = values.file.fileList.map((f) => f.originFileObj);
    fileList.forEach((file) => {
      formData.append("file", file);
    });

    setLoading((state) => ({ ...state, form: true }));
    api
      .post(`v1/scm/product/apply/img`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        message.success(res.message);
        fetchList();
        handleCancel();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, form: false }));
      });
  };

  const handleDelete = () => {
    api.delete(`v1/scm/product/apply/img?imgId=14`);
  };

  const handleCancel = () => {
    setShowImageUpload(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>圖片維護</LayoutHeaderTitle>

        <Breadcrumb
          separator=">"
          items={[
            { title: <Link href={PATH_PRODUCT_PRODUCT_LIST}>商品列表</Link> },
            { title: <Link href={PATH_PRODUCT_APPLICATION}>商品資料</Link> },
            { title: "圖片維護" },
          ]}
        />
      </LayoutHeader>

      <Form
        form={form}
        autoComplete="off"
        colon={false}
        labelCol={{ flex: "50px" }}
        labelWrap
        labelAlign="left"
        requiredMark={false}
        disabled={loading.form}
        initialValues={{
          itemName,
          itemEan,
        }}
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col span={8} xxl={{ span: 6 }}>
            <Form.Item name="itemName" label="條碼">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={8} xxl={{ span: 6 }}>
            <Form.Item name="itemEan" label="品名">
              <Input disabled />
            </Form.Item>
          </Col>

          <Col span={8} xxl={{ span: 6 }}>
            <Button type="primary" onClick={() => setShowImageUpload(true)}>
              上傳圖片
            </Button>
          </Col>
        </Row>

        <Row gutter={[0, 16]}>
          <Col span={24}>
            {showImageUpload && (
              <ImageCard>
                <Row gutter={16}>
                  <Col span={8} xxl={{ span: 6 }}>
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      name="imgType"
                      label="圖片類型"
                      labelCol="100px"
                      rules={[{ required: true, message: "必填" }]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        placeholder="請選擇圖片類型"
                        options={imgTypeOptions.map((t) => {
                          return { ...t, label: t.name };
                        })}
                      />
                    </Form.Item>
                  </Col>

                  <Col>
                    <Space size={16}>
                      <Form.Item
                        style={{ marginBottom: 0 }}
                        name="file"
                        label=""
                        valuePropName="fileList"
                        rules={[
                          { required: true, message: "必須至少上傳一張圖片" },
                        ]}
                      >
                        <Upload maxCount={10} multiple>
                          <Button type="secondary">上傳</Button>
                        </Upload>
                      </Form.Item>
                    </Space>
                  </Col>

                  <Col style={{ marginLeft: "auto" }}>
                    <Space size={16}>
                      <Button
                        style={{ marginLeft: "auto" }}
                        type="secondary"
                        htmlType="submit"
                      >
                        確認
                      </Button>

                      <Button type="default" onClick={handleCancel}>
                        取消
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </ImageCard>
            )}
          </Col>

          <Col span={24}>
            <Table
              loading={loading.table}
              columns={columns}
              dataSource={imageList}
              pagination={false}
            />
          </Col>
        </Row>
      </Form>

      <ModalDelete
        open={showModalDelete}
        onOk={handleDelete}
        onCancel={() => setShowModalDelete(false)}
      />
    </>
  );
}
