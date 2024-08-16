"use client";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { App, Col, Form, Image, Row, Space, Spin } from "antd";
import { useParams } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import Input from "@/components/Input";
import Table from "@/components/Table";

import api from "@/api";
import updateQuery from "@/utils/updateQuery";

export default function SearchForm(props) {
  const { fetchProductImgList } = props;
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const params = useParams();
  const type = params.type;
  const isApply = type === "apply";
  const isProduct = type === "product";
  const id = params.id;

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    fileName: parseAsString,
  });

  const [loading, setLoading] = useState({ table: false });

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const columns = [
    {
      title: "No.",
      dataIndex: "no",
      align: "center",
      render: (text, record, index) => {
        return tableInfo.total - tableInfo.offset - index;
      },
    },
    {
      title: "圖片類型",
      dataIndex: "imgTypeName",
      align: "center",
    },
    {
      title: "檔名",
      dataIndex: "fileName",
      align: "center",
    },
    {
      title: "圖片",
      dataIndex: "imgUrl",
      align: "center",
      render: (text, record, index) => {
        return (
          <Image
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
                </Space>
              ),
            }}
          />
        );
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
      dataIndex: "canBind",
      align: "center",
      render: (text, record, index) => {
        return (
          <FunctionBtn
            loading={loading[`bind_${record.id}`]}
            disabled={!text}
            onClick={() => handleBind(record.id)}
          >
            綁定
          </FunctionBtn>
        );
      },
    },
  ];

  const fetchList = (values) => {
    updateQuery(values, setQuery);

    const params = {
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
      fileName: values.fileName,
      applyId: isProduct ? undefined : isApply ? id : undefined,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/product/apply/img/list`, { params })
      .then((res) => {
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: values.page,
          pageSize: values.pageSize,
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

  const handleBind = (imgId) => {
    const apiUrl = isProduct
      ? `v1/scm/product/img?productId=${id}`
      : isApply
        ? `v1/scm/product/apply/img/bind`
        : "";

    const params = isProduct
      ? { imgId }
      : isApply
        ? { applyId: id, imgId }
        : undefined;

    setLoading((state) => ({ ...state, [`bind_${imgId}`]: true }));
    api
      .post(apiUrl, params)
      .then((res) => {
        message.success(res.message);
        fetchList(tableInfo.tableQuery);
        fetchProductImgList();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, [`bind_${imgId}`]: false }));
      });
  };

  const handleFinish = (values) => {
    fetchList({ ...values, page: 1, pageSize: 10 });
  };

  const handleChangeTable = (page, pageSize) => {
    fetchList({ ...tableInfo.tableQuery, page, pageSize });
  };

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchList(query);
    form.setFieldsValue({
      fileName: query.fileName,
    });
  }, []);

  return (
    <Form
      form={form}
      autoComplete="off"
      colon={false}
      disabled={loading.table}
      onFinish={handleFinish}
    >
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Row gutter={16}>
            <Col span={8} xxl={{ span: 6 }}>
              <Form.Item
                style={{ marginBottom: 0 }}
                name="fileName"
                label="圖片檔名"
              >
                <Input />
              </Form.Item>
            </Col>

            <Col>
              <Button
                type="secondary"
                htmlType="submit"
                loading={loading.table}
                disabled={false}
              >
                查詢
              </Button>
            </Col>
          </Row>
        </Col>

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
    </Form>
  );
}
