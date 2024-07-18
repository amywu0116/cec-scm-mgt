import { Modal as AntdModal } from "antd";
import styled from "styled-components";

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

export default function Modal(props) {
  return <StyledModal maskClosable={false} {...props} />;
}
