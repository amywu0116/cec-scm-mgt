"use client";
import {
  DeleteOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { App, Col, Form, Image, Row, Space, Spin, Upload } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import ModalDelete from "@/components/Modal/ModalDelete";
import Select from "@/components/Select";
import Table from "@/components/Table";

import api from "@/api";
import RangePicker from "@/components/DatePicker/RangePicker";
import { useBoundStore } from "@/store";

const ImageCard = styled.div`
  background-color: #f1f3f6;
  padding: 16px;
  width: 100%;
  border-radius: 5px;
`;

export default function Page() {
  const { message } = App.useApp();
  const [searchForm] = Form.useForm();
  const [uploadForm] = Form.useForm();

  const options = useBoundStore((state) => state.options);
  const imgTypeOptions = options?.img_type ?? [];

  const [loading, setLoading] = useState({
    table: false,
    upload: false,
    delete: false,
  });

  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const [deleteImgIds, setDeleteImgIds] = useState();

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      align: "center",
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: "檔名",
      dataIndex: "imgTypeName",
      align: "center",
    },
    {
      title: "圖片",
      dataIndex: "imgUrl",
      align: "center",
      render: (text, record, index) => {
        return (
          <Image
            key={record.id}
            width={50}
            height={50}
            src={text}
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
                  <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />

                  <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />

                  {record.canDeleted && (
                    <DeleteOutlined
                      style={{ color: "red" }}
                      onClick={() => {
                        setDeleteImgIds([record.id]);
                        setShowModalDelete(true);
                      }}
                    />
                  )}
                </Space>
              ),
            }}
          />
        );
      },
    },
    {
      title: "已綁定之商品",
      dataIndex: "bindedProduct",
      align: "center",
      render: (text, record, index) => {
        if ([null, undefined].includes(text)) {
          return "-";
        }
        return text;
      },
    },
    {
      title: "上傳日期",
      dataIndex: "createdTime",
      align: "center",
    },
    {
      title: "上傳人員",
      dataIndex: "createUser",
      align: "center",
    },
    {
      title: "功能",
      dataIndex: "",
      align: "center",
      render: (text, record, index) => {
        return (
          <FunctionBtn
            disabled={!record.canDeleted}
            onClick={() => {
              setDeleteImgIds([record.id]);
              setShowModalDelete(true);
            }}
          >
            刪除
          </FunctionBtn>
        );
      },
    },
  ];

  const fetchList = (values, pagination = { page: 1, pageSize: 10 }) => {
    const data = {
      offset: (pagination.page - 1) * pagination.pageSize,
      max: pagination.pageSize,
      createTimeStart: values.createTime
        ? values.createTime[0].format("YYYY-MM-DD")
        : undefined,
      createTimeEnd: values.createTime
        ? values.createTime[0].format("YYYY-MM-DD")
        : undefined,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/product/apply/img/list`, { params: { ...data } })
      .then((res) => {
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: pagination.page,
          pageSize: pagination.pageSize,
          tableQuery: { ...values },
        }));
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  const handleChangeTable = (page, pageSize) => {
    fetchList(tableInfo.tableQuery, { page, pageSize });
  };

  const handleFinishSearch = (values) => {
    fetchList(values);
  };

  const handleFinishUpload = (values) => {
    const formData = new FormData();
    formData.append("imgType", values.imgType);

    const fileList = values.file.fileList.map((f) => f.originFileObj);
    fileList.forEach((file) => {
      formData.append("file", file);
    });

    setLoading((state) => ({ ...state, upload: true }));
    api
      .post(`/v1/scm/product/apply/img/batch`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        message.success(res.message);
        fetchList(tableInfo.tableQuery);
        handleCloseUpload();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, upload: false }));
      });
  };

  const handleCloseUpload = () => {
    setShowImageUpload(false);
    uploadForm.resetFields();
  };

  const handleDelete = () => {
    const imgIds = deleteImgIds.join(",");
    setLoading((state) => ({ ...state, delete: true }));
    api
      .delete(`v1/scm/product/apply/img/list`, {
        params: { imgUploadId: imgIds },
      })
      .then((res) => {
        message.success(res.message);
        setShowModalDelete(false);
        fetchList(tableInfo.tableQuery);
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, delete: false }));
      });
  };

  useEffect(() => {
    fetchList(tableInfo.tableQuery);
  }, []);

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>批次提品圖片上傳</LayoutHeaderTitle>
      </LayoutHeader>

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Form
            form={searchForm}
            autoComplete="off"
            colon={false}
            labelCol={{ flex: "50px" }}
            labelWrap
            labelAlign="left"
            requiredMark={false}
            onFinish={handleFinishSearch}
          >
            <Row gutter={[0, 16]}>
              <Col span={8} xxl={{ span: 6 }}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="createTime"
                  label=""
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    placeholder={["上傳日期起", "上傳日期迄"]}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Space size={16}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading.table}
                  >
                    查詢
                  </Button>

                  <Button
                    type="primary"
                    onClick={() => setShowImageUpload(true)}
                  >
                    上傳圖片
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Col>

        {showImageUpload && (
          <Col span={24}>
            <Form
              form={uploadForm}
              autoComplete="off"
              colon={false}
              labelCol={{ flex: "50px" }}
              labelWrap
              labelAlign="left"
              requiredMark={false}
              disabled={loading.upload}
              onFinish={handleFinishUpload}
            >
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
                        loading={loading.upload}
                        disabled={false}
                        htmlType="submit"
                      >
                        確認
                      </Button>

                      <Button type="default" onClick={handleCloseUpload}>
                        取消
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </ImageCard>
            </Form>
          </Col>
        )}

        <Col span={24}>
          <Spin spinning={loading.table}>
            <Table
              columns={columns}
              dataSource={tableInfo.rows}
              pageInfo={{
                total: tableInfo.total,
                page: tableInfo.page,
                pageSize: tableInfo.pageSize,
              }}
              onChange={handleChangeTable}
            />
          </Spin>
        </Col>
      </Row>

      <ModalDelete
        open={showModalDelete}
        loading={loading.delete}
        onOk={handleDelete}
        onCancel={() => {
          setShowModalDelete(false);
          setDeleteImgIds(undefined);
        }}
      />
    </>
  );
}
