"use client";
import { ZoomInOutlined, ZoomOutOutlined } from "@ant-design/icons";
import { App, Col, Flex, Form, Image, Row, Space, Tag, Upload } from "antd";
import dayjs from "dayjs";
import fileDownload from "js-file-download";
import Link from "next/link";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { useEffect, useState } from "react";
import styled from "styled-components";

import Button from "@/components/Button";
import FunctionBtn from "@/components/Button/FunctionBtn";
import ResetBtn from "@/components/Button/ResetBtn";
import RangePicker from "@/components/DatePicker/RangePicker";
import Input from "@/components/Input";
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import Select from "@/components/Select";
import Table from "@/components/Table";

import ModalPreviewPDP from "../ModalPreviewPDP";
import ModalAddProduct from "./ModalAddProduct";
import ModalImportError from "./ModalImportError";
import ModalLoading from "./ModalLoading";

import api from "@/api";
import {
  PATH_PRODUCT_APPLICATION,
  PATH_PRODUCT_IMAGE_MAINTENANCE,
} from "@/constants/paths";
import { useBoundStore } from "@/store";
import updateQuery from "@/utils/updateQuery";

const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #56659b;
  line-height: 36px;
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const options = useBoundStore((state) => state.options);
  const applyStatusOptions = options?.apply_status ?? [];

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    itemEan: parseAsString,
    itemName: parseAsString,
    applyStatus: parseAsString,
    applyDate: parseAsArrayOf({
      parse: (query) => dayjs(query),
    }),
    productnumber: parseAsString,
  });

  const [loading, setLoading] = useState({
    page: true,
    table: false,
    import: false,
    export: false,
  });

  const [openModal, setOpenModal] = useState({
    add: false,
    import: false,
    pdpPreview: false,
  });

  const [openFileDialogOnClick, setOpenFileDialogOnClick] = useState(false);

  const [selectedRows, setSelectedRows] = useState([]);
  const [currentApplyId, setCurrentApplyId] = useState();
  const [shipping, setShippingList] = useState([]);

  const [importErrorInfo, setImportErrorInfo] = useState();

  const [tableInfo, setTableInfo] = useState({
    rows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    tableQuery: {},
  });

  const columns = [
    {
      title: "圖片",
      dataIndex: "productImgUrl",
      align: "center",
      render: (text, record) => {
        if (!text) return "-";
        return (
          <Image
            width={40}
            height={40}
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
      title: "品名",
      dataIndex: "itemName",
      align: "center",
      render: (text, record) => {
        return (
          <Link href={`${PATH_PRODUCT_APPLICATION}/edit/${record.applyId}`}>
            {text}
          </Link>
        );
      },
    },
    {
      title: "規格",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        let variationText = "";
        const list = [
          record.variationType1Value,
          record.variationType2Value,
        ].filter(Boolean);

        if (list.length === 0) {
          variationText = "-";
        } else {
          variationText = list.join(" / ");
        }

        return (
          <div>
            <div>{record.itemSpec ?? "-"}</div>
            <div>{variationText}</div>
          </div>
        );
      },
    },
    {
      title: "商品編號/條碼",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <div>{record.productnumber ?? "-"}</div>
            <div>{record.itemEan ?? "-"}</div>
          </>
        );
      },
    },
    {
      title: "價格",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        if (record.price === null && record.specialPrice === null) {
          return "-";
        }
        if (record.price !== null && record.specialPrice === null) {
          return <div>NT${record.price}</div>;
        }
        if (record.price !== null && record.specialPrice !== null) {
          return (
            <>
              <div>NT${record.specialPrice}</div>
              <div style={{ textDecoration: "line-through", color: "#ccc" }}>
                NT${record.price}
              </div>
            </>
          );
        }
      },
    },
    {
      title: "庫存",
      dataIndex: "perpetual",
      align: "center",
      render: (text, record) => {
        if (text) return "不庫控";
        if (!text) return record.stock;
      },
    },
    {
      title: "審核狀態",
      dataIndex: "applyStatusName",
      align: "center",
      render: (text) => {
        if (text === "審核退件") {
          return <Tag color="red">{text}</Tag>;
        }
        return text;
      },
    },
    {
      title: "預覽",
      dataIndex: "",
      align: "center",
      render: (text, record) => {
        return (
          <FunctionBtn
            onClick={() => {
              setCurrentApplyId(record.applyId);
              setOpenModal((state) => ({ ...state, pdpPreview: true }));
            }}
          >
            PDP
          </FunctionBtn>
        );
      },
    },
    {
      title: "功能",
      dataIndex: "",
      align: "center",
      render: (text, record, index) => {
        return (
          <Link
            href={{
              pathname: `${PATH_PRODUCT_IMAGE_MAINTENANCE}/apply/${record.applyId}`,
              query: {
                itemName: record.itemName,
                itemEan: record.itemEan,
              },
            }}
          >
            <FunctionBtn
              color="green"
              disabled={["審核通過"].includes(record.applyStatusName)}
            >
              商品相關圖檔維護
            </FunctionBtn>
          </Link>
        );
      },
    },
  ];

  const transformParams = (values) => {
    const params = {
      applyDateStart: values.applyDate
        ? values.applyDate[0].format("YYYY-MM-DD")
        : undefined,
      applyDateEnd: values.applyDate
        ? values.applyDate[1].format("YYYY-MM-DD")
        : undefined,
      applyStatus: values.applyStatus,
      itemEan: values.itemEan ? values.itemEan : undefined,
      itemName: values.itemName ? values.itemName : undefined,
      productnumber: values.productnumber ? values.productnumber : undefined,
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
    };

    return params;
  };

  const fetchList = (values) => {
    updateQuery(values, setQuery);
    const newParams = transformParams(values);
    setSelectedRows([]);
    setLoading((state) => ({ ...state, table: true }));
    api
      .get("v1/scm/product/apply", { params: newParams })
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

  // 分車類型下拉選單內容
  const fetchShipping = () => {
    setLoading((state) => ({ ...state, page: true }));
    api
      .get("v1/scm/vendor/shipping")
      .then((res) => setShippingList(res.data))
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, page: false })));
  };

  const refreshTable = () => {
    fetchList({ ...tableInfo.tableQuery });
    setSelectedRows([]);
  };

  const handleFinish = (values) => {
    fetchList({ ...values, page: 1, pageSize: 10 });
  };

  const handleChangeTable = (page, pageSize) => {
    fetchList({ ...tableInfo.tableQuery, page, pageSize });
  };

  // 送審
  const handleApply = () => {
    setLoading((state) => ({ ...state, table: true }));
    api
      .post(`v1/scm/product/apply`, {
        applyIds: selectedRows.map((row) => row.applyId),
      })
      .then(() => {
        message.success("送審成功");
        refreshTable();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  // 刪除
  const handleDeleteApply = () => {
    setLoading((state) => ({ ...state, table: true }));
    api
      .delete(`v1/scm/product/apply`, {
        data: { applyIds: selectedRows.map((row) => row.applyId) },
      })
      .then((res) => {
        message.success(res.message);
        refreshTable();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, table: false }));
      });
  };

  // 提品匯入範例下載
  const handleDownloadFile = () => {
    const link = document.createElement("a");
    link.href = "/files/提品匯入範例.xlsx";
    link.download = "提品匯入範例.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 提品匯入
  const handleImport = (file) => {
    setOpenModal((state) => ({ ...state, loading: true }));

    if (file.file.status === "done") {
      const formData = new FormData();
      formData.append("file", file.file.originFileObj);

      setLoading((state) => ({ ...state, import: true }));
      api
        .post(`v1/scm/product/apply/new/batch`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImportErrorInfo(res.data);
          setOpenModal((state) => ({ ...state, import: true }));
        })
        .catch((err) => {
          message.error(err.message);
        })
        .finally(() => {
          setLoading((state) => ({ ...state, import: false }));
          setOpenModal((state) => ({ ...state, loading: false }));
        });
    }
  };

  // 提品匯入前先檢核是否有分車
  const handleClickUpload = () => {
    if (shipping.length === 0) {
      message.error("請先至 供應商>運費設定 功能頁面，進行運費設定！");
      return;
    }
    setOpenFileDialogOnClick(true);
  };

  // 提品清單匯出
  const handleExport = () => {
    const newParams = transformParams(form.getFieldsValue());
    delete newParams.max;
    delete newParams.offset;
    setLoading((state) => ({ ...state, export: true }));
    api
      .get(`v1/scm/product/apply/search/export`, {
        params: newParams,
        responseType: "arraybuffer",
      })
      .then((res) => fileDownload(res, "提品清單.xlsx"))
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, export: false })));
  };

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchList(query);
    form.setFieldsValue({
      itemEan: query.itemEan,
      itemName: query.itemName,
      applyStatus: query.applyStatus,
      applyDate: query.applyDate,
      productnumber: query.productnumber,
    });
  }, []);

  useEffect(() => {
    fetchShipping();
  }, []);

  return (
    <>
      <LayoutHeader>
        <LayoutHeaderTitle>提品申請</LayoutHeaderTitle>

        <Space style={{ marginLeft: "auto" }} size={16}>
          <div style={{ color: "#595959" }}>*匯入筆數一次最多 200 筆</div>

          <Button onClick={handleDownloadFile}>提品匯入範例下載</Button>

          <Upload
            disabled={loading.import}
            showUploadList={false}
            openFileDialogOnClick={openFileDialogOnClick}
            onChange={handleImport}
          >
            <Button
              type="secondary"
              loading={loading.import}
              onClick={handleClickUpload}
            >
              提品匯入
            </Button>
          </Upload>

          <Button
            type="primary"
            onClick={() => setOpenModal((state) => ({ ...state, add: true }))}
          >
            新增提品
          </Button>
        </Space>
      </LayoutHeader>

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Form
            form={form}
            autoComplete="off"
            labelCol={{ flex: "80px" }}
            labelWrap
            colon={false}
            disabled={loading.table}
            onFinish={handleFinish}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item name="applyDate" label="日期">
                  <RangePicker
                    style={{ width: "100%" }}
                    placeholder={["日期起", "日期迄"]}
                  />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="productnumber"
                  label="商城商品編號"
                >
                  <Input placeholder="請輸入商城商品編號" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="itemEan"
                  label="條碼"
                >
                  <Input placeholder="請輸入條碼" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="itemName"
                  label="品名"
                >
                  <Input placeholder="請輸入品名" />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="applyStatus"
                  label="狀態"
                >
                  <Select
                    placeholder="請選擇狀態"
                    showSearch
                    allowClear
                    options={applyStatusOptions.map((opt) => ({
                      ...opt,
                      label: opt.name,
                    }))}
                  />
                </Form.Item>
              </Col>

              <Space style={{ marginLeft: "auto" }} size={16}>
                <Button
                  type="secondary"
                  loading={loading.table}
                  disabled={false}
                  htmlType="submit"
                >
                  查詢
                </Button>

                <ResetBtn htmlType="reset">清除查詢條件</ResetBtn>
              </Space>
            </Row>
          </Form>
        </Col>

        <Col span={24}>
          <Row gutter={[0, 16]}>
            <Col span={24}>
              <TableTitle>申請列表</TableTitle>
            </Col>

            <Col span={24}>
              <Flex gap={16}>
                <Button
                  type="secondary"
                  loading={loading.export}
                  onClick={handleExport}
                >
                  提品清單匯出
                </Button>

                {selectedRows.length > 0 && (
                  <>
                    <Button type="default" onClick={handleApply}>
                      送審
                    </Button>

                    <Button type="default" onClick={handleDeleteApply}>
                      刪除
                    </Button>
                  </>
                )}
              </Flex>
            </Col>

            <Col span={24}>
              <Table
                rowKey="applyId"
                loading={loading.table}
                rowSelection={{
                  selectedRowKeys: selectedRows.map((row) => row.applyId),
                  onChange: (selectedRowKeys, selectedRows) => {
                    setSelectedRows(selectedRows);
                  },
                }}
                pageInfo={{
                  total: tableInfo.total,
                  page: tableInfo.page,
                  pageSize: tableInfo.pageSize,
                }}
                columns={columns}
                dataSource={tableInfo.rows}
                onChange={handleChangeTable}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      <ModalAddProduct
        open={openModal.add}
        onCancel={() => {
          setOpenModal((state) => ({ ...state, add: false }));
        }}
      />

      <ModalImportError
        info={importErrorInfo}
        open={openModal.import}
        onCancel={() => {
          setOpenModal((state) => ({ ...state, import: false }));
        }}
      />

      <ModalPreviewPDP
        type="apply"
        id={currentApplyId}
        open={openModal.pdpPreview}
        onCancel={() => {
          setOpenModal((state) => ({ ...state, pdpPreview: false }));
        }}
      />

      <ModalLoading
        open={openModal.loading}
        onCancel={() => {
          setOpenModal((state) => ({ ...state, loading: false }));
        }}
      />
    </>
  );
}
