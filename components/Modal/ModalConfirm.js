import { Col, Modal, Row, Spin } from "antd";
import Image from "next/image";
import styled from "styled-components";

import Button from "@/components/Button";

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

export default function ModalConfirm(props) {
  const { open, loading = false, title, subtitle, onOk, onCancel } = props;

  return (
    <Modal width={280} closable={false} open={open} centered footer={null}>
      <Spin spinning={loading}>
        <Row gutter={[0, 16]}>
          <Col span={24}>
            <ImageWrapper>
              <Image src="/warning.svg" alt="" width={56} height={56} />
            </ImageWrapper>
          </Col>

          {title && (
            <Col span={24}>
              <Title>{title}</Title>
            </Col>
          )}

          {subtitle && (
            <Col span={24}>
              <Subtitle>{subtitle}</Subtitle>
            </Col>
          )}

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
