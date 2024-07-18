import { Button as AntdButton } from "antd";
import styled from "styled-components";

// type: default, primary, secondary

const StyledButton = styled(AntdButton)`
  &.ant-btn {
    min-width: 148px;
    height: 42px;
    font-size: 15px;
    font-weight: 700;
  }

  &.ant-btn-default,
  &.ant-btn-primary,
  &.ant-btn-secondary {
    &:not(:disabled):not(.ant-btn-disabled):hover {
      background-color: #3f96ff;
      color: #ffffff;
    }

    &:disabled {
      cursor: not-allowed;
      border-color: #d9d9d9;
      color: rgba(0, 0, 0, 0.25);
      background: rgba(0, 0, 0, 0.04);
      box-shadow: none;
    }
  }

  &.ant-btn-default {
    color: #5f5f5f;
  }

  &.ant-btn-primary {
    background: #5380f7;
    color: #ffffff;
  }

  &.ant-btn-secondary {
    background: #5380f733;
    color: #5380f7;
  }
`;

export default function Button(props) {
  return <StyledButton autoInsertSpace={false} {...props} />;
}
