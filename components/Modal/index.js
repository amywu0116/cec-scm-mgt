import { Modal as AntdModal } from "antd";
import styled from "styled-components";

import Button from "@/components/Button";

const StyledModal = styled(AntdModal)`
  &.ant-modal .ant-modal-content {
    padding: 20px 24px 90px;
  }

  &.ant-modal .ant-modal-footer > button.ant-btn + button.ant-btn {
    margin-inline-start: 16px;
  }

  &.ant-modal .ant-modal-title {
    line-height: 42px;
  }

  &.ant-modal .ant-modal-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 16px 10px;
    background-color: #f1f4f7;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const Modal = (props) => {
  const {
    okText = "",
    onOk = () => {},
    okButtonProps = {},
    cancelText = "",
    onCancel = () => {},
    cancelButtonProps = {},
  } = props;

  return (
    <StyledModal
      footer={[
        <Button {...cancelButtonProps} onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button {...okButtonProps} type="primary" onClick={onOk}>
          {okText}
        </Button>,
      ]}
      {...props}
    />
  );
};

export default Modal;
