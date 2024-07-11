import { Modal as AntdModal, Col, Row } from "antd";
import Link from "next/link";
import styled from "styled-components";

import Button from "@/components/Button";
import { PATH_PRODUCT_PRODUCT_APPLICATION } from "@/constants/paths";

const StyledModal = styled(AntdModal)`
  &.ant-modal .ant-modal-content {
    padding: 32px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: rgba(95, 95, 95, 1);
  text-align: center;
`;

export default function ModalAddProduct(props) {
  const { open, onCancel } = props;

  return (
    <StyledModal
      footer={null}
      centered
      closeIcon={false}
      width={280}
      open={open}
      onCancel={onCancel}
    >
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <Title>請選擇新增類別</Title>
        </Col>

        <Col span={24}>
          <Link href={`${PATH_PRODUCT_PRODUCT_APPLICATION}/add/food`}>
            <Button style={{ width: "100%" }} type="secondary">
              食品
            </Button>
          </Link>
        </Col>

        <Col span={24}>
          <Link href={`${PATH_PRODUCT_PRODUCT_APPLICATION}/add/non-food`}>
            <Button style={{ width: "100%" }} type="secondary">
              非食品
            </Button>
          </Link>
        </Col>

        <Col span={24}>
          <Button style={{ width: "100%" }} onClick={() => onCancel()}>
            取消
          </Button>
        </Col>
      </Row>
    </StyledModal>
  );
}
