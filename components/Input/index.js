import { Input as AntdInput } from "antd";
import styled from "styled-components";

const StyledInput = styled(AntdInput)`
  &.ant-input {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
  }

  &.ant-input-affix-wrapper {
    height: 42px;
    font-size: 14px;
    font-weight: 400;
  }
`;

export default function Input(props) {
  return <StyledInput allowClear {...props} />;
}
