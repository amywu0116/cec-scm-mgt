import { Modal as AntdModal } from "antd";
import styled from "styled-components";

import Button from "@/components/Button";

const StyledModal = styled(AntdModal)`
  &.ant-modal .ant-modal-content {
    padding: 32px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: rgba(95, 95, 95, 1);
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const ModalAddProduct = (props) => {
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
      <Content>
        <Title>請選擇新增類別</Title>
        <ButtonGroup>
          <Button type="secondary">食品</Button>
          <Button type="secondary">非食品</Button>
          <Button onClick={() => onCancel()}>取消</Button>
        </ButtonGroup>
      </Content>
    </StyledModal>
  );
};

export default ModalAddProduct;
