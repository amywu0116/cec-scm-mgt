"use client";
import { App, Col, Form, Radio, Row } from "antd";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";

import api from "@/api";
import { useBoundStore } from "@/store";

export default function ModalAddress(props) {
  const { info, open, onOk, onCancel } = props;
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const params = useParams();
  const ecorderShipId = params.ecorderShipId;

  const zipCity = useBoundStore((state) => state.zipCity);
  const city = Form.useWatch("city", form);
  const areaOptions = zipCity?.find((c) => c.cityName === city)?.child;

  const options = useBoundStore((state) => state.options);
  const elevatorType = options?.elevator_type ?? [];
  const receiveType = options?.receive_type ?? [];

  const [loading, setLoading] = useState({
    address: false,
  });

  const handleFinish = (values) => {
    const data = {
      receiverZip: values.receiverZip,
      receiverAddress: values.receiverAddress,
      receiverAddressRemark: values.receiverAddressRemark,
      receiverElevator: values.receiverElevator,
      receiverReceive: values.receiverReceive,
    };

    setLoading((state) => ({ ...state, address: true }));
    api
      .post(`v1/scm/order/${ecorderShipId}/address`, data)
      .then((res) => {
        message.success(res.message);
        onOk();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setLoading((state) => ({ ...state, address: false }));
      });
  };

  useEffect(() => {
    form.setFieldsValue({
      isPageInitial: true,
      receiverElevator: info.receiverElevator,
      receiverReceive: info.receiverReceive,
      receiverAddressRemark: info.receiverAddressRemark,
      receiverZip: info.receiverZip,
      receiverAddress: info.receiverAddress,
      city: info.receiverCityName,
    });
  }, [info]);

  // 選擇縣市時要把區清空
  useEffect(() => {
    form.setFieldValue("receiverZip", undefined);
  }, [city]);

  // 回填資料時要等縣市設定完才能設定區
  useEffect(() => {
    if (form.getFieldValue("isPageInitial") && areaOptions) {
      form.setFieldsValue({
        isPageInitial: false,
        receiverZip: info.receiverZip,
      });
    }
  }, [areaOptions]);

  return (
    <Modal
      title="修改配送地址"
      centered
      closeIcon={false}
      width={800}
      destroyOnClose
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" disabled={loading.address} onClick={onCancel}>
          取消
        </Button>,
        <Button
          key="ok"
          type="primary"
          loading={loading.address}
          onClick={() => form.submit()}
        >
          確定送出
        </Button>,
      ]}
    >
      <Form
        form={form}
        colon={false}
        labelCol={{ flex: "80px" }}
        labelWrap
        labelAlign="left"
        requiredMark={false}
        autoComplete="off"
        preserve={false}
        disabled={loading.address}
        onFinish={handleFinish}
      >
        <Row gutter={32}>
          <Col span={8}>
            <Form.Item
              name="city"
              label="縣市"
              rules={[{ required: true, message: "必填" }]}
            >
              <Select
                placeholder="選擇縣市"
                options={
                  zipCity?.map((c) => ({
                    ...c,
                    label: c.cityName,
                    value: c.cityName,
                  })) ?? []
                }
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="receiverZip"
              label="區"
              rules={[{ required: true, message: "必填" }]}
            >
              <Select
                placeholder="選擇區"
                disabled={!city || loading.address}
                options={
                  areaOptions?.map((c) => ({
                    ...c,
                    label: `${c.zipcode} ${c.cityName}`,
                    value: c.zipcode,
                  })) ?? []
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={32}>
          <Col span={12}>
            <Form.Item
              name="receiverAddress"
              label="路"
              rules={[{ required: true, message: "必填" }]}
            >
              <TextArea rows={6} autoSize={{ minRows: 3, maxRows: 3 }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="receiverAddressRemark" label="地址備註">
              <TextArea rows={6} autoSize={{ minRows: 3, maxRows: 3 }} />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name="receiverElevator"
              label="電梯"
              rules={[{ required: true, message: "必填" }]}
            >
              <Radio.Group
                options={elevatorType.map((t) => ({ ...t, label: t.name }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Form.Item
              name="receiverReceive"
              label="簽收"
              rules={[{ required: true, message: "必填" }]}
            >
              <Radio.Group
                options={receiveType.map((t) => ({ ...t, label: t.name }))}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
