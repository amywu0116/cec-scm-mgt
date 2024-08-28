"use client";
import {
  DeleteOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import {
  App,
  Breadcrumb,
  Col,
  Form,
  Image,
  Row,
  Space,
  Tooltip,
  Upload,
} from "antd";
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
import SearchForm from "./SearchForm";

import api from "@/api";
import {
  PATH_PRODUCT_APPLICATION,
  PATH_PRODUCT_PRODUCT_LIST,
} from "@/constants/paths";
import { useBoundStore } from "@/store";

const Container = styled.div`
  .file-upload {
    .ant-col.ant-form-item-control {
      display: flex;
      flex-direction: row;
    }

    .ant-form-item-explain-error {
      line-height: 42px;
      margin-left: 10px;
    }
  }
`;

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
  const type = params.type;
  const isApply = type === "apply";
  const isProduct = type === "product";
  const id = params.id;

  const searchParams = useSearchParams();
  const itemName = searchParams.get("itemName");
  const itemEan = searchParams.get("itemEan");

  const options = useBoundStore((state) => state.options);
  const imgTypeOptions = options?.img_type ?? [];

  const [loading, setLoading] = useState({
    table: false,
    form: false,
    delete: false,
  });

  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [imageList, setImageList] = useState();
  const [deleteImgIds, setDeleteImgIds] = useState();

  const columns = [
    {
      title: "No.",
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
                <Tooltip key={t.id} title={t.fileName}>
                  <Image
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
                            onClick={() => {
                              setDeleteImgIds([t.id]);
                              setShowModalDelete(true);
                            }}
                          />
                        </Space>
                      ),
                    }}
                  />
                </Tooltip>
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
              const ids = record.imgList.map((img) => img.id);
              setDeleteImgIds(ids);
              setShowModalDelete(true);
            }}
          >
            刪除
          </FunctionBtn>
        );
      },
    },
  ];

  const beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 <= 1;
    if (!isLt1M) {
      message.error("每張圖片的大小最多只能 1MB");
      return false;
    }
  };

  const validateFile = (_, value) => {
    if (value.fileList.length > 10) {
      return Promise.reject(new Error("每次上傳張數上限為 10 張"));
    }
    return Promise.resolve();
  };

  const fetchList = () => {
    const apiUrl = isProduct
      ? `v1/scm/product/img`
      : isApply
        ? `v1/scm/product/apply/img`
        : "";

    const params = isProduct
      ? { productId: id }
      : isApply
        ? { applyId: id }
        : undefined;

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(apiUrl, { params })
      .then((res) => setImageList(res.data))
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, table: false })));
  };

  const handleFinish = (values) => {
    let apiUrl = "";
    const formData = new FormData();

    if (isApply) {
      formData.append("applyId", id);
      apiUrl = `v1/scm/product/apply/img`;
    }

    if (isProduct) {
      formData.append("productId", id);
      apiUrl = `v1/scm/product/img/upload`;
    }

    formData.append("imgType", values.imgType);

    const fileList = values.file.fileList.map((f) => f.originFileObj);
    fileList.forEach((file) => {
      formData.append("file", file);
    });

    setLoading((state) => ({ ...state, form: true }));
    api
      .post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        message.success(res.message);
        fetchList();
        handleCancel();
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, form: false })));
  };

  const handleDelete = () => {
    const imgIds = deleteImgIds.join(",");

    const apiUrl = isProduct
      ? `v1/scm/product/img`
      : isApply
        ? `v1/scm/product/apply/img`
        : "";

    const params = isProduct
      ? { productId: id, productAttributeIds: imgIds }
      : isApply
        ? { imgIds }
        : undefined;

    setLoading((state) => ({ ...state, delete: true }));
    api
      .delete(apiUrl, { params })
      .then((res) => {
        message.success(res.message);
        setShowModalDelete(false);
        fetchList();
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, delete: false })));
  };

  const handleCancel = () => {
    setShowImageUpload(false);
    form.resetFields();
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Container>
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

      <Space style={{ width: "100%" }} direction="vertical" size={100}>
        <Form
          form={form}
          autoComplete="off"
          colon={false}
          requiredMark={false}
          disabled={loading.form}
          initialValues={{
            itemName,
            itemEan,
          }}
          onFinish={handleFinish}
        >
          <Space style={{ width: "100%" }} direction="vertical" size={16}>
            <Row gutter={16}>
              <Col span={8} xxl={{ span: 6 }}>
                <Form.Item style={{ margin: 0 }} name="itemName" label="品名">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={8} xxl={{ span: 6 }}>
                <Form.Item style={{ margin: 0 }} name="itemEan" label="條碼">
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col span={8} xxl={{ span: 6 }}>
                <Button type="primary" onClick={() => setShowImageUpload(true)}>
                  上傳圖片
                </Button>
              </Col>
            </Row>

            <Row>
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
                            className="file-upload"
                            name="file"
                            label=""
                            rules={[
                              {
                                required: true,
                                message: "必須至少上傳一張圖片",
                              },
                              { validator: validateFile },
                            ]}
                          >
                            <Upload
                              multiple
                              beforeUpload={beforeUpload}
                              showUploadList={{
                                extra: ({ size = 0 }) => (
                                  <span className="ant-upload-list-item-name">
                                    ({(size / 1024 / 1024).toFixed(2)}MB)
                                  </span>
                                ),
                              }}
                            >
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
                            loading={loading.form}
                            disabled={false}
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

                    <Row style={{ marginTop: 10 }}>
                      <div>
                        <div>每張圖片大小上限：1MB</div>
                        <div>
                          建議圖片長寬：商品主圖（800x800
                          px）、商品特色說明圖（寬度 880 px）
                        </div>
                        <div>每次上傳張數上限：10</div>
                      </div>
                    </Row>
                  </ImageCard>
                )}
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <Table
                  loading={loading.table}
                  columns={columns}
                  dataSource={imageList}
                  pagination={false}
                />
              </Col>
            </Row>
          </Space>
        </Form>

        <SearchForm fetchProductImgList={fetchList} />
      </Space>

      <ModalDelete
        open={showModalDelete}
        loading={loading.delete}
        onOk={handleDelete}
        onCancel={() => {
          setShowModalDelete(false);
          setDeleteImgIds(undefined);
        }}
      />
    </Container>
  );
}
