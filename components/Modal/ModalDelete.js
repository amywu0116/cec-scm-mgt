import { Modal } from "antd";
import styled from "styled-components";

import Button from "@/components/Button";
import Image from "next/image";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

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

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px 0;
`;

const ModalDelete = (props) => {
  const { open, onOk, onCancel } = props;

  return (
    <Modal
      width={280}
      closable={false}
      open={open}
      centered
      footer={null}
      onCancel={onCancel}
    >
      <Content>
        <ImageWrapper>
          <Image src="/warning.svg" alt="" width={56} height={56} />
        </ImageWrapper>

        <Title>您確定要刪除</Title>

        <Subtitle>刪除後將無法復原！</Subtitle>

        <ButtonGroup>
          <Button style={{ width: "100%" }} type="default" onOk={onOk}>
            確定
          </Button>

          <Button style={{ width: "100%" }} type="primary" onClick={onCancel}>
            取消
          </Button>
        </ButtonGroup>
      </Content>
    </Modal>
  );
};

export default ModalDelete;
