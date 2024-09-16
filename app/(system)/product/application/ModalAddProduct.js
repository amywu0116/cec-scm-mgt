import { Modal as AntdModal, Flex } from "antd";
import Link from "next/link";
import styled from "styled-components";

import Button from "@/components/Button";
import { routes } from "@/routes";

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
      <Flex vertical gap={16}>
        <Title>請選擇新增類別</Title>

        <Link href={routes.product.applicationAdd("food")}>
          <Button style={{ width: "100%" }} type="secondary">
            食品
          </Button>
        </Link>

        <Link href={routes.product.applicationAdd("non-food")}>
          <Button style={{ width: "100%" }} type="secondary">
            非食品
          </Button>
        </Link>

        <Button style={{ width: "100%" }} onClick={() => onCancel()}>
          取消
        </Button>
      </Flex>
    </StyledModal>
  );
}
