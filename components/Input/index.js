import { Input as AntdInput } from "antd";
import styled from "styled-components";

const StyledInput = styled(AntdInput)`
  &.ant-input {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;
  }

  &.ant-input-outlined[disabled] {
    color: rgba(0, 0, 0, 0.25);
  }

  &.ant-input-affix-wrapper {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;

    > .ant-input-disabled {
      color: rgba(0, 0, 0, 0.25);
    }
  }
`;

export default function Input(props) {
  return <StyledInput {...props} />;
}
