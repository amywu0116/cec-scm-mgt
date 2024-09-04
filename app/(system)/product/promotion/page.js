"use client";
import { App, Col, Divider, Flex, Form, Row } from "antd";
import dayjs from "dayjs";
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
import { LayoutHeader, LayoutHeaderTitle } from "@/components/Layout";
import ModalConfirm from "@/components/Modal/ModalConfirm";
import Select from "@/components/Select";
import Table from "@/components/Table";

import api from "@/api";
import {
  PATH_PRODUCT_PROMOTION_ADD,
  PATH_PRODUCT_PROMOTION_EDIT,
} from "@/constants/paths";
import updateQuery from "@/utils/updateQuery";

const Container = styled.div``;

const Card = styled.div`
  background-color: rgba(241, 243, 246, 1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

export default function Page() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [query, setQuery] = useQueryStates({
    page: parseAsInteger,
    pageSize: parseAsInteger,
    promotionId: parseAsString,
    time: parseAsArrayOf({
      parse: (query) => dayjs(query),
    }),
  });

  const [loading, setLoading] = useState({
    table: false,
    delete: false,
  });

  const [openModal, setOpenModal] = useState({
    delete: false,
  });

  const [discountOptions, setDiscountOptions] = useState([]);

  const [deleteId, setDeleteId] = useState();

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
      dataIndex: "id",
      align: "center",
    },
    {
      title: "促銷ID",
      dataIndex: "promotionId",
      align: "center",
      render: (text, record) => {
        return (
          <Link href={`${PATH_PRODUCT_PROMOTION_EDIT}/${record.id}`}>
            {discountOptions.find((opt) => opt.key === text)?.name ?? "-"}
          </Link>
        );
      },
    },
    {
      title: "起日",
      dataIndex: "startTime",
      align: "center",
    },
    {
      title: "迄日",
      dataIndex: "endTime",
      align: "center",
    },
    {
      title: "功能",
      align: "center",
      render: (text, record, index) => {
        return (
          <FunctionBtn
            loading={loading[`delete_${record.id}`]}
            onClick={() => {
              setDeleteId(record.id);
              setOpenModal((state) => ({ ...state, delete: true }));
            }}
          >
            刪除
          </FunctionBtn>
        );
      },
    },
  ];

  // 抓取 "促銷ID" 下拉選單內容
  const fetchDiscount = () => {
    api
      .get(`v1/system/option/scmDiscount`)
      .then((res) => setDiscountOptions(res.data))
      .catch((err) => message.error(err.message))
      .finally(() => {});
  };

  const fetchTableInfo = (values) => {
    updateQuery(values, setQuery);
    const params = {
      offset: (values.page - 1) * values.pageSize,
      max: values.pageSize,
      promotionId: values.promotionId,
      startTime: values.time ? values.time[0].format("YYYY-MM-DD") : undefined,
      endTime: values.time ? values.time[1].format("YYYY-MM-DD") : undefined,
    };

    setLoading((state) => ({ ...state, table: true }));
    api
      .get(`v1/scm/vendor_promotion`, { params })
      .then((res) => {
        setTableInfo((state) => ({
          ...state,
          ...res.data,
          page: values.page,
          pageSize: values.pageSize,
          tableQuery: { ...values },
        }));
      })
      .catch((err) => message.error(err.message))
      .finally(() => setLoading((state) => ({ ...state, table: false })));
  };

  const handleFinish = (values) => {
    fetchTableInfo({ ...values, page: 1, pageSize: 10 });
  };

  const handleChangeTable = (page, pageSize) => {
    fetchTableInfo({ ...tableInfo.tableQuery, page, pageSize });
  };

  const handleDelete = () => {
    const params = {
      promotionIds: deleteId,
    };

    setLoading((state) => ({ ...state, delete: true }));
    api
      .delete(`v1/scm/vendor_promotion`, { params })
      .then((res) => {
        message.success(res.message);
        setOpenModal((state) => ({ ...state, delete: false }));
        form.submit();
      })
      .catch((err) => message.error(err.message))
      .finally(() => {
        setLoading((state) => ({ ...state, delete: false }));
        setDeleteId(undefined);
      });
  };

  useEffect(() => {
    fetchDiscount();
  }, []);

  useEffect(() => {
    if (Object.values(query).every((q) => q === null)) return;
    fetchTableInfo(query);
    form.setFieldsValue({
      promotionId: query.promotionId,
      time: query.time,
    });
  }, []);

  return (
    <Container>
      <LayoutHeader>
        <LayoutHeaderTitle>商品促銷</LayoutHeaderTitle>
      </LayoutHeader>

      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Form
            form={form}
            colon={false}
            labelCol={{ flex: "80px" }}
            labelWrap
            labelAlign="left"
            requiredMark={false}
            disabled={loading.table}
            onFinish={handleFinish}
          >
            <Card>
              <Row gutter={32}>
                <Col span={8}>
                  <Form.Item
                    style={{ margin: 0 }}
                    name="promotionId"
                    label="促銷ID"
                  >
                    <Select
                      placeholder="選擇商品代碼或名稱"
                      popupMatchSelectWidth={false}
                      options={discountOptions.map((opt) => {
                        return { ...opt, label: opt.name };
                      })}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item style={{ margin: 0 }} name="time" label="日期">
                    <RangePicker
                      style={{ width: "100%" }}
                      placeholder={["日期起", "日期迄"]}
                      allowEmpty={[true, true]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider style={{ margin: 0 }} />

              <Flex style={{ marginLeft: "auto" }} gap={16} align="center">
                <Button type="secondary" htmlType="submit">
                  查詢
                </Button>

                <ResetBtn htmlType="reset">清除查詢條件</ResetBtn>
              </Flex>
            </Card>
          </Form>
        </Col>

        <Col span={24}>
          <Flex style={{ width: "100%" }} vertical gap={16}>
            <div>
              <Link href={PATH_PRODUCT_PROMOTION_ADD}>
                <Button type="primary">新增促銷方案商品</Button>
              </Link>
            </div>

            <Table
              rowKey="id"
              loading={loading.table}
              columns={columns}
              dataSource={tableInfo.rows}
              pageInfo={{
                total: tableInfo.total,
                page: tableInfo.page,
                pageSize: tableInfo.pageSize,
              }}
              onChange={handleChangeTable}
            />
          </Flex>
        </Col>
      </Row>

      <ModalConfirm
        open={openModal.delete}
        loading={loading.delete}
        title="刪除促銷方案商品"
        subtitle="確定要刪除促銷方案商品？"
        onOk={handleDelete}
        onCancel={() => setOpenModal((state) => ({ ...state, delete: false }))}
      />
    </Container>
  );
}
