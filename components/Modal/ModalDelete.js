import { Col, Modal, Row, Spin } from "antd";
import styled from "styled-components";

import Button from "@/components/Button";
import Image from "next/image";

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: rgba(95, 95, 95, 1);
  text-align: center;
`;

const Subtitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: rgba(95, 95, 95, 1);
  text-align: center;
`;

const BtnGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

export default function ModalDelete(props) {
  const { open, loading = false, onOk, onCancel } = props;

  return (
    <Modal
      width={280}
      closable={false}
      maskClosable={false}
      open={open}
      centered
      footer={null}
      onCancel={onCancel}
    >
      <Spin spinning={loading}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <ImageWrapper>
              <Image src="/warning.svg" alt="" width={56} height={56} />
            </ImageWrapper>
          </Col>

          <Col span={24}>
            <Title>您確定要刪除</Title>
          </Col>

          <Col span={24}>
            <Subtitle>刪除後將無法復原！</Subtitle>
          </Col>

          <Col span={24}>
            <BtnGroup>
              <Button type="default" onClick={onOk}>
                確定
              </Button>

              <Button type="primary" onClick={onCancel}>
                取消
              </Button>
            </BtnGroup>
          </Col>
        </Row>
      </Spin>
    </Modal>
  );
}
